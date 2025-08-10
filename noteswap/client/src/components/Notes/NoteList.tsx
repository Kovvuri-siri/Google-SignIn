import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listNotes } from '../../api/notes';

interface Note {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  mimeType?: string;
  size?: number;
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listNotes();
        setNotes(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Latest notes</h2>
      {loading ? (
        <div className="card shimmer" style={{ height: 120, marginTop: 12 }} />
      ) : (
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {notes.map(n => (
            <div key={n._id} className="card fade-in">
              <h3 style={{ marginTop: 0 }}>{n.title}</h3>
              <p style={{ color: 'var(--muted)' }}>{n.description || 'No description'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>{n.filename}</span>
                <Link className="button" to={`/notes/${n._id}`}>Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}