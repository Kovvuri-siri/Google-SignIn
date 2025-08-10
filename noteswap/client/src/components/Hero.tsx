import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Hero({ oauth }: { oauth?: boolean }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    if (oauth) {
      const token = params.get('token');
      if (token) {
        login(token, null);
        navigate('/notes');
      }
    }
  }, [oauth, params, login, navigate]);

  return (
    <section className="container fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: 44, marginBottom: 12 }}>Swap notes. Study smarter.</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Upload your notes, download others, hear content, get summaries and quizzes — all in one place.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <a className="button" href="/api/auth/google">Continue with Google</a>
      </div>
    </section>
  );
}