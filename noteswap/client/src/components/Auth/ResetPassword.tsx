import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = params.get('token') || '';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({ token, password });
    setMessage('Password reset successful. Redirecting to login…');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card fade-in">
        <h2>Reset password</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <input className="input" type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="button" type="submit">Reset</button>
        </form>
        {message && <div style={{ marginTop: 12, color: 'var(--muted)' }}>{message}</div>}
        {!token && <div style={{ marginTop: 12 }}>Missing token. Request a new one on <Link className="link" to="/forgot-password">Forgot Password</Link>.</div>}
      </div>
    </div>
  );
}