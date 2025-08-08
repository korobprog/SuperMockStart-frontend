import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getStoredToken, getStoredUser, isValidToken } from '../utils/auth';
import {
  validateTokenOnServer,
  validateFormApiAccess,
} from '../utils/tokenValidator';
import { diagnoseAndFixToken, forceClearAllTokens } from '../utils/tokenFixer';

interface TokenDebuggerProps {
  onTokenValid?: (token: string) => void;
  onTokenInvalid?: () => void;
}

const TokenDebugger: React.FC<TokenDebuggerProps> = ({
  onTokenValid,
  onTokenInvalid,
}) => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiTest, setApiTest] = useState<any>(null);
  const [detailedDiagnosis, setDetailedDiagnosis] = useState<any>(null);
  const [fixResult, setFixResult] = useState<any>(null);

  // Декодирование JWT токена (без верификации)
  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const checkToken = () => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && isValidToken(token)) {
      const decodedToken = decodeJWT(token);
      setTokenInfo({
        token: token.substring(0, 50) + '...',
        tokenLength: token.length,
        isValid: true,
        user: user,
        decodedToken: decodedToken,
      });
      onTokenValid?.(token);
    } else {
      setTokenInfo({
        token: null,
        isValid: false,
        user: null,
        decodedToken: null,
      });
      onTokenInvalid?.();
    }
  };

  const runDetailedDiagnosis = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      if (!token) {
        setDetailedDiagnosis({ error: 'No token found' });
        return;
      }

      // Проверяем токен на сервере
      const serverValidation = await validateTokenOnServer();

      // Проверяем доступ к API формы
      const formValidation = await validateFormApiAccess();

      // Декодируем токен
      const decodedToken = decodeJWT(token);

      setDetailedDiagnosis({
        token: token.substring(0, 50) + '...',
        decodedToken,
        serverValidation,
        formValidation,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setDetailedDiagnosis({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const autoFixToken = async () => {
    setLoading(true);
    try {
      const result = await diagnoseAndFixToken();
      setFixResult({
        ...result,
        timestamp: new Date().toISOString(),
      });

      if (result.fixed) {
        // Обновляем информацию о токене
        checkToken();
        setDetailedDiagnosis(null);
        setApiTest(null);
      }
    } catch (error) {
      setFixResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      if (!token) {
        setApiTest({ error: 'No token found' });
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/form`, {
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

  const clearTokens = () => {
    forceClearAllTokens();
    setTokenInfo(null);
    setApiTest(null);
    setDetailedDiagnosis(null);
    setFixResult(null);
    onTokenInvalid?.();
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Token Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Token Status:</h3>
          {tokenInfo ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={tokenInfo.isValid ? 'default' : 'destructive'}>
                  {tokenInfo.isValid ? 'Valid' : 'Invalid'}
                </Badge>
                {tokenInfo.token && (
                  <span className="text-sm text-muted-foreground">
                    {tokenInfo.token}
                  </span>
                )}
              </div>
              {tokenInfo.user && (
                <div className="text-sm">
                  <strong>User:</strong> {tokenInfo.user.firstName}{' '}
                  {tokenInfo.user.lastName}
                </div>
              )}
              {tokenInfo.decodedToken && (
                <div className="text-sm bg-muted p-2 rounded">
                  <strong>JWT Payload:</strong>
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(tokenInfo.decodedToken, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No token info</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkToken} variant="outline" size="sm">
            Check Token
          </Button>
          <Button onClick={runDetailedDiagnosis} disabled={loading} size="sm">
            {loading ? 'Diagnosing...' : 'Detailed Diagnosis'}
          </Button>
          <Button
            onClick={autoFixToken}
            disabled={loading}
            size="sm"
            variant="secondary"
          >
            {loading ? 'Fixing...' : 'Auto Fix Token'}
          </Button>
          <Button onClick={testApiCall} disabled={loading} size="sm">
            {loading ? 'Testing...' : 'Test API'}
          </Button>
          <Button onClick={clearTokens} variant="destructive" size="sm">
            Clear Tokens
          </Button>
        </div>

        {/* Fix Result */}
        {fixResult && (
          <div className="space-y-2">
            <h3 className="font-semibold">Auto Fix Result:</h3>
            <div
              className={`p-3 rounded-md ${
                fixResult.fixed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div className="text-sm">
                <strong>Status:</strong>{' '}
                {fixResult.fixed ? 'Fixed' : 'Needs Manual Action'}
                {fixResult.reason && (
                  <div className="mt-1">
                    <strong>Reason:</strong> {fixResult.reason}
                  </div>
                )}
                {fixResult.needsRecreation && (
                  <div className="mt-1 text-orange-600">
                    ⚠️ Token needs recreation - please re-authenticate via
                    Telegram
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Diagnosis */}
        {detailedDiagnosis && (
          <div className="space-y-2">
            <h3 className="font-semibold">Detailed Diagnosis:</h3>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(detailedDiagnosis, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* API Test Results */}
        {apiTest && (
          <div className="space-y-2">
            <h3 className="font-semibold">API Test Results:</h3>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* LocalStorage Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">LocalStorage Tokens:</h3>
          <div className="space-y-1 text-sm">
            {['extended_token', 'telegram_token', 'authToken', 'token'].map(
              (key) => {
                const value = localStorage.getItem(key);
                return (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span className={value ? 'text-green-600' : 'text-red-600'}>
                      {value ? '✅ Present' : '❌ Missing'}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Problem Analysis */}
        {apiTest && apiTest.status === 401 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-semibold text-red-800 mb-2">
              🔍 Анализ проблемы "User not found":
            </h4>
            <div className="text-sm text-red-700 space-y-1">
              <p>• Токен имеет правильный формат JWT</p>
              <p>
                • Сервер принимает токен, но не может найти пользователя в БД
              </p>
              <p>• Возможные причины:</p>
              <ul className="ml-4 list-disc">
                <li>Пользователь был удален из базы данных</li>
                <li>Токен содержит неверный userDbId</li>
                <li>Проблема с подключением к базе данных</li>
                <li>Несоответствие между токеном и данными пользователя</li>
              </ul>
              <p className="mt-2">
                <strong>Решение:</strong> Нажмите "Auto Fix Token" или очистите
                токены и авторизуйтесь заново через Telegram
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenDebugger;
