import React from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  ModernCard,
  ElevatedCard,
  ColoredCard,
  GradientCard,
} from '../components/ui/card';
import {
  Input,
  ModernInput,
  ElevatedInput,
  ColoredInput,
  GradientInput,
} from '../components/ui/input';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';

const ModernBordersDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Современные Границы с Тенями
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Демонстрация новых стилей границ с мягкими тенями
          </p>
        </div>

        {/* Карточки */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Карточки с Современными Границами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Обычная карточка</CardTitle>
                <CardDescription>Стандартная граница</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Это обычная карточка с простой границей
                </p>
              </CardContent>
            </Card>

            <ModernCard className="p-6">
              <CardHeader>
                <CardTitle>Современная карточка</CardTitle>
                <CardDescription>Мягкая тень</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Карточка с современной границей и мягкой тенью
                </p>
              </CardContent>
            </ModernCard>

            <ElevatedCard className="p-6">
              <CardHeader>
                <CardTitle>Приподнятая карточка</CardTitle>
                <CardDescription>Выраженная тень</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Карточка с более выраженной тенью
                </p>
              </CardContent>
            </ElevatedCard>

            <ColoredCard className="p-6">
              <CardHeader>
                <CardTitle>Цветная карточка</CardTitle>
                <CardDescription>Синяя тень</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Карточка с цветной тенью
                </p>
              </CardContent>
            </ColoredCard>

            <GradientCard className="p-6">
              <CardHeader>
                <CardTitle>Градиентная карточка</CardTitle>
                <CardDescription>Фиолетовая тень</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Карточка с градиентной тенью
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </section>

        {/* Кнопки */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Кнопки с Современными Границами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full">
              Обычная кнопка
            </Button>
            <Button variant="modern" className="w-full">
              Современная кнопка
            </Button>
            <Button variant="modern-elevated" className="w-full">
              Приподнятая кнопка
            </Button>
            <Button variant="modern-colored" className="w-full">
              Цветная кнопка
            </Button>
            <Button variant="modern-gradient" className="w-full">
              Градиентная кнопка
            </Button>
          </div>
        </section>

        {/* Инпуты */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Поля ввода с Современными Границами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Обычный инпут
              </label>
              <Input placeholder="Введите текст..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Современный инпут
              </label>
              <ModernInput placeholder="Введите текст..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Приподнятый инпут
              </label>
              <ElevatedInput placeholder="Введите текст..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Цветной инпут
              </label>
              <ColoredInput placeholder="Введите текст..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Градиентный инпут
              </label>
              <GradientInput placeholder="Введите текст..." />
            </div>
          </div>
        </section>

        {/* Примеры использования */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Примеры Использования
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ModernCard className="p-6">
              <CardHeader>
                <CardTitle>Форма входа</CardTitle>
                <CardDescription>Современный дизайн формы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <ModernInput type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Пароль
                  </label>
                  <ModernInput type="password" placeholder="••••••••" />
                </div>
                <Button variant="modern" className="w-full">
                  Войти
                </Button>
              </CardContent>
            </ModernCard>

            <ElevatedCard className="p-6">
              <CardHeader>
                <CardTitle>Настройки профиля</CardTitle>
                <CardDescription>
                  Приподнятая карточка для настроек
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя
                  </label>
                  <ElevatedInput placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <ElevatedInput type="tel" placeholder="+7 (999) 123-45-67" />
                </div>
                <Button variant="modern-elevated" className="w-full">
                  Сохранить
                </Button>
              </CardContent>
            </ElevatedCard>
          </div>
        </section>

        {/* Инструкции */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 border-modern">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Как использовать
          </h3>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Классы CSS:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  border-modern
                </code>{' '}
                - базовая современная граница
              </li>
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  border-modern-elevated
                </code>{' '}
                - приподнятая граница
              </li>
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  border-modern-colored
                </code>{' '}
                - цветная граница
              </li>
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  border-modern-gradient
                </code>{' '}
                - градиентная граница
              </li>
            </ul>
            <p>
              <strong>Компоненты:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ModernCard
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ElevatedCard
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ColoredCard
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  GradientCard
                </code>
              </li>
              <li>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ModernInput
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ElevatedInput
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ColoredInput
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  GradientInput
                </code>
              </li>
              <li>
                Варианты кнопок:{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  modern
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  modern-elevated
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  modern-colored
                </code>
                ,{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  modern-gradient
                </code>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernBordersDemo;
