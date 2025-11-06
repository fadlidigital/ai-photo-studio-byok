import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { storage } from './services/storage';
import App from './App';
import Profile from './components/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';

const ProtectedApp = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load API key from storage on mount
  useEffect(() => {
    const storedKey = storage.getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  // Handler for API key changes
  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key);
  };

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

  // User logged in and email verified - show dashboard and profile
  return (
    <Routes>
      <Route path="/dashboard" element={<App apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />} />
      <Route path="/profile" element={<Profile onApiKeyChange={handleApiKeyChange} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default ProtectedApp;
