import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import { configurePassport } from './config/passport.js';
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import utilRoutes from './routes/util.js';
import './config/env.js';

const app = express();

// Basic security headers
app.disable('x-powered-by');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(rateLimiter);

await connectToDatabase();
configurePassport();

app.use(session({
  secret: process.env.JWT_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/util', utilRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});