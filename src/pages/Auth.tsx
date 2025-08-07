import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Shield, Zap, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CardContent, ModernCard } from '../components/ui/card';
import AuthSection from '../components/AuthSection';
import BackgroundGradient from '../components/BackgroundGradient';
import Footer from '../components/Footer';

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (_user: any, token: string) => {
    console.log('Auth success, token:', token);

    // Небольшая задержка, чтобы Redux store успел обновиться
    setTimeout(() => {
      // Проверяем, есть ли данные формы после авторизации
      const checkFormDataAfterAuth = async () => {
        try {
          const apiUrl =
            import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
          const response = await fetch(`${apiUrl}/api/form`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Form data after auth:', data);

            if (
              data.success &&
              data.data &&
              data.data.profession &&
              data.data.country
            ) {
              // Если есть данные формы (профессия и страна), переходим к интервью
              navigate('/interview');
            } else {
              // Если нет данных формы, переходим к сбору контактов
              navigate('/collectingcontacts');
            }
          } else {
            console.log(
              '❌ Ошибка запроса данных формы, перенаправляем на /collectingcontacts'
            );
            // В случае ошибки переходим к сбору контактов
            navigate('/collectingcontacts');
          }
        } catch (error) {
          console.error('Error checking form data after auth:', error);
          // В случае ошибки переходим к сбору контактов
          navigate('/collectingcontacts');
        }
      };

      checkFormDataAfterAuth();
    }, 1500); // Увеличиваем задержку до 1.5 секунды
  };

  const handleAuthError = (error: string) => {
    console.error('Auth error:', error);
    // Можно добавить уведомление об ошибке
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <BackgroundGradient className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold">Авторизация</h1>
                <p className="text-sm text-muted-foreground">
                  Войдите в SuperMock через Telegram
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gradient">
              Добро пожаловать в SuperMock
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Выберите удобный способ авторизации через Telegram
            </p>
          </div>

          {/* Auth Section */}
          <AuthSection
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
          />

          {/* Benefits Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModernCard className="p-4 bg-gradient-secondary card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Безопасно</h3>
                <p className="text-xs text-muted-foreground">
                  Защищенная авторизация через Telegram
                </p>
              </CardContent>
            </ModernCard>

            <ModernCard className="p-4 bg-gradient-secondary card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Быстро</h3>
                <p className="text-xs text-muted-foreground">
                  Мгновенный вход без регистрации
                </p>
              </CardContent>
            </ModernCard>

            <ModernCard className="p-4 bg-gradient-secondary card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-semibold mb-1">Удобно</h3>
                <p className="text-xs text-muted-foreground">
                  Работает на всех устройствах
                </p>
              </CardContent>
            </ModernCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </BackgroundGradient>
  );
};

export default Auth;
