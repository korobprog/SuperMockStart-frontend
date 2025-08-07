import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Link } from 'react-router-dom';
import {
  Code,
  Database,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Github,
  Mail,
  MessageSquare,
} from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">← Назад</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">О проекте</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Основная информация о проекте */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                SuperMock
              </CardTitle>
              <CardDescription>
                Платформа для подготовки к собеседованиям с интеграцией Telegram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Наша миссия</h3>
                <p className="text-muted-foreground">
                  Помогаем разработчикам подготовиться к собеседованиям через
                  практику с коллегами в безопасной среде с использованием
                  современных технологий.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Как это работает</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Авторизация через Telegram Bot API</li>
                  <li>• Проходите моковые собеседования с коллегами</li>
                  <li>• Получайте обратную связь и рекомендации</li>
                  <li>• Улучшайте свои навыки коммуникации</li>
                  <li>• Готовьтесь к реальным собеседованиям</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Технологии */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-green-600" />
                Технологии проекта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frontend */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Frontend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">React 19</div>
                    <div className="text-sm text-blue-600">
                      Основной фреймворк
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">TypeScript</div>
                    <div className="text-sm text-blue-600">Типизация</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Vite</div>
                    <div className="text-sm text-blue-600">Сборщик</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">
                      Tailwind CSS 4
                    </div>
                    <div className="text-sm text-blue-600">Стилизация</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">
                      React Router
                    </div>
                    <div className="text-sm text-blue-600">Маршрутизация</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">
                      Redux Toolkit
                    </div>
                    <div className="text-sm text-blue-600">
                      Управление состоянием
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">
                      React Hook Form
                    </div>
                    <div className="text-sm text-blue-600">Формы</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Zod</div>
                    <div className="text-sm text-blue-600">Валидация</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Radix UI</div>
                    <div className="text-sm text-blue-600">UI компоненты</div>
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  Backend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Node.js</div>
                    <div className="text-sm text-green-600">
                      Среда выполнения
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Express.js</div>
                    <div className="text-sm text-green-600">Web фреймворк</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">TypeScript</div>
                    <div className="text-sm text-green-600">Типизация</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Prisma</div>
                    <div className="text-sm text-green-600">ORM</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">PostgreSQL</div>
                    <div className="text-sm text-green-600">База данных</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">JWT</div>
                    <div className="text-sm text-green-600">Аутентификация</div>
                  </div>
                </div>
              </div>

              {/* Интеграции */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  Интеграции
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-medium text-purple-800">
                      Telegram Bot API
                    </div>
                    <div className="text-sm text-purple-600">
                      Аутентификация
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-medium text-purple-800">Docker</div>
                    <div className="text-sm text-purple-600">
                      Контейнеризация
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-medium text-purple-800">Nginx</div>
                    <div className="text-sm text-purple-600">Прокси сервер</div>
                  </div>
                </div>
              </div>

              {/* Безопасность */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Безопасность
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-medium text-red-800">Helmet</div>
                    <div className="text-sm text-red-600">
                      Заголовки безопасности
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-medium text-red-800">
                      Rate Limiting
                    </div>
                    <div className="text-sm text-red-600">
                      Ограничение запросов
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-medium text-red-800">CORS</div>
                    <div className="text-sm text-red-600">
                      Cross-origin запросы
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Разработчик */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-6 w-6 text-gray-600" />
                Разработчик
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {/* Здесь будет ваше фото из CV */}
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center profile-avatar">
                  <span className="text-gray-500 text-lg">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Коробков Максим Викторович
                  </h3>
                  <p className="text-muted-foreground">
                    React Developer, Frontend Specialist
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Целеустремлённый фронтенд-разработчик с более чем 6-летним
                    опытом работы в экосистеме React. Специализируюсь на
                    создании современных веб-интерфейсов с использованием React,
                    TypeScript, Redux и Web3 технологий.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://github.com/korobprog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
                <a
                  href="https://t.me/korobprog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <MessageSquare className="h-5 w-5" />
                  Telegram
                </a>
                <a
                  href="mailto:korobprog@gmail.com"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Mail className="h-5 w-5" />
                  Email
                </a>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Link to="/collectingcontacts">
              <Button size="lg" className="px-8">
                Попробовать сейчас
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
