import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    console.log('🔍 handleGetStarted called');
    console.log('🔍 isAuthenticated:', isAuthenticated);
    console.log('🔍 user:', user);

    if (isAuthenticated) {
      console.log('🔍 Navigating to /collectingcontacts');
      navigate('/collectingcontacts');
    } else {
      console.log('🔍 Navigating to /auth');
      navigate('/auth');
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center max-w-4xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-gradient">
          SuperMock
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
          Платформа для проведения технических интервью с использованием
          Telegram
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isAuthenticated ? 'Продолжить' : 'Начать интервью'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {!isAuthenticated && (
            <>
              <Button
                onClick={() => navigate('/bot-auth')}
                size="lg"
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🔐 Войти через Telegram бота
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="font-semibold text-lg py-4 px-8 rounded-xl"
              >
                Альтернативная авторизация
              </Button>
              <Button
                onClick={() => navigate('/test-buttons')}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                🧪 Тест кнопок
              </Button>
              <Button
                onClick={() => navigate('/bot-auth?userId=1736594064')}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                🧪 Тест с userId
              </Button>
              <Button
                onClick={() => navigate('/telegram-webapp-test')}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                🔐 Тест авторизации
              </Button>
            </>
          )}
        </div>

        {isAuthenticated && user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">
                Добро пожаловать, {user.first_name}!
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
