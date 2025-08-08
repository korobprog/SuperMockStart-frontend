import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getStoredToken, getStoredUser } from '../utils/auth';

const TokenDiagnostic: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const user = getStoredUser();

      console.log('🔍 Token diagnostic started');
      console.log('🔍 Token exists:', !!token);
      console.log('🔍 User exists:', !!user);

      if (token) {
        console.log('🔍 Token length:', token.length);
        console.log(
          '🔍 Token format:',
          token.split('.').length === 3 ? 'Valid JWT' : 'Invalid JWT'
        );

        // Декодируем токен
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('🔍 Token payload:', payload);

            setDiagnostic({
              tokenExists: true,
              tokenValid: true,
              tokenLength: token.length,
              payload: payload,
              user: user,
            });
          } else {
            setDiagnostic({
              tokenExists: true,
              tokenValid: false,
              error: 'Invalid JWT format',
            });
          }
        } catch (error) {
          setDiagnostic({
            tokenExists: true,
            tokenValid: false,
            error: 'Failed to decode token',
          });
        }
      } else {
        setDiagnostic({
          tokenExists: false,
          tokenValid: false,
          error: 'No token found',
        });
      }
    } catch (error) {
      setDiagnostic({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Token Diagnostic</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : diagnostic ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Token exists:{' '}
                <span
                  className={
                    diagnostic.tokenExists ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {diagnostic.tokenExists ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div>
                Token valid:{' '}
                <span
                  className={
                    diagnostic.tokenValid ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {diagnostic.tokenValid ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              {diagnostic.tokenLength && (
                <div>
                  Token length:{' '}
                  <span className="text-blue-600">
                    {diagnostic.tokenLength}
                  </span>
                </div>
              )}
            </div>

            {diagnostic.payload && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">Token Payload:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(diagnostic.payload, null, 2)}
                </pre>
              </div>
            )}

            {diagnostic.user && (
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-semibold mb-2">User Data:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(diagnostic.user, null, 2)}
                </pre>
              </div>
            )}

            {diagnostic.error && (
              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
                <div className="text-red-700">{diagnostic.error}</div>
              </div>
            )}

            <Button onClick={runDiagnostic} className="w-full">
              🔄 Refresh Diagnostic
            </Button>
          </div>
        ) : (
          <div>No diagnostic data</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenDiagnostic;
