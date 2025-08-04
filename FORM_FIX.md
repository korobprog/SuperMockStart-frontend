# Исправление проблемы с отправкой формы

## Проблема

Форма на странице `Collectingcontacts.tsx` отправлялась на неправильный URL:

- **Было**: `http://localhost:5173/api/form` (фронтенд порт)
- **Должно быть**: `http://localhost:3001/api/form` (бэкенд порт)

## Решение

### 1. Исправлены файлы с хардкодом URL

**Collectingcontacts.tsx**:

```typescript
// Было
const response = await fetch('/api/form', {

// Стало
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/api/form`, {
```

**Chooseinterview.tsx**:

```typescript
// Добавлена переменная API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Исправлены все fetch вызовы
const response = await fetch(`${API_URL}/api/auth/test-token`);
```

**TelegramDevPanel.tsx**:

```typescript
// Добавлена переменная API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Исправлены все fetch вызовы
const response = await fetch(`${API_URL}/api/auth/telegram-widget`);
```

### 2. Настроен файл .env.local

```env
VITE_API_URL=http://localhost:3001
```

### 3. Проверка работоспособности

1. **Бэкенд работает**: `curl http://localhost:3001/health`
2. **API endpoint доступен**: `curl http://localhost:3001/api/form`
3. **Фронтенд перезапущен** для подхвата переменных окружения

## Результат

✅ Форма теперь отправляется на правильный URL: `http://localhost:3001/api/form`  
✅ Все API вызовы используют переменную окружения `VITE_API_URL`  
✅ Код стал более гибким для разных окружений (dev/prod)

## Дополнительные улучшения

- Все файлы теперь используют единый подход к API URL
- Легко переключаться между dev и prod окружениями
- Убраны хардкод URL в коде
