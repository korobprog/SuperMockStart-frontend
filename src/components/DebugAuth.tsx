import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const DebugAuth: React.FC = () => {
  const { user, token, loading, error, isAuthenticated, checkAuth, logout } =
    useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<string>('Не проверено');

  const checkAuthStatus = async () => {
    try {
      const result = await checkAuth();
      setDebugInfo({
        timestamp: new Date().toISOString(),
        result,
        localStorage: {
          telegram_user: localStorage.getItem('telegram_user'),
          telegram_token: localStorage.getItem('telegram_token'),
          auth_id: localStorage.getItem('auth_id'),
        },
      });
    } catch (error) {
      setDebugInfo({
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      setDbStatus('Проверяется...');
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
      
      const response = await fetch(`${API_URL}/api/auth/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDbStatus('✅ Доступна');
      } else {
        setDbStatus('❌ Ошибка подключения');
      }
    } catch (error) {
      setDbStatus('❌ Недоступна');
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_token');
    localStorage.removeItem('auth_id');
    setDebugInfo(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Debug Auth</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Has Token:</strong> {token ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Has User:</strong> {user ? 'Yes' : 'No'}
              </p>
              {error && (
                <p>
                  <strong>Error:</strong> {error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Name:</strong> {user.first_name} {user.last_name}
                </p>
                <p>
                  <strong>Username:</strong> {user.username || 'N/A'}
                </p>
                <p>
                  <strong>Photo:</strong> {user.photo_url ? 'Yes' : 'No'}
                </p>
              </div>
            ) : (
              <p>No user data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Button onClick={checkAuthStatus} className="w-full">
          Check Auth Status
        </Button>
        <Button onClick={checkDatabaseStatus} className="w-full">
          Check Database
        </Button>
        <Button onClick={logout} variant="destructive" className="w-full">
          Logout
        </Button>
        <Button onClick={clearStorage} variant="outline" className="w-full">
          Clear Storage
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Database:</strong> {dbStatus}
            </p>
            <p>
              <strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'https://api.supermock.ru'}
            </p>
            <p>
              <strong>Environment:</strong> {import.meta.env.NODE_ENV || 'development'}
            </p>
          </div>
        </CardContent>
      </Card>

      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebugAuth;
