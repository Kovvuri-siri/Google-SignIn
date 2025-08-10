# Noteswap

Noteswap is a full-stack web application where users can upload notes, download others' notes, convert text to audio, get AI-generated summaries, and generate quizzes from note content.

- Frontend: React (Vite), TypeScript, CSS with animations
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (GridFS for file storage)
- Auth: Email/password with JWT, Google OAuth (via passport)
- AI: Local summarizer and quiz generator (no external AI APIs)
- TTS: Browser Speech Synthesis API (no external services)

## Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account and connection string (free tier works)
- Google OAuth credentials (Client ID/Secret) for Google login

## Quick Start

1. Clone and install dependencies

```bash
cd /workspace/noteswap
npm install
npm run setup
```

2. Configure environment variables

- Copy `.env.example` to `.env` in `server/` and fill values.

3. Run in development

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Environment Variables

Create `server/.env`:

```
PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace_with_strong_secret
RESET_TOKEN_SECRET=replace_with_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

## Scripts
- `npm run dev`: Run server and client concurrently
- `npm run setup`: Install server and client dependencies
- `npm run client`: Start frontend only
- `npm run server`: Start backend only (dev with nodemon)

## Features Overview
- Email/password signup, login, forgot/reset password
- Google OAuth via passport (no third-party auth providers like Auth0/Firebase)
- Upload/download notes (PDF, DOCX, TXT); text extraction for summaries/quizzes
- Local summarizer (frequency-based) and quiz generator (cloze + simple MCQ)
- Text-to-speech via browser Web Speech API

## Notes on "No External APIs"
- All AI features (summary, quiz, TTS) run locally. TTS uses browser speech synthesis.
- Google OAuth communicates directly with Google as the identity provider, without third-party auth services.

## Production Considerations
- Configure HTTPS and secure cookies
- Replace dev mailer with SMTP in `server/src/utils/email.js`
- Add file type/size validation and virus scanning
- Harden CORS and rate limits

## License
MIT