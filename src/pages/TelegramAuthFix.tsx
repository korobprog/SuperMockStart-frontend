import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const TelegramAuthFix: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<
    'initial' | 'checking' | 'fixing' | 'success' | 'error'
  >('initial');
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const checkCurrentAuth = async () => {
    try {
      setLoading(true);
      setStep('checking');
      addLog('🔍 Проверяем текущее состояние авторизации...');

      const telegramToken = localStorage.getItem('telegram_token');
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      addLog(`📋 Найденные токены:`);
      addLog(`  - telegram_token: ${telegramToken ? '✅' : '❌'}`);
      addLog(`  - authToken: ${authToken ? '✅' : '❌'}`);
      addLog(`  - userId: ${userId || '❌'}`);

      if (!telegramToken && !authToken) {
        addLog('❌ Токены не найдены, требуется создание');
        setStep('fixing');
        await createNewToken();
      } else {
        // Проверяем валидность существующего токена
        addLog('🔍 Проверяем валидность токена...');
        const isValid = await validateToken(telegramToken || authToken || '');

        if (isValid) {
          addLog('✅ Токен валиден');
          setStep('success');
        } else {
          addLog('❌ Токен невалиден, создаем новый');
          setStep('fixing');
          await createNewToken();
        }
      }
    } catch (error) {
      addLog(`❌ Ошибка проверки: ${error}`);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      addLog(`❌ Ошибка валидации токена: ${error}`);
      return false;
    }
  };

  const createNewToken = async () => {
    try {
      addLog('🔄 Создаем новый токен...');

      // Пытаемся получить тестовый токен
      const response = await fetch(`${API_URL}/api/auth/test-token`);
      const data = await response.json();

      if (data.success) {
        addLog('✅ Тестовый токен создан успешно');

        // Сохраняем токен
        localStorage.setItem('telegram_token', data.data.token);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.user.id.toString());
        localStorage.setItem('telegramUser', JSON.stringify(data.data.user));

        addLog(`📝 Токен сохранен для пользователя ${data.data.user.id}`);
        setStep('success');
      } else {
        throw new Error(data.error || 'Неизвестная ошибка создания токена');
      }
    } catch (error) {
      addLog(`❌ Ошибка создания токена: ${error}`);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setStep('error');
    }
  };

  const clearAllTokens = () => {
    addLog('🧹 Очищаем все токены...');
    localStorage.removeItem('telegram_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('extended_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('telegramUser');
    addLog('✅ Все токены очищены');
    setStep('initial');
    setLogs([]);
  };

  const goToTokenCheck = () => {
    navigate('/token-check');
  };

  const goToAuth = () => {
    navigate('/auth');
  };

  const retry = () => {
    setStep('initial');
    setError('');
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Исправление авторизации Telegram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              Эта страница поможет автоматически исправить проблемы с
              авторизацией через Telegram. Система проверит текущие токены и при
              необходимости создаст новые.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={checkCurrentAuth}
              disabled={loading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {step === 'checking'
                    ? 'Проверка...'
                    : step === 'fixing'
                    ? 'Исправление...'
                    : 'Обработка...'}
                </>
              ) : (
                '🔍 Проверить и исправить авторизацию'
              )}
            </Button>

            <Button onClick={clearAllTokens} variant="outline">
              🧹 Очистить все токены
            </Button>

            <Button onClick={goToTokenCheck} variant="outline">
              📊 Управление токенами
            </Button>

            <Button onClick={goToAuth} variant="outline">
              🔐 Страница авторизации
            </Button>
          </div>

          {step === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                ✅ Авторизация успешно исправлена! Теперь вы можете использовать
                приложение.
              </AlertDescription>
            </Alert>
          )}

          {step === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription>
                ❌ Ошибка: {error}
                <div className="mt-2">
                  <Button onClick={retry} variant="outline" size="sm">
                    Попробовать снова
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {logs.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">📋 Лог операций:</h3>
              <div className="bg-gray-100 p-4 rounded text-sm max-h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthFix;
