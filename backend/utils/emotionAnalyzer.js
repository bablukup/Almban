// Basic emotion analysis (can be enhanced with ML libraries)

// Emotion keywords dictionary
// prettier-ignore
const emotionKeywords = {
  happy: [
    // Words (20)
    'happy', 'joy', 'delighted', 'cheerful', 'smiling', 'grateful', 'positive', 'optimistic',
    'excited', 'great', 'awesome', 'amazing', 'perfect', 'fantastic', 'wonderful', 'joyful',
    'vibrant', 'playful', 'energetic', 'bright',
    // Phrases (10)
    'feeling good', 'so happy', 'i am great', 'this is awesome', 'feeling blessed',
    'could not be better', 'life is beautiful', 'so much joy', 'full of energy', 'happy vibes only',
    // Emojis (10)
    '😊', '😄', '😁', '🎉', '🥳', '✨', '🌈', '💖', '😃', '🙌'
  ],

  sad: [
    // Words (20)
    'sad', 'unhappy', 'depressed', 'down', 'heartbroken', 'lonely', 'gloomy', 'blue',
    'disappointed', 'hurt', 'upset', 'sorrow', 'miserable', 'hopeless', 'grief', 'melancholy',
    'tearful', 'downhearted', 'forlorn', 'regret',
    // Phrases (10)
    'feeling low', 'i am sad', 'so broken', 'i feel empty', 'nothing feels right',
    'life is tough', 'tears won’t stop', 'feeling hopeless', 'lost in sorrow', 'heart is heavy',
    // Emojis (10)
    '😢', '😭', '😞', '💔', '😔', '🥺', '🙁', '😟', '😩', '😿'
  ],

  angry: [
    // Words (20)
    'angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'agitated',
    'hostile', 'fuming', 'upset', 'resentful', 'hateful', 'provoked', 'enraged', 'irate',
    'aggressive', 'bitter', 'offended', 'stormy',
    // Phrases (10)
    'i am so mad', 'this makes me furious', 'boiling with anger', 'i cannot stand this',
    'losing my temper', 'so frustrating', 'full of rage', 'angry outburst',
    'beyond control', 'frustration overload',
    // Emojis (10)
    '😠', '😡', '🤬', '👿', '🔥', '💢', '😤', '😾', '⚡', '🙄'
  ],

  excited: [
    // Words (20)
    'excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'motivated', 'hyped', 'joyful',
    'overjoyed', 'delighted', 'eager', 'ecstatic', 'cheerful', 'optimistic', 'inspired', 'exhilarated',
    'lively', 'elated', 'playful', 'spirited',
    // Phrases (10)
    'feeling pumped', 'can’t wait', 'so excited', 'i am thrilled', 'this is amazing',
    'feeling awesome', 'super hyped', 'bursting with energy', 'thrilled to bits', 'ready to go',
    // Emojis (10)
    '🤩', '🚀', '⚡', '🔥', '🙌', '🎊', '💫', '🌟', '🎉', '😆'
  ],

  confused: [
    // Words (20)
    'confused', 'puzzled', 'uncertain', 'lost', 'unclear', 'doubtful', 'hesitant', 'indecisive',
    'questioning', 'unsure', 'mixed', 'blurred', 'disoriented', 'confounded', 'baffled', 'stuck',
    'undecided', 'unsettled', 'vague', 'perplexed',
    // Phrases (10)
    'i am confused', 'don’t understand', 'this is unclear', 'so puzzling', 'lost in thought',
    'i am unsure', 'full of doubts', 'mind is blank', 'cannot decide', 'totally lost',
    // Emojis (10)
    '🤔', '😕', '❓', '😵', '🤷', '🙃', '😐', '❔', '😮', '😶'
  ],

  neutral: [
    // Words (20)
    'neutral', 'okay', 'fine', 'alright', 'normal', 'average', 'standard', 'regular',
    'plain', 'moderate', 'balanced', 'typical', 'ordinary', 'middle', 'fair', 'casual',
    'calm', 'relaxed', 'simple', 'steady',
    // Phrases (10)
    'i am okay', 'just fine', 'all normal', 'feeling regular', 'nothing special',
    'pretty average', 'life is balanced', 'staying calm', 'in the middle', 'keeping it simple',
    // Emojis (10)
    '😐', '😶', '🙂', '👌', '👍', '🤝', '😌', '🙆', '😑', '🌀'
  ]
};

/**
 * Analyzes text for emotional content
 * @param {string} text - Text to analyze
 * @returns {Object} Emotion analysis results
 */
const analyzer = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      return {
        emotion: "neutral",
        intensity: 0.5,
        confidence: 0.3,
        sarcasm: false,
        patterns: [],
      };
    }
    const lowercaseText = text.toLowerCase();

    // Calculate emotion scores
    const emotionScores = {};
    let totalMatches = 0;

    Object.keys(emotionKeywords).forEach((emotion) => {
      let score = 0;
      emotionKeywords[emotion].forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi"); // Improved word boundary matching
        const matches = (text.match(regex) || []).length;
        score += matches;
        totalMatches += matches;
      });
      emotionScores[emotion] = score;
    });

    // Determine primary emotion
    let primaryEmotion = "neutral";
    let maxScore = 0;

    Object.keys(emotionScores).forEach((emotion) => {
      if (emotionScores[emotion] > maxScore) {
        maxScore = emotionScores[emotion];
        primaryEmotion = emotion;
      }
    });

    // Calculate intensity
    let intensity = 0.5;
    if (maxScore > 0) {
      intensity = Math.min(0.9, 0.3 + maxScore * 0.2);
    }

    // Simple sarcasm detection
    const sarcasmIndicators = ["yeah right", "sure thing", "oh great", "fantastic"];
    const sarcasmDetected = sarcasmIndicators.some((indicator) =>
      lowercaseText.includes(indicator)
    );

    // Calculate confidence
    let confidence = 0.6;
    if (maxScore > 0) confidence += 0.2;
    if (text.includes("!!!") || text.includes("???")) confidence += 0.1;
    confidence = Math.min(0.95, Math.max(0.3, confidence));

    return {
      emotion: primaryEmotion,
      intensity: parseFloat(intensity.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2)),
      sarcasm: sarcasmDetected,
      patterns: [],
      emotionScores,
    };
  } catch (error) {
    logger.error("Emotion analysis failed:", {
      error: error.message,
      text: text?.substring(0, 100), // Log first 100 chars of input
    });

    return {
      emotion: "neutral",
      intensity: 0.5,
      confidence: 0.3,
      sarcasm: false,
      patterns: [],
    };
  }
};

module.exports = {
  analyzer,
  emotionKeywords, // Export for testing
};
