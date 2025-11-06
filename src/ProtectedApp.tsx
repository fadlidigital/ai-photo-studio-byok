import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';

const ProtectedApp = () => {
  const { user } = useAuth();

  // User not logged in - show auth screens only
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // User logged in but email not verified
  if (!user.email_confirmed_at) {
    return (
      <Routes>
        <Route path="*" element={<EmailVerification />} />
      </Routes>
    );
  }

  // User logged in and email verified - show dashboard
  return (
    <Routes>
      <Route path="/dashboard" element={<App />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default ProtectedApp;
