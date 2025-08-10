import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import UploadNote from './components/Notes/UploadNote';
import NoteList from './components/Notes/NoteList';
import NoteDetail from './components/Notes/NoteDetail';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import ResetPassword from './components/Auth/ResetPassword';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuthContext();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<Hero oauth />} />

        <Route path="/notes" element={<PrivateRoute><NoteList /></PrivateRoute>} />
        <Route path="/notes/upload" element={<PrivateRoute><UploadNote /></PrivateRoute>} />
        <Route path="/notes/:id" element={<PrivateRoute><NoteDetail /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}