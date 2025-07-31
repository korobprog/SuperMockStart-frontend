import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">← Назад</Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">О проекте</h1>
          <div className="w-20"></div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>SuperMockStart</CardTitle>
            <CardDescription>
              Платформа для подготовки к собеседованиям
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Наша миссия</h3>
              <p className="text-muted-foreground">
                Помогаем разработчикам подготовиться к собеседованиям через
                практику с коллегами в безопасной среде.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Как это работает</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Проходите моковые собеседования с коллегами</li>
                <li>• Получайте обратную связь и рекомендации</li>
                <li>• Улучшайте свои навыки коммуникации</li>
                <li>• Готовьтесь к реальным собеседованиям</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Технологии</h3>
              <p className="text-muted-foreground">
                React, TypeScript, Tailwind CSS, React Router
              </p>
            </div>

            <div className="pt-4">
              <Link to="/interview">
                <Button className="w-full">Попробовать сейчас</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default About;
