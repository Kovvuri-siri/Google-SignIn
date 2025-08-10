import { summarize } from './summarizer.js';

function extractKeyTerms(text, limit = 10) {
  const words = (text.toLowerCase().match(/[a-zA-Z']+/g) || []).filter(w => w.length > 3);
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

export function generateQuiz(text, numQuestions = 5) {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const base = summarize(cleanText, 7);
  const keyTerms = extractKeyTerms(base, 12);

  const sentences = base.split(/(?<=[.!?])\s+/).filter(Boolean);
  const questions = [];

  for (let i = 0; i < sentences.length && questions.length < numQuestions; i++) {
    const s = sentences[i];
    const term = keyTerms.find(t => s.toLowerCase().includes(t));
    if (!term) continue;
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    const prompt = s.replace(regex, '____');

    // Build simple distractors from other key terms
    const options = [term];
    for (const t of keyTerms) {
      if (t !== term && !options.includes(t)) options.push(t);
      if (options.length === 4) break;
    }

    while (options.length < 4) options.push('None of the above');

    // Shuffle options
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [options[j], options[k]] = [options[k], options[j]];
    }

    questions.push({
      type: 'mcq',
      question: prompt,
      options,
      answer: term
    });
  }

  // If not enough MCQs, add cloze questions
  let idx = 0;
  while (questions.length < numQuestions && idx < sentences.length) {
    const s = sentences[idx++];
    const words = s.split(' ');
    if (words.length < 6) continue;
    const blankIndex = Math.max(1, Math.min(words.length - 2, Math.floor(words.length / 3)));
    const answer = words[blankIndex].replace(/[^a-zA-Z']/g, '');
    words[blankIndex] = '____';
    questions.push({ type: 'cloze', question: words.join(' '), answer });
  }

  return { questions };
}