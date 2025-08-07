import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import {
  Users,
  Trophy,
  BookOpen,
  Clock,
  Star,
  Play,
  TrendingUp,
  Code,
  Coffee,
  Target,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useTelegramAuth();
  const navigate = useNavigate();

  // Если пользователь не авторизован, показываем загрузку
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-glow-pulse">
            <div className="w-8 h-8 bg-white rounded-full animate-ping"></div>
          </div>
          <p className="text-muted-foreground">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">
            Добро пожаловать, {user.first_name || 'Пользователь'}!
          </h1>
          <p className="text-muted-foreground">
            Продолжаем развиваться и готовиться к IT-собеседованиям
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-secondary border-0 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">
                  Собеседований
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-secondary border-0 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Успешность</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-secondary border-0 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">SMS баланс</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-secondary border-0 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Рейтинг</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Queue */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Живая очередь собеседований
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-success/10 text-success"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  12 онлайн
                </Badge>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Frontend React',
                    level: 'Middle',
                    waiting: 2,
                    time: '~3 мин',
                  },
                  {
                    name: 'Backend Node.js',
                    level: 'Senior',
                    waiting: 1,
                    time: '~1 мин',
                  },
                  {
                    name: 'DevOps',
                    level: 'Junior',
                    waiting: 4,
                    time: '~8 мин',
                  },
                  {
                    name: 'QA Automation',
                    level: 'Middle',
                    waiting: 3,
                    time: '~5 мин',
                  },
                ].map((queue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-secondary card-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{queue.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {queue.level} уровень
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {queue.waiting} в очереди
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {queue.time}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className=" hover:shadow-glow transition-all duration-300"
                      onClick={() => navigate('/interview')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Войти
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6 btn-outline-enhanced"
                variant="outline-enhanced"
                onClick={() => navigate('/interview')}
              >
                Показать все направления
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 shadow-elegant">
              <h3 className="font-semibold mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start hover:shadow-glow transition-all duration-300 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400 hover:border-green-300"
                  onClick={() => navigate('/interview')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Начать собеседование
                </Button>
                <Button
                  className="w-full justify-start btn-outline-enhanced"
                  variant="outline-enhanced"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Тренажеры
                </Button>
                <Button
                  className="w-full justify-start btn-outline-enhanced"
                  variant="outline-enhanced"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Хакатоны
                </Button>
                <Button
                  className="w-full justify-start btn-outline-enhanced"
                  variant="outline-enhanced"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Найти ментора
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 shadow-elegant">
              <h3 className="font-semibold mb-4">Последняя активность</h3>
              <div className="space-y-3">
                {[
                  {
                    action: 'Собеседование React',
                    time: '2 часа назад',
                    rating: 4.5,
                  },
                  {
                    action: 'Тренажер алгоритмов',
                    time: '1 день назад',
                    rating: 4.8,
                  },
                  {
                    action: 'Хакатон финтех',
                    time: '3 дня назад',
                    rating: 4.2,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning fill-current" />
                      <span className="text-xs font-medium">
                        {activity.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Coffee Break */}
            <Card className="p-6 bg-gradient-primary text-white shadow-elegant">
              <div className="flex items-center gap-3 mb-3">
                <Coffee className="w-6 h-6" />
                <h3 className="font-semibold text-zinc-500">
                  Время кофе-брейка!
                </h3>
              </div>
              <p className="text-sm opacity-90 mb-4 text-zinc-500">
                Отдохните и пообщайтесь с коллегами в нашем чате
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30"
              >
                Присоединиться
              </Button>
            </Card>

            {/* Progress Goals */}
            <Card className="p-6 shadow-elegant">
              <h3 className="font-semibold mb-4">Цели на неделю</h3>
              <div className="space-y-3">
                {[
                  {
                    goal: '5 собеседований',
                    progress: 3,
                    total: 5,
                    icon: <Target className="w-4 h-4" />,
                  },
                  {
                    goal: 'Изучить React Hooks',
                    progress: 80,
                    total: 100,
                    icon: <Code className="w-4 h-4" />,
                  },
                  {
                    goal: 'Практика алгоритмов',
                    progress: 60,
                    total: 100,
                    icon: <Zap className="w-4 h-4" />,
                  },
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        {goal.icon}
                      </div>
                      <span className="text-sm font-medium">{goal.goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(goal.progress / goal.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {goal.progress}/{goal.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
