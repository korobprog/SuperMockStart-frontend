# Исправление потока интервью

## Проблема

После завершения собеседования оба участника видели только информацию о завершенном интервью и не могли создать новое интервью.

## Причина

1. Статус очереди не очищался после завершения сессии
2. Пользователи оставались в состоянии `MATCHED`
3. Отсутствовали кнопки для создания новых интервью

## Решение

### Backend изменения

#### 1. Очистка статуса очереди после завершения сессии

**Файл:** `backend/src/services/calendarService.ts`

Добавлена логика очистки статуса очереди для обоих участников после завершения сессии:

```typescript
// Очищаем статус очереди для обоих участников
await prisma.interviewQueue.updateMany({
  where: {
    OR: [{ userId: session.candidateId }, { userId: session.interviewerId }],
    status: QueueStatus.MATCHED,
    matchedSessionId: sessionId,
  },
  data: {
    status: QueueStatus.CANCELLED,
    matchedSessionId: null,
  },
});
```

### Frontend изменения

#### 1. Обновление списка завершенных сессий

**Файл:** `src/pages/Interview.tsx`

Добавлен вызов `loadCompletedSessions()` после завершения сессии:

```typescript
// Обновляем список завершенных сессий
loadCompletedSessions();
```

#### 2. Кнопка "Создать новое интервью"

Добавлены кнопки для создания новых интервью в двух местах:

1. **В секции завершенных собеседований:**

```typescript
{
  /* Кнопка для создания нового интервью */
}
<div className="flex justify-center pt-4 border-t">
  <Button
    onClick={() => {
      // Сбрасываем состояние формы для нового интервью
      setValue('');
      setSelectedTimeSlot(null);
      setShowCalendar(false);
      setQueueStatus(null);
      dispatch(clearError());
      // Прокручиваем к началу страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    className="bg-green-600 hover:bg-green-700"
  >
    <CheckCircle className="h-4 w-4 mr-2" />
    Создать новое интервью
  </Button>
</div>;
```

2. **В секции истории профессий (когда нет активных сессий):**

```typescript
{
  /* Кнопка для создания нового интервью когда нет активных сессий */
}
{
  completedSessions.length === 0 && (
    <div className="mt-6">
      <Button
        onClick={() => {
          // Сбрасываем состояние формы для нового интервью
          setValue('');
          setSelectedTimeSlot(null);
          setShowCalendar(false);
          setQueueStatus(null);
          dispatch(clearError());
          // Прокручиваем к началу страницы
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Создать новое интервью
      </Button>
    </div>
  );
}
```

#### 3. Импорт clearError

Добавлен импорт для очистки ошибок из Redux store:

```typescript
import {
  addSelectedProfession,
  clearError,
} from '@/store/slices/professionSlice';
```

## Результат

Теперь после завершения собеседования:

1. ✅ Статус очереди автоматически очищается
2. ✅ Пользователи видят список завершенных собеседований
3. ✅ Доступны кнопки для создания новых интервью
4. ✅ Форма сбрасывается для нового интервью
5. ✅ Пользователи могут легко начать новый процесс

## Тестирование

Для тестирования создан скрипт `test-interview-flow.js`, который проверяет:

- Статус очереди
- Завершенные сессии
- Процесс завершения сессии

## Дополнительные улучшения

1. **Улучшенное описание:** Изменено описание секции завершенных собеседований
2. **Плавная прокрутка:** Добавлена плавная прокрутка к началу страницы
3. **Сброс состояния:** Полный сброс состояния формы для нового интервью
