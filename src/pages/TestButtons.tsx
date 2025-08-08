import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import BackgroundGradient from '../components/BackgroundGradient';

const TestButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleTestNavigation = (path: string) => {
    console.log(`🔍 Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <BackgroundGradient className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            🧪 Тест кнопок навигации
          </h1>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Основные страницы:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  onClick={() => handleTestNavigation('/')}
                  className="w-full"
                >
                  Главная страница
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/collectingcontacts')}
                  className="w-full"
                >
                  Форма профессий
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/profile')}
                  className="w-full"
                >
                  Профиль (защищено)
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/collectingcontacts')}
                  className="w-full"
                >
                  Сбор контактов
                </Button>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Тестовые страницы:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  onClick={() => handleTestNavigation('/dashboard')}
                  className="w-full"
                >
                  Дашборд (защищено)
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/test-feedback')}
                  className="w-full"
                >
                  Test Feedback
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">
                Функциональные страницы:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  onClick={() => handleTestNavigation('/interview')}
                  className="w-full"
                >
                  Интервью
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/profile')}
                  className="w-full"
                >
                  Профиль
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/dashboard')}
                  className="w-full"
                >
                  Дашборд
                </Button>
                <Button
                  onClick={() => handleTestNavigation('/chooseinterview')}
                  className="w-full"
                >
                  Выбор интервью
                </Button>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="mr-2"
              >
                Вернуться на главную
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Перезагрузить страницу
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default TestButtons;
