import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { diagnoseAndFixToken, forceClearAllTokens } from '../utils/tokenFixer';
import { getStoredToken } from '../utils/auth';

interface TokenQuickFixProps {
  onFixed?: () => void;
  onError?: (error: string) => void;
}

const TokenQuickFix: React.FC<TokenQuickFixProps> = ({ onFixed, onError }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleQuickFix = async () => {
    setLoading(true);
    setResult(null);

    try {
      const token = getStoredToken();

      if (!token) {
        setResult({
          type: 'warning',
          message: 'Токен не найден. Необходима авторизация через Telegram.',
          needsAuth: true,
        });
        return;
      }

      const fixResult = await diagnoseAndFixToken();

      if (fixResult.fixed) {
        setResult({
          type: 'success',
          message: 'Токен успешно исправлен!',
          details: fixResult.reason,
        });
        onFixed?.();
      } else if (fixResult.needsRecreation) {
        setResult({
          type: 'warning',
          message:
            'Токен требует пересоздания. Очистите токены и авторизуйтесь заново.',
          needsAuth: true,
        });
        onError?.('Token needs recreation');
      } else {
        setResult({
          type: 'info',
          message: 'Токен в порядке, но есть проблемы с сервером.',
          details: fixResult.reason,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setResult({
        type: 'error',
        message: 'Ошибка при исправлении токена',
        details: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForceClear = () => {
    forceClearAllTokens();
    setResult({
      type: 'success',
      message:
        'Все токены очищены. Перезагрузите страницу и авторизуйтесь заново.',
      needsReload: true,
    });
  };

  const getAlertIcon = () => {
    switch (result?.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = () => {
    switch (result?.type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Быстрое исправление токена
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Автоматически диагностирует и исправляет проблемы с токеном
          авторизации.
        </p>

        <div className="flex gap-2">
          <Button
            onClick={handleQuickFix}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Исправляем...' : 'Исправить токен'}
          </Button>
          <Button onClick={handleForceClear} variant="outline" size="sm">
            Очистить все
          </Button>
        </div>

        {result && (
          <Alert variant={getAlertVariant()}>
            {getAlertIcon()}
            <AlertDescription>
              <div className="font-medium">{result.message}</div>
              {result.details && (
                <div className="text-sm mt-1 text-muted-foreground">
                  {result.details}
                </div>
              )}
              {result.needsAuth && (
                <div className="text-sm mt-2">
                  <strong>Действие:</strong> Перейдите на главную страницу и
                  авторизуйтесь через Telegram
                </div>
              )}
              {result.needsReload && (
                <div className="text-sm mt-2">
                  <strong>Действие:</strong> Обновите страницу (F5) и
                  авторизуйтесь заново
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Проверяет формат JWT токена</div>
          <div>• Валидирует токен на сервере</div>
          <div>• Очищает недействительные токены</div>
          <div>• Предлагает решения для проблем</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenQuickFix;
