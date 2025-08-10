import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <Link to="/" className="link" style={{ fontWeight: 700, fontSize: 20 }}>Noteswap</Link>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/notes" className="link">Browse</Link>
        {token ? (
          <>
            <Link to="/notes/upload" className="link">Upload</Link>
            <span style={{ color: 'var(--muted)' }}>{user?.email}</span>
            <button className="button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            {location.pathname !== '/login' && <Link to="/login" className="link">Login</Link>}
            {location.pathname !== '/signup' && <Link to="/signup" className="button">Get Started</Link>}
          </>
        )}
      </div>
    </nav>
  );
}