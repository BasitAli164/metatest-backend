import natural from 'natural';

const wordnet = new natural.WordNet();

// ============= EXISTING FUNCTIONS =============

export const applySynonymReplacement = async (text) => {
  const words = text.split(' ');
  const transformedWords = await Promise.all(words.map(async (word) => {
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
      if (word[0] === word[0].toUpperCase()) {
        return genderMap[lowerWord].charAt(0).toUpperCase() + genderMap[lowerWord].slice(1);
      }
      return genderMap[lowerWord];
    }
    return word;
  });
  
  return transformedWords.join(' ');
};

export const applyPunctuationChange = (text) => {
  const transformations = [
    () => text + '!',
    () => text + '?',
    () => text.replace(/[.,!?;:]/g, ''),
    () => {
      const words = text.split(' ');
      if (words.length > 3) {
        words.splice(Math.floor(words.length / 2), 0, ',');
        return words.join(' ');
      }
      return text;
    }
  ];
  
  const randomIndex = Math.floor(Math.random() * transformations.length);
  return transformations[randomIndex]();
};

export const applyNegation = (text) => {
  const negationPhrases = [
    'not ', 'never ', "didn't ", "wasn't ", "isn't "
  ];
  
  const words = text.split(' ');
  if (words.length > 2) {
    const insertPos = Math.min(2, words.length - 1);
    const randomNegation = negationPhrases[Math.floor(Math.random() * negationPhrases.length)];
    words.splice(insertPos, 0, randomNegation);
    return words.join(' ');
  }
  return text;
};

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

// ============= NEW METAMORPHIC RELATIONS =============

// 1️⃣ TYPO CORRECTION
export const applyTypoCorrection = (text) => {
  const typoMap = {
    'great': 'greet',
    'excellent': 'excelent',
    'beautiful': 'beutiful',
    'definitely': 'definately',
    'separate': 'seperate',
    'receive': 'recieve',
    'occurred': 'ocured',
    'experience': 'experiance',
    'necessary': 'neccessary',
    'embarrass': 'embarass',
    'accommodate': 'acommodate',
    'committee': 'comittee',
    'consensus': 'concensus',
    'entrepreneur': 'entrepenuer',
    'existence': 'existance',
    'independent': 'independant',
    'noticeable': 'noticable',
    'privilege': 'privelege',
    'recommend': 'reccommend',
    'restaurant': 'restaraunt'
  };
  
  let transformed = text;
  Object.entries(typoMap).forEach(([correct, typo]) => {
    const regex = new RegExp(`\\b${correct}\\b`, 'gi');
    transformed = transformed.replace(regex, typo);
  });
  
  return transformed;
};

// 2️⃣ TENSE CHANGE
export const applyTenseChange = (text) => {
  const tenseMap = {
    // Present to past
    'is': 'was', 'are': 'were', 'am': 'was',
    'go': 'went', 'goes': 'went',
    'eat': 'ate', 'eats': 'ate',
    'see': 'saw', 'sees': 'saw',
    'do': 'did', 'does': 'did',
    'have': 'had', 'has': 'had',
    'make': 'made', 'makes': 'made',
    'take': 'took', 'takes': 'took',
    'say': 'said', 'says': 'said',
    'think': 'thought', 'thinks': 'thought',
    'buy': 'bought', 'buys': 'bought',
    'bring': 'brought', 'brings': 'brought',
    'come': 'came', 'comes': 'came',
    'become': 'became', 'becomes': 'became',
    
    // Past to present
    'was': 'is', 'were': 'are',
    'went': 'go', 'ate': 'eat',
    'saw': 'see', 'did': 'do',
    'had': 'have', 'made': 'make',
    'took': 'take', 'said': 'say',
    'thought': 'think', 'bought': 'buy',
    'brought': 'bring', 'came': 'come',
    'became': 'become',
    
    // Future markers
    'will': 'would', 'shall': 'should',
    'going to': 'will', 'gonna': 'will'
  };
  
  let transformed = text;
  Object.entries(tenseMap).forEach(([from, to]) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    transformed = transformed.replace(regex, to);
  });
  
  return transformed;
};

// 3️⃣ CAPITALIZATION CHANGE
export const applyCapitalizationChange = (text) => {
  const transformations = [
    // ALL CAPS
    () => text.toUpperCase(),
    // all lowercase
    () => text.toLowerCase(),
    // Title Case
    () => text.replace(/\b\w/g, l => l.toUpperCase()),
    // Random Case
    () => text.split('').map(c => 
      Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
    ).join('')
  ];
  
  const randomIndex = Math.floor(Math.random() * transformations.length);
  return transformations[randomIndex]();
};

// 4️⃣ CONTRACTION EXPANSION
export const applyContractionExpansion = (text) => {
  const contractionMap = {
    "don't": "do not", "doesn't": "does not", "didn't": "did not",
    "won't": "will not", "wouldn't": "would not", "shouldn't": "should not",
    "can't": "cannot", "couldn't": "could not", "mightn't": "might not",
    "mustn't": "must not", "isn't": "is not", "aren't": "are not",
    "wasn't": "was not", "weren't": "were not", "haven't": "have not",
    "hasn't": "has not", "hadn't": "had not",
    "I'm": "I am", "you're": "you are", "he's": "he is", "she's": "she is",
    "it's": "it is", "we're": "we are", "they're": "they are",
    "I've": "I have", "you've": "you have", "we've": "we have", "they've": "they have",
    "I'll": "I will", "you'll": "you will", "he'll": "he will",
    "she'll": "she will", "we'll": "we will", "they'll": "they will"
  };
  
  // Randomly decide to expand or contract
  if (Math.random() > 0.5) {
    // Expand contractions
    let transformed = text;
    Object.entries(contractionMap).forEach(([contraction, expansion]) => {
      const regex = new RegExp(`\\b${contraction}\\b`, 'gi');
      transformed = transformed.replace(regex, expansion);
    });
    return transformed;
  } else {
    // Contract expansions
    let transformed = text;
    Object.entries(contractionMap).forEach(([contraction, expansion]) => {
      const regex = new RegExp(`\\b${expansion}\\b`, 'gi');
      transformed = transformed.replace(regex, contraction);
    });
    return transformed;
  }
};

