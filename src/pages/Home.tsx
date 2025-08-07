import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
import {
  MessageSquare,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/collectingcontacts');
    } else {
      navigate('/auth');
    }
  };

  return (
    <BackgroundGradient className="min-h-screen">
      {/* Hero Section */}
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
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="font-semibold text-lg py-4 px-8 rounded-xl"
              >
                Войти через Telegram
              </Button>
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

      {/* Features Section */}
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
                Защищенная авторизация через Telegram без необходимости
                регистрации
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
                Мгновенный доступ к интервью без сложной настройки
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary card-hover">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Удобный интерфейс</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Современный интерфейс, работающий на всех устройствах
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
          <p className="text-lg text-muted-foreground">
            Простой процесс для начала интервью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Авторизация</h3>
            <p className="text-muted-foreground">
              Войдите через Telegram одним кликом
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Заполнение формы</h3>
            <p className="text-muted-foreground">Укажите ваши данные и опыт</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Интервью</h3>
            <p className="text-muted-foreground">
              Пройдите техническое интервью
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Готовы начать?</CardTitle>
            <CardDescription>
              Присоединяйтесь к SuperMock и пройдите техническое интервью
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold"
            >
              {isAuthenticated ? 'Продолжить интервью' : 'Начать сейчас'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </BackgroundGradient>
  );
};

export default Home;
