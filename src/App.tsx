// React import removed as it's not needed with modern JSX transform
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          SuperMockStart
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Моковые собеседования с коллегами
        </p>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Добро пожаловать!</CardTitle>
            <CardDescription>
              Первый этап собеседования - прохождение моковых собеседований с
              коллегами.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Начать</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
