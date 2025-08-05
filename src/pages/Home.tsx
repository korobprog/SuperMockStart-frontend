import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import TelegramAuth from '../components/TelegramAuth';
import TelegramBotAuth from '../components/TelegramBotAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import BackgroundGradient from '../components/BackgroundGradient';
import Footer from '../components/Footer';
import {
  Code,
  Users,
  Zap,
  Shield,
  BookOpen,
  Target,
  Star,
  Clock,
  Award,
} from 'lucide-react';

const Home: React.FC = () => {
  const { user, loading, isAuthenticated } = useTelegramAuth();
  const [activeTab, setActiveTab] = React.useState('webapp');
  const navigate = useNavigate();

  // Перемещаем useEffect в начало компонента
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/interview');
    }
  }, [navigate, isAuthenticated, user]);

  const handleAuthSuccess = (_user: any, token: string) => {
    // Сохраняем токен в правильном ключе
    localStorage.setItem('telegram_token', token);

    // Небольшая задержка перед перенаправлением
    setTimeout(() => {
      navigate('/interview');
    }, 500);
  };

  const handleAuthError = (error: string) => {
    console.error('Ошибка авторизации:', error);
  };

  if (loading) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-glow-pulse">
            <div className="w-8 h-8 bg-white rounded-full animate-ping"></div>
          </div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </BackgroundGradient>
    );
  }

  // Если пользователь авторизован, показываем загрузку во время перенаправления
  if (isAuthenticated && user) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-glow-pulse">
            <div className="w-8 h-8 bg-white rounded-full animate-ping"></div>
          </div>
          <p className="text-muted-foreground">
            Перенаправление на страницу интервью...
          </p>
        </div>
      </BackgroundGradient>
    );
  }

  // Features data
  const features = [
    {
      icon: Code,
      title: 'Реальные задачи',
      description:
        'Решайте задачи, которые встречаются на настоящих собеседованиях',
    },
    {
      icon: Users,
      title: 'Живые интервьюеры',
      description:
        'Практикуйтесь с опытными разработчиками и получайте реальный фидбек',
    },
    {
      icon: Zap,
      title: 'Мгновенный старт',
      description: 'Начните тренировку за несколько секунд через Telegram',
    },
    {
      icon: Shield,
      title: 'Безопасно',
      description: 'Анонимные сессии и защищенная авторизация через Telegram',
    },
    {
      icon: BookOpen,
      title: 'История прогресса',
      description: 'Отслеживайте свой рост и анализируйте слабые места',
    },
    {
      icon: Target,
      title: 'Целевая подготовка',
      description: 'Фокусируйтесь на конкретных навыках и технологиях',
    },
  ];

  // Неавторизованный пользователь - показываем новый красивый дизайн
  return (
    <BackgroundGradient className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-secondary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Почему SuperMock?
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gradient">
              Современная платформа для подготовки
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              К IT-собеседованиям с реальными интервьюерами и актуальными
              задачами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 card-hover border-0 bg-white/50 backdrop-blur hover-lift"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">15,000+</div>
                <div className="text-sm text-muted-foreground">Участников</div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm text-muted-foreground">
                  Собеседований
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Доступность</div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Успешных</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section
        id="auth-section"
        className="py-20 bg-gradient-secondary relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-2xl mx-auto shadow-elegant bg-white/80 backdrop-blur">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gradient">
                Начните прямо сейчас
              </CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Войдите через Telegram и начните первое собеседование
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              {/* Проверяем, находимся ли мы в Telegram Web App */}
              {window.Telegram?.WebApp ? (
                // Если мы в Telegram Web App, показываем только Web App авторизацию
                <div className="space-y-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm text-primary font-medium">
                        Вы используете Telegram Web App
                      </span>
                    </div>
                  </div>

                  <TelegramAuth
                    onAuthSuccess={handleAuthSuccess}
                    onAuthError={handleAuthError}
                  />
                </div>
              ) : (
                // Если мы в обычном браузере, показываем выбор метода авторизации
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gradient-secondary">
                    <TabsTrigger value="webapp" className="text-xs sm:text-sm">
                      Telegram Web App
                    </TabsTrigger>
                    <TabsTrigger value="bot" className="text-xs sm:text-sm">
                      Telegram Bot
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="webapp" className="space-y-4 mt-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm text-primary font-medium">
                          Рекомендуется для мобильных устройств
                        </span>
                      </div>
                    </div>
                    <TelegramAuth
                      onAuthSuccess={handleAuthSuccess}
                      onAuthError={handleAuthError}
                    />
                  </TabsContent>
                  <TabsContent value="bot" className="space-y-4 mt-4">
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mr-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        </div>
                        <span className="text-sm text-accent font-medium">
                          Альтернативный способ авторизации
                        </span>
                      </div>
                    </div>
                    <TelegramBotAuth
                      onAuthSuccess={handleAuthSuccess}
                      onAuthError={handleAuthError}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </BackgroundGradient>
  );
};

export default Home;
