import { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    await forgotPassword({ email });
    setMessage('If an account exists, a reset link has been sent (check server logs in dev).');
    setStep('reset');
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    await resetPassword({ token, password });
    setMessage('Password reset successful. You can now login.');
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card fade-in">
        {step === 'request' ? (
          <>
            <h2>Forgot password</h2>
            <form onSubmit={onRequest} className="grid" style={{ gap: 12 }}>
              <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="button" type="submit">Send reset link</button>
            </form>
          </>
        ) : (
          <>
            <h2>Reset password</h2>
            <form onSubmit={onReset} className="grid" style={{ gap: 12 }}>
              <input className="input" placeholder="Reset token" value={token} onChange={e => setToken(e.target.value)} />
              <input className="input" type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="button" type="submit">Reset</button>
            </form>
          </>
        )}
        {message && <div style={{ marginTop: 12, color: 'var(--muted)' }}>{message}</div>}
      </div>
    </div>
  );
}