import React, { useState } from 'react';
import TelegramLoginWidget from '../components/TelegramLoginWidget';
import TelegramConfigDebug from '../components/TelegramConfigDebug';
import {
  ModernCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const BotAuthTest: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = (user: TelegramUser, token: string) => {
    console.log('✅ Auth success:', { user, token });
    setUser(user);
    setToken(token);
    setAuthStatus('success');
    setError(null);
  };

  const handleAuthError = (error: string) => {
    console.error('❌ Auth error:', error);
    setError(error);
    setAuthStatus('error');
    setUser(null);
    setToken(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_token');
    localStorage.removeItem('telegram_bot_username');
    setUser(null);
    setToken(null);
    setAuthStatus('idle');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🔐 Авторизация через Telegram бота
      </h1>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground">
          Безопасная и быстрая авторизация через Telegram бота
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Debug Information */}
        <TelegramConfigDebug />

        {/* Auth Status */}
        <ModernCard>
          <CardHeader>
            <CardTitle className="text-center">
              📊 Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  authStatus === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : authStatus === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : authStatus === 'loading'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className="font-semibold">
                  Status: {authStatus.toUpperCase()}
                </p>
                {user && (
                  <div className="mt-2">
                    <p>
                      <strong>User ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.first_name}{' '}
                      {user.last_name || ''}
                    </p>
                    <p>
                      <strong>Username:</strong> @{user.username || 'none'}
                    </p>
                    <p>
                      <strong>Auth Date:</strong>{' '}
                      {new Date(user.auth_date * 1000).toLocaleString()}
                    </p>
                  </div>
                )}
                {token && (
                  <div className="mt-2">
                    <p>
                      <strong>Token:</strong> {token.substring(0, 20)}...
                    </p>
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-red-600">
                    <p>
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                )}
              </div>

              {user && (
                <div className="flex justify-center">
                  <Button onClick={handleLogout} variant="outline">
                    🚪 Logout
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </ModernCard>

        {/* Telegram Login Widget */}
        {!user && (
          <TelegramLoginWidget
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
          />
        )}

        {/* Instructions */}
        <ModernCard>
          <CardHeader>
            <CardTitle className="text-center">📋 How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                1. <strong>Check Debug Info:</strong> Verify the correct bot is
                selected for your environment
              </p>
              <p>
                2. <strong>Click Login:</strong> Use the Telegram Login Widget
                to authenticate
              </p>
              <p>
                3. <strong>Check Console:</strong> Open browser console for
                detailed logs
              </p>
              <p>
                4. <strong>Verify Status:</strong> Check the authentication
                status above
              </p>
              <p>
                5. <strong>Test Logout:</strong> Try logging out and logging
                back in
              </p>
            </div>
          </CardContent>
        </ModernCard>

        {/* Environment Info */}
        <ModernCard>
          <CardHeader>
            <CardTitle className="text-center">
              🌍 Environment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Current URL:</strong> {window.location.href}
              </p>
              <p>
                <strong>Origin:</strong> {window.location.origin}
              </p>
              <p>
                <strong>User Agent:</strong> {navigator.userAgent}
              </p>
              <p>
                <strong>Local Storage:</strong>{' '}
                {localStorage.getItem('telegram_user')
                  ? 'User data present'
                  : 'No user data'}
              </p>
            </div>
          </CardContent>
        </ModernCard>
      </div>
    </div>
  );
};

export default BotAuthTest;
