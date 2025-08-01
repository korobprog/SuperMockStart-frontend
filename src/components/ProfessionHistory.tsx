import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserProfessions,
  removeSelectedProfession,
} from '@/store/slices/professionSlice';

interface ProfessionHistoryProps {
  userId: string;
}

const ProfessionHistory = ({ userId }: ProfessionHistoryProps) => {
  const dispatch = useAppDispatch();
  const { selectedProfessions, loading, error } = useAppSelector(
    (state) => state.profession
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfessions(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveProfession = async (professionId: string) => {
    try {
      await dispatch(removeSelectedProfession(professionId)).unwrap();
    } catch (error) {
      console.error('Failed to remove profession:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>История выбранных профессий</CardTitle>
          <CardDescription>Загрузка...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>История выбранных профессий</CardTitle>
          <CardDescription>Ошибка загрузки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Ошибка: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>История выбранных профессий</CardTitle>
        <CardDescription>
          {selectedProfessions.length === 0
            ? 'Вы еще не выбирали профессии'
            : `Выбрано профессий: ${selectedProfessions.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedProfessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Нет выбранных профессий
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProfessions.map((profession) => (
              <div
                key={profession.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{profession.profession}</div>
                  <div className="text-sm text-muted-foreground">
                    Выбрано:{' '}
                    {new Date(profession.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveProfession(profession.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionHistory;
