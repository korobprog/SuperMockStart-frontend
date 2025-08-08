import React from 'react';
import TelegramConfigDebug from '../components/TelegramConfigDebug';
import TelegramLoginWidget from '../components/TelegramLoginWidget';

const TelegramConfigTest: React.FC = () => {
  const handleAuthSuccess = (user: any, token: string) => {
    console.log('✅ Auth success:', { user, token });
  };

  const handleAuthError = (error: string) => {
    console.error('❌ Auth error:', error);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🔧 Telegram Bot Configuration Test
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Debug Information */}
        <TelegramConfigDebug />

        {/* Telegram Login Widget */}
        <TelegramLoginWidget
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            📋 Instructions for Testing:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • Check the debug info above to verify correct bot selection
            </li>
            <li>• Try the Telegram Login Widget to test authentication</li>
            <li>• Check browser console for detailed logs</li>
            <li>
              • Verify that the correct bot is being used for your environment
            </li>
          </ul>
        </div>

        {/* Environment Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            🌍 Environment Information:
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Current URL:</strong> {window.location.href}
            </p>
            <p>
              <strong>Origin:</strong> {window.location.origin}
            </p>
            <p>
              <strong>User Agent:</strong> {navigator.userAgent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramConfigTest;
