# Ручные шаги миграции

## Обзор изменений

Система была переведена с email/password авторизации на Telegram-ориентированную систему. Основные изменения:

- Убрана поддержка email/password авторизации
- Все пользователи теперь создаются через Telegram ID
- Упрощена схема базы данных
- Убраны поля: email, password, role, isActive, lastLoginAt

## Шаг 1: Обновление базы данных

### 1.1 Применение миграций

```bash
cd backend
npx prisma migrate deploy
```

### 1.2 Проверка схемы

```bash
npx prisma db pull
npx prisma generate
```

## Шаг 2: Создание тестового администратора

### 2.1 Создание администратора по умолчанию

```bash
npm run create-admin
```

Это создаст тестового администратора с Telegram ID `123456789`.

### 2.2 Интерактивное создание администратора

```bash
npm run create-admin interactive
```

### 2.3 Проверка существующих пользователей

```bash
npm run create-admin check
```

## Шаг 3: Обновление переменных окружения

### 3.1 Проверка .env файла

Убедитесь, что в `backend/.env` настроены:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_BOT_USERNAME="your_bot_username"
```

### 3.2 Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен бота
3. Добавьте токен в переменные окружения

## Шаг 4: Тестирование системы

### 4.1 Запуск сервера

```bash
npm run dev
```

### 4.2 Проверка API

```bash
# Проверка здоровья сервера
curl http://localhost:3000/api/health

# Проверка Telegram авторизации
curl http://localhost:3000/api/auth/telegram/verify
```

## Шаг 5: Обновление фронтенда

### 5.1 Проверка компонентов

Убедитесь, что все компоненты используют Telegram авторизацию:

- `TelegramAuth.tsx`
- `TelegramAuthButton.tsx`
- `TelegramAuthStatus.tsx`

### 5.2 Удаление старых компонентов

Можно удалить компоненты, связанные с email/password авторизацией:

- `Auth.tsx` (если не используется)
- `AuthDemo.tsx` (если не используется)

## Шаг 6: Проверка работоспособности

### 6.1 Тестирование авторизации

1. Откройте приложение в браузере
2. Нажмите кнопку "Войти через Telegram"
3. Авторизуйтесь через Telegram
4. Проверьте, что пользователь создался в базе данных

### 6.2 Проверка API endpoints

```bash
# Получение пользователя по Telegram ID
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/users/telegram/YOUR_TELEGRAM_ID

# Обновление статуса пользователя
curl -X PUT -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CANDIDATE"}' \
  http://localhost:3000/api/users/YOUR_USER_ID/status
```

## Важные замечания

1. **Telegram ID**: Все пользователи теперь идентифицируются по Telegram ID
2. **Статусы**: Доступны статусы `INTERVIEWER` и `CANDIDATE`
3. **Безопасность**: Авторизация происходит через Telegram Web App
4. **Тестирование**: Для тестирования используйте Telegram ID `123456789`

## Устранение проблем

### Проблема: "Unknown argument `email`"

**Решение**: Обновите код, убрав все ссылки на поле `email` в модели User.

### Проблема: "User not found"

**Решение**: Убедитесь, что пользователь создан через Telegram авторизацию.

### Проблема: "Invalid Telegram hash"

**Решение**: Проверьте настройки Telegram Bot и переменные окружения.

## Заключение

После выполнения всех шагов система будет полностью переведена на Telegram-ориентированную авторизацию. Все старые компоненты email/password авторизации можно безопасно удалить.