// 5️⃣ NUMBER TO WORD
export const applyNumberToWord = (text) => {
  const numberMap = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
    '10': 'ten', '11': 'eleven', '12': 'twelve', '13': 'thirteen',
    '14': 'fourteen', '15': 'fifteen', '16': 'sixteen', '17': 'seventeen',
    '18': 'eighteen', '19': 'nineteen', '20': 'twenty', '21': 'twenty one',
    '30': 'thirty', '40': 'forty', '50': 'fifty', '60': 'sixty',
    '70': 'seventy', '80': 'eighty', '90': 'ninety', '100': 'one hundred'
  };
  
  let transformed = text;
  Object.entries(numberMap).forEach(([num, word]) => {
    const regex = new RegExp(`\\b${num}\\b`, 'g');
    transformed = transformed.replace(regex, word);
  });
  
  return transformed;
};

// 6️⃣ EMOJI REMOVAL
export const applyEmojiRemoval = (text) => {
  // Remove common emojis
  return text.replace(/[\u{1F600}-\u{1F6FF}|😀-🙏|👍-👎|❤️-💔|⭐-🌟]/gu, '');
};

// 7️⃣ REPETITION
export const applyRepetition = (text) => {
  const words = text.split(' ');
  const transformedWords = words.map(word => {
    if (Math.random() < 0.2) { // 20% chance to repeat a word
      return `${word} ${word}`;
    }
    return word;
  });
  
  // Add intensifiers
  if (Math.random() < 0.3) {
    const intensifiers = ['very', 'really', 'extremely', 'absolutely', 'totally'];
    const randomIntensifier = intensifiers[Math.floor(Math.random() * intensifiers.length)];
    transformedWords.splice(1, 0, randomIntensifier);
  }
  
  return transformedWords.join(' ');
};

// 8️⃣ FORMAL TO INFORMAL
export const applyFormalToInformal = (text) => {
  const informalMap = {
    'hello': 'hey', 'good morning': 'morning',
    'goodbye': 'bye', 'see you later': 'see ya',
    'thank you': 'thanks', 'thank you very much': 'thanks a lot',
    'excuse me': 'sorry', 'pardon me': 'oops',
    'I would like': 'I want', 'I am going to': "I'm gonna",
    'perhaps': 'maybe', 'however': 'but',
    'therefore': 'so', 'furthermore': 'also',
    'nevertheless': 'still', 'in addition': 'plus',
    'children': 'kids', 'parents': 'folks',
    'restaurant': 'place', 'automobile': 'car'
  };
  
  let transformed = text;
  Object.entries(informalMap).forEach(([formal, informal]) => {
    const regex = new RegExp(`\\b${formal}\\b`, 'gi');
    transformed = transformed.replace(regex, informal);
  });
  
  return transformed;
};

// 9️⃣ ACTIVE TO PASSIVE (Simple version)
export const applyActiveToPassive = (text) => {
  // Simple active to passive conversion for common patterns
  const patterns = [
    { active: /(.*) love (.*)/i, passive: '$2 is loved by $1' },
    { active: /(.*) like (.*)/i, passive: '$2 is liked by $1' },
    { active: /(.*) hate (.*)/i, passive: '$2 is hated by $1' },
    { active: /(.*) watch (.*)/i, passive: '$2 is watched by $1' },
    { active: /(.*) read (.*)/i, passive: '$2 is read by $1' },
    { active: /(.*) write (.*)/i, passive: '$2 is written by $1' },
    { active: /(.*) make (.*)/i, passive: '$2 is made by $1' },
    { active: /(.*) create (.*)/i, passive: '$2 is created by $1' },
    { active: /(.*) use (.*)/i, passive: '$2 is used by $1' },
    { active: /(.*) see (.*)/i, passive: '$2 is seen by $1' }
  ];
  
  for (const pattern of patterns) {
    if (pattern.active.test(text)) {
      return text.replace(pattern.active, pattern.passive);
    }
  }
  
  // If no pattern matches, return original
  return text;
};

// ============= VIOLATION CHECKER =============

export const checkSentimentViolation = (sourceOutput, followupOutput, MRType) => {
  const sourceSentiment = extractSentiment(sourceOutput);
  const followupSentiment = extractSentiment(followupOutput);
  
  switch (MRType) {
    // These MR types should preserve sentiment
    case 'SYNONYM':
    case 'PUNCTUATION':
    case 'PARAPHRASE':
    case 'TYPO_CORRECTION':
    case 'TENSE_CHANGE':
    case 'CAPITALIZATION':
    case 'CONTRACTION_EXPANSION':
    case 'NUMBER_TO_WORD':
    case 'EMOJI_REMOVAL':
    case 'REPETITION':
    case 'FORMAL_TO_INFORMAL':
    case 'ACTIVE_TO_PASSIVE':
      return sourceSentiment !== followupSentiment;
      
    // Gender should not affect sentiment (fairness check)
    case 'GENDER_SWAP':
      return sourceSentiment !== followupSentiment;
      
    // Negation should flip sentiment
    case 'NEGATION':
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