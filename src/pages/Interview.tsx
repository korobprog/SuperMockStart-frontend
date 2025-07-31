import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

function Interview() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">← Назад</Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Собеседование</h1>
          <div className="w-20"></div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Моковое собеседование</CardTitle>
            <CardDescription>
              Вопросы для подготовки к реальному собеседованию
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Вопрос 1</h3>
              <p className="text-muted-foreground">
                Расскажите о своем опыте работы с React и TypeScript
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Здесь будет поле для ответа...
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Вопрос 2</h3>
              <p className="text-muted-foreground">
                Как бы вы организовали состояние в большом React приложении?
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Здесь будет поле для ответа...
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline">Предыдущий</Button>
              <Button>Следующий</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Interview;
