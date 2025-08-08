import React from 'react';
import TokenDebugger from '../components/TokenDebugger';
import TokenQuickFix from '../components/TokenQuickFix';
import TokenDiagnostic from '../components/TokenDiagnostic';
import BackgroundGradient from '../components/BackgroundGradient';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TokenDebugPage: React.FC = () => {
  return (
    <BackgroundGradient>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">🔍 Отладка токенов</h1>
          <div></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Quick Fix Section */}
            <div className="flex justify-center">
              <TokenQuickFix />
            </div>

            {/* Simple Diagnostic */}
            <TokenDiagnostic />

            {/* Detailed Debugger */}
            <TokenDebugger />

            {/* Instructions */}
            <div className="p-6 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">
                Инструкции по диагностике:
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">1.</span>
                  <span>
                    Попробуйте "Быстрое исправление токена" для автоматического
                    решения
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">2.</span>
                  <span>Проверьте статус токена - он должен быть "Valid"</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">3.</span>
                  <span>
                    Нажмите "Detailed Diagnosis" для полной диагностики
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">4.</span>
                  <span>Нажмите "Test API" для проверки запроса к серверу</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">5.</span>
                  <span>
                    Если API возвращает ошибку 401, токен недействителен
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">6.</span>
                  <span>
                    Если API возвращает ошибку 500, проблема на сервере
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">7.</span>
                  <span>
                    Нажмите "Clear Tokens" для очистки и повторной авторизации
                  </span>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="p-6 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Частые проблемы:</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <strong>
                    Ошибка "Не удалось проверить статус регистрации"
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    Обычно возникает из-за недействительного токена. Попробуйте
                    быстрое исправление или очистите токены и авторизуйтесь
                    заново.
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <strong>API возвращает 401 Unauthorized</strong>
                  <p className="mt-1 text-muted-foreground">
                    Токен истек или недействителен. Необходима повторная
                    авторизация через Telegram.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <strong>
                    Пользователь авторизован, но данные не загружаются
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    Проверьте, что токен сохранен в localStorage и имеет
                    правильный формат JWT.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <strong>Ошибка "User not found"</strong>
                  <p className="mt-1 text-muted-foreground">
                    Токен валиден, но пользователь не найден в базе данных. Это
                    может произойти при удалении пользователя или проблемах с
                    БД. Решение: очистите токены и авторизуйтесь заново.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default TokenDebugPage;
