import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadNote, getNote, quizFromNote, summarizeNote } from '../../api/notes';

interface Note {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  mimeType?: string;
  size?: number;
  contentText?: string;
}

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await getNote(id);
      setNote(data);
    })();
  }, [id]);

  const ttsText = useMemo(() => summary || note?.contentText || '', [summary, note]);

  const onSummarize = async () => {
    if (!id) return;
    setLoadingSummary(true);
    try {
      const s = await summarizeNote(id, 5);
      setSummary(s);
    } finally {
      setLoadingSummary(false);
    }
  };

  const onQuiz = async () => {
    if (!id) return;
    setLoadingQuiz(true);
    try {
      const q = await quizFromNote(id, 5);
      setQuiz(q);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const speak = () => {
    if (!ttsText) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(ttsText.slice(0, 15000));
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  };

  const stop = () => window.speechSynthesis.cancel();
  const pause = () => window.speechSynthesis.pause();
  const resume = () => window.speechSynthesis.resume();

  if (!note) return <div className="container"><div className="card shimmer" style={{ height: 160 }} /></div>;

  return (
    <div className="container grid grid-2">
      <div className="card fade-in">
        <h2 style={{ marginTop: 0 }}>{note.title}</h2>
        <p style={{ color: 'var(--muted)' }}>{note.description || 'No description'}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button" onClick={() => downloadNote(note._id)}>Download</button>
          <button className="button" onClick={onSummarize} disabled={loadingSummary}>{loadingSummary ? 'Summarizing…' : 'Summarize'}</button>
          <button className="button" onClick={onQuiz} disabled={loadingQuiz}>{loadingQuiz ? 'Generating…' : 'Generate Quiz'}</button>
          <button className="button" onClick={speak} disabled={!ttsText}>Speak</button>
          <button className="button" onClick={pause}>Pause</button>
          <button className="button" onClick={resume}>Resume</button>
          <button className="button" onClick={stop}>Stop</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <h3>Content</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: 'transparent', padding: 0 }}>{note.contentText || 'No extracted text available for this file.'}</pre>
        </div>
      </div>
      <div className="card fade-in">
        <h3>Summary</h3>
        <div style={{ color: 'var(--muted)' }}>{summary || 'Click Summarize to generate a summary.'}</div>
        <h3 style={{ marginTop: 16 }}>Quiz</h3>
        {!quiz.length ? (
          <div style={{ color: 'var(--muted)' }}>Click Generate Quiz to create questions.</div>
        ) : (
          <div className="grid" style={{ gap: 8 }}>
            {quiz.map((q: any, idx: number) => (
              <div key={idx} className="card">
                <div style={{ fontWeight: 600 }}>{idx + 1}. {q.question}</div>
                {q.options && (
                  <ul>
                    {q.options.map((opt: string, i: number) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>Answer: {q.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}