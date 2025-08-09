import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import BackgroundGradient from '../components/BackgroundGradient';
import Footer from '../components/Footer';
import { MessageSquare, Shield, Zap, Users, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isInTelegram, login, checkAuthStatus, error } = useTelegramAuth();

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate('/collectingcontacts');
    } else if (isInTelegram) {
      try {
        await login();
        await checkAuthStatus();
        navigate('/collectingcontacts');
      } catch {
        // Error is handled in the auth hook
      }
    } else {
      // If not in Telegram, redirect to login page
      navigate('/login');
    }
  };

  const handleOpenInTelegram = () => {
    try {
      login(); // This will open Telegram
    } catch {
      // Fallback to login page
      navigate('/login');
    }
  };

  return (
    <BackgroundGradient className="min-h-screen">
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-gradient">SuperMock</h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
            Платформа для проведения технических интервью с использованием Telegram
          </p>

          {/* Authentication status and action buttons */}
          {isAuthenticated && user ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">
                    Добро пожаловать, {user.first_name}!
                  </span>
                </div>
              </div>
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Продолжить
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-center">{error}</p>
                </div>
              )}
              
              {!isInTelegram && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb" className="mr-2">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-blue-700 font-medium">Приложение работает через Telegram</span>
                  </div>
                  <p className="text-blue-600 text-sm text-center">
                    Для входа воспользуйтесь Telegram или откройте приложение в Mini App
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isInTelegram ? 'Авторизоваться' : 'Войти через Telegram'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                {!isInTelegram && (
                  <Button
                    onClick={handleOpenInTelegram}
                    size="lg"
                    variant="outline"
                    className="font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Открыть в Telegram
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему SuperMock?</h2>
          <p className="text-lg text-muted-foreground">
            Уникальные возможности для проведения технических интервью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-secondary card-hover">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Безопасная авторизация</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Защищенная авторизация через Telegram без необходимости регистрации
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary card-hover">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Быстрый старт</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Начните собеседование за несколько кликов без сложной настройки
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary card-hover">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Удобное взаимодействие</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Интуитивный интерфейс для интервьюеров и кандидатов
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </BackgroundGradient>
  );
};

export default Home;
