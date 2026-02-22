import TestResult from '../models/TestResult.js';
import * as metamorphicRules from '../utils/metamorphicRules.js';
import { 
  queryModel, 
  getAvailableModels,
  getModels as getDynamicModels,  // Renamed this import to avoid conflict
  searchHuggingFaceModels,
  getModelsByTask 
} from '../services/huggingFaceService.js';

// @desc    Run a metamorphic test
// @route   POST /api/tests/run
export const runTest = async (req, res) => {
  try {
    const { sourceInput, MRType, modelId } = req.body;

    if (!sourceInput || !MRType || !modelId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Apply metamorphic transformation
    let followupInput;
    switch (MRType) {
      case 'SYNONYM':
        followupInput = await metamorphicRules.applySynonymReplacement(sourceInput);
        break;
      case 'GENDER_SWAP':
        followupInput = metamorphicRules.applyGenderSwap(sourceInput);
        break;
      case 'PUNCTUATION':
        followupInput = metamorphicRules.applyPunctuationChange(sourceInput);
        break;
      case 'NEGATION':
        followupInput = metamorphicRules.applyNegation(sourceInput);
        break;
      case 'PARAPHRASE':
        followupInput = metamorphicRules.applyParaphrase(sourceInput);
        break;
      default:
        return res.status(400).json({ error: 'Invalid MR type' });
    }

    // Get model predictions
    const [sourceOutput, followupOutput] = await Promise.all([
      queryModel(modelId, sourceInput),
      queryModel(modelId, followupInput)
    ]);

    // Check for MR violation
    const isViolated = metamorphicRules.checkSentimentViolation(
      sourceOutput,
      followupOutput,
      MRType
    );

    // Save to database
    const testResult = new TestResult({
      source_input: sourceInput,
      followup_input: followupInput,
      source_output: sourceOutput,
      followup_output: followupOutput,
      MR_type: MRType,
      is_violated: isViolated,
      model_id: modelId,
      timestamp: new Date()
    });

    await testResult.save();

    res.status(201).json({
      success: true,
      data: {
        id: testResult._id,
        sourceInput,
        followupInput,
        sourceOutput,
        followupOutput,
        MRType,
        isViolated,
        verdict: isViolated ? '🔴 METAMORPHIC BUG DETECTED' : '✅ Test Passed'
      }
    });

  } catch (error) {
    console.error('Test execution error:', error);
    res.status(500).json({ error: 'Failed to run test: ' + error.message });
  }
};

// @desc    Get all test results
// @route   GET /api/tests/results
export const getResults = async (req, res) => {
  try {
    const { modelId, MRType, limit = 100 } = req.query;
    
    const query = {};
    if (modelId) query.model_id = modelId;
    if (MRType) query.MR_type = MRType;

    const results = await TestResult.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

// @desc    Get analytics dashboard data
// @route   GET /api/tests/analytics
export const getAnalytics = async (req, res) => {
  try {
    const { modelId } = req.query;

    const matchStage = modelId ? { model_id: modelId } : {};

    const analytics = await TestResult.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            model_id: '$model_id',
            MR_type: '$MR_type'
          },
          totalTests: { $sum: 1 },
          violations: { 
            $sum: { $cond: ['$is_violated', 1, 0] }
          },
          avgConfidence: { $avg: '$confidence_score' }
        }
      },
      {
        $project: {
          model_id: '$_id.model_id',
          MR_type: '$_id.MR_type',
          totalTests: 1,
          violations: 1,
          passRate: {
            $multiply: [
              { $divide: [
                { $subtract: ['$totalTests', '$violations'] },
                '$totalTests'
              ]},
              100
            ]
          },
          avgConfidence: 1
        }
      },
      { $sort: { model_id: 1, MR_type: 1 } }
    ]);

    // Get overall statistics
    const overallStats = await TestResult.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$model_id',
          totalTests: { $sum: 1 },
          totalViolations: { $sum: { $cond: ['$is_violated', 1, 0] } },
          uniqueMRs: { $addToSet: '$MR_type' }
        }
      },
      {
        $project: {
          model_id: '$_id',
          totalTests: 1,
          totalViolations: 1,
          reliabilityScore: {
            $multiply: [
              { $divide: [
                { $subtract: ['$totalTests', '$totalViolations'] },
                '$totalTests'
              ]},
              100
            ]
          },
          uniqueMRs: { $size: '$uniqueMRs' }
        }
      }
    ]);

    // Get time series data for trends
    const timeSeriesData = await TestResult.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            model_id: '$model_id'
          },
          dailyTests: { $sum: 1 },
          dailyViolations: { $sum: { $cond: ['$is_violated', 1, 0] } }
        }
      },
      { $sort: { '_id.date': 1 } },
      { $limit: 30 }
    ]);

    res.json({
      success: true,
      data: {
        byMRType: analytics,
        overall: overallStats,
        trends: timeSeriesData,
        availableModels: await TestResult.distinct('model_id')
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
};

// @desc    Get available models from config (UPDATED VERSION)
// @route   GET /api/tests/models
export const getModels = async (req, res) => {
  try {
    const { includeDynamic, task } = req.query;
    
    let models;
    
    // If includeDynamic is true, use the new dynamic loading
    if (includeDynamic === 'true' || task) {
      if (task) {
        // Get models by specific task
        models = await getModelsByTask(task, 10);
      } else {
        // Get all models with dynamic ones
        models = await getDynamicModels(true);  // Using renamed import
      }
    } else {
      // Use your original static models (for backward compatibility)
      models = getAvailableModels();
    }
    
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};

// @desc    Search for models on Hugging Face
// @route   GET /api/tests/search-models
export const searchModels = async (req, res) => {
  try {
    const { query, task } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const models = await searchHuggingFaceModels(query, task);
    
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search models' });
  }
};