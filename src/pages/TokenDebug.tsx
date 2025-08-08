import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import BackgroundGradient from '../components/BackgroundGradient';

const TokenDebug: React.FC = () => {
  const { token, user, isAuthenticated } = useAuth();
  const [apiTest, setApiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiCall = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/form`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setApiTest({
        status: response.status,
        ok: response.ok,
        data,
      });
    } catch (error) {
      setApiTest({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllTokens = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('telegram_token');
    localStorage.removeItem('extended_token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <BackgroundGradient className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔍 Отладка токена авторизации
          </h1>

          <div className="space-y-6">
            {/* Redux State */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Redux State:</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>isAuthenticated:</strong>{' '}
                  {isAuthenticated ? '✅ true' : '❌ false'}
                </div>
                <div>
                  <strong>token:</strong>{' '}
                  {token ? `✅ ${token.substring(0, 20)}...` : '❌ null'}
                </div>
                <div>
                  <strong>user:</strong>{' '}
                  {user ? `✅ ${user.first_name} (${user.id})` : '❌ null'}
                </div>
              </div>
            </div>

            {/* LocalStorage */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">LocalStorage:</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>authToken:</strong>{' '}
                  {localStorage.getItem('authToken')
                    ? `✅ ${localStorage
                        .getItem('authToken')
                        ?.substring(0, 20)}...`
                    : '❌ null'}
                </div>
                <div>
                  <strong>token:</strong>{' '}
                  {localStorage.getItem('token')
                    ? `✅ ${localStorage.getItem('token')?.substring(0, 20)}...`
                    : '❌ null'}
                </div>
                <div>
                  <strong>telegram_token:</strong>{' '}
                  {localStorage.getItem('telegram_token')
                    ? `✅ ${localStorage
                        .getItem('telegram_token')
                        ?.substring(0, 20)}...`
                    : '❌ null'}
                </div>
                <div>
                  <strong>extended_token:</strong>{' '}
                  {localStorage.getItem('extended_token')
                    ? `✅ ${localStorage
                        .getItem('extended_token')
                        ?.substring(0, 20)}...`
                    : '❌ null'}
                </div>
                <div>
                  <strong>user:</strong>{' '}
                  {localStorage.getItem('user')
                    ? `✅ ${localStorage.getItem('user')}`
                    : '❌ null'}
                </div>
              </div>
            </div>

            {/* API Test */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">API Test:</h2>
              <Button
                onClick={testApiCall}
                disabled={loading || !token}
                className="mb-4"
              >
                {loading ? 'Тестирование...' : 'Тестировать API'}
              </Button>

              {apiTest && (
                <div className="bg-white border rounded p-3">
                  <div className="text-sm">
                    <div>
                      <strong>Status:</strong> {apiTest.status}
                    </div>
                    <div>
                      <strong>OK:</strong> {apiTest.ok ? '✅ true' : '❌ false'}
                    </div>
                    {apiTest.error && (
                      <div>
                        <strong>Error:</strong> ❌ {apiTest.error}
                      </div>
                    )}
                    {apiTest.data && (
                      <div>
                        <strong>Data:</strong>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(apiTest.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Действия:</h2>
              <div className="space-y-2">
                <Button
                  onClick={clearAllTokens}
                  variant="destructive"
                  size="sm"
                >
                  Очистить все токены
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Перезагрузить страницу
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default TokenDebug;
