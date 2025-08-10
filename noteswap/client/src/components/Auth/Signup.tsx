import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../../api/auth';
import { useAuthContext } from '../../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await signupApi({ name, email, password });
      login(data.token, data.user);
      navigate('/notes');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card fade-in">
        <h2>Create an account</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div style={{ color: 'tomato' }}>{error}</div>}
          <button className="button" type="submit">Sign up</button>
        </form>
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login" className="link">Login</Link>
        </div>
      </div>
    </div>
  );
}