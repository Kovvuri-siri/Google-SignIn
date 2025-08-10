import { useState } from 'react';
import { uploadNote } from '../../api/notes';
import { useNavigate } from 'react-router-dom';

export default function UploadNote() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!file) { setError('Please select a file'); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      if (title) form.append('title', title);
      if (description) form.append('description', description);
      const note = await uploadNote(form);
      navigate(`/notes/${note._id}`);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card fade-in">
        <h2>Upload a note</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <input className="input" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <input className="input" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
          {error && <div style={{ color: 'tomato' }}>{error}</div>}
          <button className="button" type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Upload'}</button>
        </form>
      </div>
    </div>
  );
}