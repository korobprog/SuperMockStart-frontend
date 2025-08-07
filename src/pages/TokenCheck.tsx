import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface TokenInfo {
  token: string;
  isValid: boolean;
  expiresAt?: string;
  userId?: string;
}

const TokenCheck: React.FC = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTokens();
  }, []);

  const checkTokens = async () => {
    try {
      setLoading(true);

      // Получаем все токены из localStorage
      const allTokens: TokenInfo[] = [];

      // Проверяем различные типы токенов
      const authToken = localStorage.getItem('authToken');
      const telegramToken = localStorage.getItem('telegramToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (authToken) {
        allTokens.push({
          token: authToken.substring(0, 20) + '...',
          isValid: true,
          userId: 'Auth User',
        });
      }

      if (telegramToken) {
        allTokens.push({
          token: telegramToken.substring(0, 20) + '...',
          isValid: true,
          userId: 'Telegram User',
        });
      }

      if (refreshToken) {
        allTokens.push({
          token: refreshToken.substring(0, 20) + '...',
          isValid: true,
          userId: 'Refresh Token',
        });
      }

      setTokens(allTokens);
    } catch (error) {
      console.error('Error checking tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllTokens = () => {
    localStorage.clear();
    setTokens([]);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверяем токены...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={goBack} variant="outline" className="mb-4">
            ← Назад
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Проверка токенов
          </h1>
          <p className="text-gray-600">
            Информация о сохраненных токенах аутентификации
          </p>
        </div>

        <div className="grid gap-6">
          {tokens.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Токены не найдены</p>
                  <Button onClick={checkTokens} variant="outline">
                    Обновить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            tokens.map((token, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={token.isValid ? 'default' : 'destructive'}>
                      {token.isValid ? 'Действителен' : 'Недействителен'}
                    </Badge>
                    {token.userId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Токен:</span>
                      <code className="block mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
                        {token.token}
                      </code>
                    </div>
                    {token.expiresAt && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Истекает:
                        </span>
                        <p className="text-sm text-gray-600">
                          {token.expiresAt}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {tokens.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button onClick={clearAllTokens} variant="destructive">
                    Очистить все токены
                  </Button>
                  <Button onClick={checkTokens} variant="outline">
                    Обновить
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCheck;
