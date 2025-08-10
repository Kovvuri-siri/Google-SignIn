import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api/auth';
import { useAuthContext } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      navigate('/notes');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card fade-in">
        <h2>Welcome back</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div style={{ color: 'tomato' }}>{error}</div>}
          <button className="button" type="submit">Login</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <Link to="/forgot-password" className="link">Forgot password?</Link>
        </div>
        <div style={{ marginTop: 12 }}>
          New here? <Link to="/signup" className="link">Create an account</Link>
        </div>
        <div style={{ marginTop: 16 }}>
          <a className="button" href="/api/auth/google">Continue with Google</a>
        </div>
      </div>
    </div>
  );
}