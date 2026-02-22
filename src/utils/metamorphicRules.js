import natural from 'natural';

const wordnet = new natural.WordNet();

// Synonym replacement using WordNet
export const applySynonymReplacement = async (text) => {
  const words = text.split(' ');
  const transformedWords = await Promise.all(words.map(async (word) => {
    // 30% chance to replace with synonym
    if (Math.random() < 0.3) {
      return new Promise((resolve) => {
        wordnet.lookup(word, (results) => {
          if (results && results.length > 0) {
            const synonyms = results[0].synonyms;
            if (synonyms && synonyms.length > 0) {
              resolve(synonyms[0]);
            } else {
              resolve(word);
            }
          } else {
            resolve(word);
          }
        });
      });
    }
    return word;
  }));
  
  return transformedWords.join(' ');
};

// Gender swap transformation
export const applyGenderSwap = (text) => {
  const genderMap = {
    'he': 'she', 'him': 'her', 'his': 'her', 'himself': 'herself',
    'she': 'he', 'her': 'him', 'hers': 'his', 'herself': 'himself',
    'man': 'woman', 'woman': 'man', 'boy': 'girl', 'girl': 'boy',
    'father': 'mother', 'mother': 'father', 'brother': 'sister', 'sister': 'brother',
    'son': 'daughter', 'daughter': 'son', 'husband': 'wife', 'wife': 'husband',
    'king': 'queen', 'queen': 'king', 'actor': 'actress', 'actress': 'actor'
  };
  
  const words = text.split(' ');
  const transformedWords = words.map(word => {
    const lowerWord = word.toLowerCase();
    if (genderMap[lowerWord]) {
      // Preserve original case
      if (word[0] === word[0].toUpperCase()) {
        return genderMap[lowerWord].charAt(0).toUpperCase() + genderMap[lowerWord].slice(1);
      }
      return genderMap[lowerWord];
    }
    return word;
  });
  
  return transformedWords.join(' ');
};

// Punctuation perturbation
export const applyPunctuationChange = (text) => {
  const transformations = [
    // Add exclamation
    () => text + '!',
    // Add question mark
    () => text + '?',
    // Remove punctuation
    () => text.replace(/[.,!?;:]/g, ''),
    // Add commas
    () => {
      const words = text.split(' ');
      if (words.length > 3) {
        words.splice(Math.floor(words.length / 2), 0, ',');
        return words.join(' ');
      }
      return text;
    }
  ];
  
  // Randomly select a transformation
  const randomIndex = Math.floor(Math.random() * transformations.length);
  return transformations[randomIndex]();
};

// Negation transformation
export const applyNegation = (text) => {
  const negationPhrases = [
    'not ', 'never ', "didn't ", "wasn't ", "isn't "
  ];
  
  // Simple negation insertion
  const words = text.split(' ');
  if (words.length > 2) {
    const insertPos = Math.min(2, words.length - 1);
    const randomNegation = negationPhrases[Math.floor(Math.random() * negationPhrases.length)];
    words.splice(insertPos, 0, randomNegation);
    return words.join(' ');
  }
  return text;
};

// Paraphrase using simple rules
export const applyParaphrase = (text) => {
  const paraphraseRules = [
    { pattern: /is very/g, replacement: 'is extremely' },
    { pattern: /good/g, replacement: 'great' },
    { pattern: /bad/g, replacement: 'terrible' },
    { pattern: /like/g, replacement: 'enjoy' },
    { pattern: /don't like/g, replacement: 'dislike' }
  ];
  
  let transformed = text;
  paraphraseRules.forEach(rule => {
    transformed = transformed.replace(rule.pattern, rule.replacement);
  });
  
  return transformed;
};

// MR violation checker for sentiment analysis
export const checkSentimentViolation = (sourceOutput, followupOutput, MRType) => {
  // Extract sentiment labels
  const sourceSentiment = extractSentiment(sourceOutput);
  const followupSentiment = extractSentiment(followupOutput);
  
  switch (MRType) {
    case 'SYNONYM':
    case 'PUNCTUATION':
    case 'PARAPHRASE':
      // These should preserve sentiment
      return sourceSentiment !== followupSentiment;
      
    case 'GENDER_SWAP':
      // Gender should not affect sentiment (fairness check)
      return sourceSentiment !== followupSentiment;
      
    case 'NEGATION':
      // Negation should flip sentiment
      return sourceSentiment === followupSentiment;
      
    default:
      return false;
  }
};

// Helper to extract sentiment from model output
const extractSentiment = (output) => {
  if (typeof output === 'string') {
    if (output.toLowerCase().includes('positive')) return 'POSITIVE';
    if (output.toLowerCase().includes('negative')) return 'NEGATIVE';
    if (output.toLowerCase().includes('neutral')) return 'NEUTRAL';
  }
  
  if (Array.isArray(output) && output[0]?.label) {
    return output[0].label.toUpperCase();
  }
  
  return 'UNKNOWN';
};