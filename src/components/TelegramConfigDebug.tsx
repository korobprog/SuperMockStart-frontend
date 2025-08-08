import React from 'react';
import { getBotInfo, logBotConfig } from '../utils/telegramConfig';
import { ModernCard, CardContent, CardHeader, CardTitle } from './ui/card';

const TelegramConfigDebug: React.FC = () => {
  const botInfo = getBotInfo();

  // Логируем конфигурацию при рендере
  React.useEffect(() => {
    logBotConfig();
  }, []);

  return (
    <ModernCard className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          🔧 Debug: Telegram Bot Config
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <p>
              <strong>🤖 Bot Username:</strong> {botInfo.username}
            </p>
            <p>
              <strong>🌍 Environment:</strong> {botInfo.environment}
            </p>
            <p>
              <strong>🔧 Is Dev:</strong> {botInfo.isDev ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>🔗 API URL:</strong> {botInfo.apiUrl}
            </p>
          </div>

          <div className="bg-blue-50 p-2 rounded">
            <p>
              <strong>📊 Environment Variables:</strong>
            </p>
            <p>DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
            <p>VITE_NODE_ENV: {import.meta.env.VITE_NODE_ENV || 'not set'}</p>
            <p>VITE_APP_ENV: {import.meta.env.VITE_APP_ENV || 'not set'}</p>
            <p>
              VITE_TELEGRAM_BOT_USERNAME:{' '}
              {import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'not set'}
            </p>
          </div>

          <div className="bg-green-50 p-2 rounded">
            <p>
              <strong>✅ Status:</strong> Configuration loaded successfully
            </p>
            <p>
              <strong>🎯 Expected Bot:</strong>{' '}
              {botInfo.environment === 'production'
                ? 'SuperMock_bot'
                : 'SuperMockTest_bot'}
            </p>
          </div>
        </div>
      </CardContent>
    </ModernCard>
  );
};

export default TelegramConfigDebug;
