import TestResult from '../models/TestResult.js';
import * as metamorphicRules from '../utils/metamorphicRules.js';
import { 
  queryModel, 
  getAvailableModels,
  getModels as getDynamicModels,
  searchHuggingFaceModels,
  getModelsByTask 
} from '../services/huggingFaceService.js';

// @desc    Get available MR types
// @route   GET /api/tests/mr-types
export const getMRTypes = async (req, res) => {
  try {
    // ✅ YAHAN NAYE MR TYPES ADD KARO
    const mrTypes = [
      { 
        value: 'SYNONYM', 
        label: 'Synonym Replacement', 
        description: 'Tests semantic consistency by replacing words with synonyms',
        icon: '🔄',
        color: 'blue',
        category: 'semantic'
      },
      { 
        value: 'GENDER_SWAP', 
        label: 'Gender Swap', 
        description: 'Fairness & bias check by swapping gender-specific terms',
        icon: '⚥',
        color: 'purple',
        category: 'fairness'
      },
      { 
        value: 'PUNCTUATION', 
        label: 'Punctuation Perturbation', 
        description: 'Robustness check by modifying punctuation',
        icon: '❗',
        color: 'yellow',
        category: 'robustness'
      },
      { 
        value: 'NEGATION', 
        label: 'Negation', 
        description: 'Logical consistency by adding/removing negation',
        icon: '🚫',
        color: 'red',
        category: 'logical'
      },
      { 
        value: 'PARAPHRASE', 
        label: 'Paraphrase', 
        description: 'Semantic invariance through rephrasing',
        icon: '📝',
        color: 'green',
        category: 'semantic'
      },
      // 👇 NAYE MR TYPES YAHAN ADD KARO
      { 
        value: 'TYPO_CORRECTION', 
        label: 'Typo Correction', 
        description: 'Tests robustness to spelling mistakes by introducing common typos',
        icon: '✏️',
        color: 'pink',
        category: 'robustness'
      },
      { 
        value: 'TENSE_CHANGE', 
        label: 'Tense Change', 
        description: 'Tests if model understands past/present/future tense changes',
        icon: '⏰',
        color: 'orange',
        category: 'grammar'
      },
      { 
        value: 'CAPITALIZATION', 
        label: 'Capitalization', 
        description: 'Tests if case sensitivity affects model output',
        icon: '🔠',
        color: 'indigo',
        category: 'robustness'
      },
      { 
        value: 'CONTRACTION_EXPANSION', 
        label: 'Contraction Expansion', 
        description: 'Tests if contractions vs full forms affect sentiment (e.g., "don\'t" vs "do not")',
        icon: '📎',
        color: 'teal',
        category: 'grammar'
      },
      { 
        value: 'NUMBER_TO_WORD', 
        label: 'Number to Word', 
        description: 'Tests if numeric vs written numbers affect sentiment (e.g., "5" vs "five")',
        icon: '🔢',
        color: 'amber',
        category: 'robustness'
      },
      { 
        value: 'EMOJI_REMOVAL', 
        label: 'Emoji Removal', 
        description: 'Tests if removing emojis affects sentiment',
        icon: '😊',
        color: 'yellow',
        category: 'robustness'
      },
      { 
        value: 'REPETITION', 
        label: 'Repetition', 
        description: 'Tests if word repetition affects sentiment (e.g., "very very good")',
        icon: '🔁',
        color: 'cyan',
        category: 'semantic'
      },
      { 
        value: 'FORMAL_TO_INFORMAL', 
        label: 'Formal to Informal', 
        description: 'Tests if formality level affects sentiment',
        icon: '👔',
        color: 'slate',
        category: 'style'
      },
      { 
        value: 'ACTIVE_TO_PASSIVE', 
        label: 'Active to Passive', 
        description: 'Tests if voice change affects sentiment',
        icon: '🔄',
        color: 'violet',
        category: 'grammar'
      }
    ];
    
    // Optional: Filter by category
    const { category } = req.query;
    let filteredTypes = mrTypes;
    if (category) {
      filteredTypes = mrTypes.filter(type => type.category === category);
    }
    
    res.json({
      success: true,
      data: filteredTypes
    });
  } catch (error) {
    console.error('Error fetching MR types:', error);
    res.status(500).json({ error: 'Failed to fetch MR types' });
  }
};

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
      // 👇 NAYE MR TYPES KE CASES
      case 'TYPO_CORRECTION':
        followupInput = metamorphicRules.applyTypoCorrection(sourceInput);
        break;
      case 'TENSE_CHANGE':
        followupInput = metamorphicRules.applyTenseChange(sourceInput);
        break;
      case 'CAPITALIZATION':
        followupInput = metamorphicRules.applyCapitalizationChange(sourceInput);
        break;
      case 'CONTRACTION_EXPANSION':
        followupInput = metamorphicRules.applyContractionExpansion(sourceInput);
        break;
      case 'NUMBER_TO_WORD':
        followupInput = metamorphicRules.applyNumberToWord(sourceInput);
        break;
      case 'EMOJI_REMOVAL':
        followupInput = metamorphicRules.applyEmojiRemoval(sourceInput);
        break;
      case 'REPETITION':
        followupInput = metamorphicRules.applyRepetition(sourceInput);
        break;
      case 'FORMAL_TO_INFORMAL':
        followupInput = metamorphicRules.applyFormalToInformal(sourceInput);
        break;
      case 'ACTIVE_TO_PASSIVE':
        followupInput = metamorphicRules.applyActiveToPassive(sourceInput);
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

// @desc    Get available models
// @route   GET /api/tests/models
export const getModels = async (req, res) => {
  try {
    const { includeDynamic, task } = req.query;
    
    let models;
    
    if (includeDynamic === 'true' || task) {
      if (task) {
        models = await getModelsByTask(task, 10);
      } else {
        models = await getDynamicModels(true);
      }
    } else {
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