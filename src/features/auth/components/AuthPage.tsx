import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSuccess = () => {
    // Redirect to dashboard or home page
    window.location.href = '/';
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const switchToForgotPassword = () => setMode('forgot-password');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={switchToRegister}
          />
        )}
        {mode === 'register' && (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
        {mode === 'forgot-password' && (
          <ForgotPasswordForm
            onBack={switchToLogin}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
