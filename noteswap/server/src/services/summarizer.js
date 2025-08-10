const sentenceDelimiters = /(?<=[.!?])\s+(?=[A-Z0-9])/g;

function tokenizeSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(sentenceDelimiters)
    .map(s => s.trim())
    .filter(Boolean);
}

function tokenizeWords(text) {
  return text.toLowerCase().match(/[a-zA-Z']+/g) || [];
}

const stopWords = new Set([
  'the','is','in','at','which','on','and','a','an','to','for','of','with','as','by','it','this','that','from','or','be','are','was','were'
]);

export function summarize(text, maxSentences = 5) {
  const sentences = tokenizeSentences(text);
  if (sentences.length <= maxSentences) return text;

  const wordFreq = new Map();
  for (const word of tokenizeWords(text)) {
    if (stopWords.has(word)) continue;
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }

  const sentenceScores = sentences.map((s) => {
    const words = tokenizeWords(s);
    const score = words.reduce((sum, w) => sum + (wordFreq.get(w) || 0), 0) / (words.length || 1);
    return { sentence: s, score };
  });

  sentenceScores.sort((a, b) => b.score - a.score);
  const top = sentenceScores.slice(0, maxSentences).map(s => s.sentence);

  // Preserve original order
  const ordered = sentences.filter(s => top.includes(s));
  return ordered.join(' ');
}