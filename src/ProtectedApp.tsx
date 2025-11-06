import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';

type AuthScreen = 'login' | 'register' | 'verify-email';

const ProtectedApp = () => {
  const { user } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // User not logged in - show auth screens
  if (!user) {
    if (authScreen === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setAuthScreen('login')}
          onRegistrationSuccess={() => setAuthScreen('verify-email')}
        />
      );
    }

    if (authScreen === 'verify-email') {
      return <EmailVerification />;
    }

    return (
      <Login onSwitchToRegister={() => setAuthScreen('register')} />
    );
  }

  // User logged in but email not verified
  if (!user.email_confirmed_at) {
    return <EmailVerification />;
  }

  // User logged in and email verified - show main app
  return <App />;
};

export default ProtectedApp;
