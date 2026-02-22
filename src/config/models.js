// Curated list of reliable models for metamorphic testing
export const curatedModels = [
  // Sentiment Models (Most reliable for metamorphic testing)
  { 
    id: 'cardiffnlp/twitter-roberta-base-sentiment-latest', 
    name: 'RoBERTa Sentiment', 
    task: 'sentiment',
    description: 'Best for social media sentiment'
  },
  { 
    id: 'distilbert-base-uncased-finetuned-sst-2-english', 
    name: 'DistilBERT Sentiment', 
    task: 'sentiment',
    description: 'Fast, lightweight sentiment analysis'
  },
  { 
    id: 'nlptown/bert-base-multilingual-uncased-sentiment', 
    name: 'Multilingual Sentiment', 
    task: 'sentiment',
    description: 'Supports 50+ languages'
  },
  
  // Zero-Shot Models (Perfect for fairness testing)
  { 
    id: 'facebook/bart-large-mnli', 
    name: 'BART Zero-shot', 
    task: 'zero-shot',
    description: 'Best for NLI-based classification'
  },
  { 
    id: 'typeform/distilbert-base-uncased-mnli', 
    name: 'DistilBERT MNLI', 
    task: 'zero-shot',
    description: 'Fast zero-shot alternative'
  },
  
  // Text Generation (For paraphrase testing)
  { 
    id: 'google/flan-t5-base', 
    name: 'FLAN-T5', 
    task: 'text-generation',
    description: 'Instruction-tuned generation'
  },
  { 
    id: 'gpt2', 
    name: 'GPT-2', 
    task: 'text-generation',
    description: 'Classic text generation'
  }
];

// Helper function to format model names
export const formatModelName = (modelId) => {
  const name = modelId.split('/').pop();
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to merge models without duplicates
export const mergeModels = (existingModels, newModels) => {
  const existingIds = new Set(existingModels.map(m => m.id));
  const uniqueNewModels = newModels.filter(m => !existingIds.has(m.id));
  return [...existingModels, ...uniqueNewModels];
};