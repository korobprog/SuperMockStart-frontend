import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestCompleteSession = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
  const sessionId = 'test-session-1';

  // Тестовый расширенный токен
  const TEST_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OSwidXNlcm5hbWUiOiJ0ZXN0XzEyMzQ1Njc4OSIsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlVzZXIiLCJhdXRoVHlwZSI6InRlbGVncmFtIiwiaWF0IjoxNzU0Mjg2OTgwLCJleHAiOjE3NTQ4OTE3ODB9.lXnXWkzEEmbDJHdoYhwyQAyXkF3C8an2HvgSsC1W6A4';

  const handleCompleteSession = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/calendar/sessions/${sessionId}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        alert('Сессия успешно завершена!');
      } else {
        setError(`Ошибка: ${data.error}`);
        alert(`Ошибка при завершении сессии: ${data.error}`);
      }
    } catch (error) {
      console.error('Error completing session:', error);
      setError('Ошибка при завершении сессии');
      alert('Ошибка при завершении сессии');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Тест завершения сессии
          </h1>
          <div className="w-20"></div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Завершение сессии</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Нажмите кнопку ниже, чтобы завершить тестовую сессию
              </p>

              <Button
                onClick={handleCompleteSession}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  'Завершение...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Завершить собеседование
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-medium text-green-800 mb-2">Результат:</h3>
                <pre className="text-sm text-green-700">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Ошибка:
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestCompleteSession;
