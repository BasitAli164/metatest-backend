import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  source_input: {
    type: String,
    required: true
  },
  followup_input: {
    type: String,
    required: true
  },
  source_output: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  followup_output: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  MR_type: {
    type: String,
    enum: ['SYNONYM', 'GENDER_SWAP', 'PUNCTUATION', 'NEGATION', 'PARAPHRASE'],
    required: true
  },
  is_violated: {
    type: Boolean,
    required: true
  },
  model_id: {
    type: String,
    required: true
  },
  confidence_score: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
testResultSchema.index({ model_id: 1, MR_type: 1, timestamp: -1 });

const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;