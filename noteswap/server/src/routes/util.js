import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { summarize } from '../services/summarizer.js';
import { generateQuiz } from '../services/quizGenerator.js';

const router = express.Router();

router.post('/summarize', requireAuth, (req, res) => {
  const { text, maxSentences } = req.body;
  const summary = summarize(text || '', Number(maxSentences) || 5);
  res.json({ summary });
});

router.post('/quiz', requireAuth, (req, res) => {
  const { text, numQuestions } = req.body;
  const quiz = generateQuiz(text || '', Number(numQuestions) || 5);
  res.json(quiz);
});

export default router;