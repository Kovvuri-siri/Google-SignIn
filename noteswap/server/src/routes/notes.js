import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import pdfParse from 'pdf-parse';
import { Note } from '../models/Note.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { summarize } from '../services/summarizer.js';
import { generateQuiz } from '../services/quizGenerator.js';

const router = express.Router();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'notes'
    };
  }
});

const upload = multer({ storage });

function getGfs() {
  const conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;
  return Grid(conn.db, mongoose.mongo);
}

async function extractText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text || '';
    }
    if (mimetype === 'text/plain') {
      return buffer.toString('utf-8');
    }
    // For DOCX or others, store without extraction. Could be extended with docx parser.
    return '';
  } catch {
    return '';
  }
}

router.post('/upload', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    const gfs = getGfs();
    const file = req.file;
    const fileId = file.id || file.fileId || file._id;

    // Read small files into buffer for text extraction
    let contentText = '';
    try {
      const readstream = gfs.createReadStream({ _id: fileId, root: 'notes' });
      const chunks = [];
      await new Promise((resolve, reject) => {
        readstream.on('data', (chunk) => chunks.push(chunk));
        readstream.on('end', resolve);
        readstream.on('error', reject);
      });
      const buffer = Buffer.concat(chunks);
      contentText = await extractText(buffer, file.mimetype);
    } catch {}

    const note = await Note.create({
      ownerId: req.userId,
      title: req.body.title || file.originalname,
      description: req.body.description || '',
      filename: file.filename,
      fileId,
      mimeType: file.mimetype,
      size: file.size,
      contentText
    });

    res.json({ note });
  } catch (err) { next(err); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 }).limit(100);
    res.json({ notes });
  } catch (err) { next(err); }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json({ note });
  } catch (err) { next(err); }
});

router.get('/:id/download', requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    const gfs = getGfs();
    const readstream = gfs.createReadStream({ _id: note.fileId, root: 'notes' });
    res.set('Content-Type', note.mimeType || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${note.filename}"`);
    readstream.on('error', next);
    readstream.pipe(res);
  } catch (err) { next(err); }
});

router.post('/:id/summarize', requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    const text = note.contentText || '';
    const maxSentences = Number(req.body.maxSentences || 5);
    const summary = summarize(text, maxSentences);
    res.json({ summary });
  } catch (err) { next(err); }
});

router.post('/:id/quiz', requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    const numQuestions = Number(req.body.numQuestions || 5);
    const quiz = generateQuiz(note.contentText || '', numQuestions);
    res.json(quiz);
  } catch (err) { next(err); }
});

export default router;