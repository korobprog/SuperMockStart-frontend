# SuperMock - Платформа для проведения интервью

## Описание

SuperMock - это веб-приложение для проведения технических интервью с использованием Telegram для авторизации пользователей.

## Установка и запуск

### Предварительные требования

- Node.js 18+
- pnpm
- Docker и Docker Compose

### Разработка

1. Клонируйте репозиторий
2. Установите зависимости:

   ```bash
   pnpm install
   ```

3. Запустите в режиме разработки:
   ```bash
   pnpm dev:full
   ```

### Продакшн

Для запуска в продакшне используйте Docker Compose:

```bash
docker-compose up -d
```

## Решение проблем с авторизацией Telegram

### Проблема: После авторизации не показывается форма

**Симптомы:**

- Пользователь успешно авторизуется через Telegram
- Показывается страница успешной авторизации
- После этого не происходит переход к форме сбора данных
- При переходе на другие страницы снова запрашивается авторизация

**Возможные причины и решения:**

#### 1. Проблема с callback URL

**Проверьте:**

- В `TelegramLoginWidget.tsx` callback URL настроен правильно
- В `App.tsx` маршрут `/auth-callback` существует
- В настройках бота в BotFather указан правильный домен

**Решение:**

```javascript
// В TelegramLoginWidget.tsx
const callbackUrl = `${window.location.protocol}//${window.location.host}/auth-callback`;
```

#### 2. Проблема с синхронизацией Redux store

**Проверьте:**

- В `TelegramAuthCallback.tsx` данные сохраняются в Redux store
- В `useAuth.ts` правильно обрабатывается состояние из localStorage

**Решение:**

```javascript
// В TelegramAuthCallback.tsx
dispatch(setToken(data.data.token));
dispatch(setUser(user));
```

#### 3. Проблема с проверкой токена

**Проверьте:**

- В `ProtectedRoute.tsx` вызывается `checkAuthStatus`
- В `useAuth.ts` правильно проверяется токен на сервере

**Решение:**

```javascript
// В ProtectedRoute.tsx
useEffect(() => {
  if (!isAuthenticated && !loading) {
    checkAuthStatus();
  }
}, [isAuthenticated, loading, checkAuthStatus]);
```

#### 4. Проблема с перенаправлением

**Проверьте:**

- В `Auth.tsx` правильно обрабатывается успешная авторизация
- Задержка достаточна для обновления Redux store

**Решение:**

```javascript
// В Auth.tsx
setTimeout(() => {
  checkFormDataAfterAuth();
}, 1500); // Увеличиваем задержку
```

### Отладка авторизации

Для отладки проблем с авторизацией используйте:

1. **Страница отладки:** `/debug-auth`
2. **Проверка токена:** `/token-check`
3. **Консоль браузера:** Проверьте логи на наличие ошибок

### Проверка настроек бота

1. Убедитесь, что бот настроен в BotFather:

   ```
   /setdomain - установите домен вашего сайта
   /setdescription - добавьте описание бота
   ```

2. Проверьте переменные окружения:

   ```env
   VITE_TELEGRAM_BOT_USERNAME=SuperMock_bot
   VITE_API_URL=https://api.supermock.ru
   TELEGRAM_TOKEN=your_bot_token
   ```

3. Убедитесь, что backend доступен и отвечает на запросы:
   ```bash
   curl https://api.supermock.ru/api/auth/test
   ```

### Частые проблемы

#### Проблема: "Telegram Web App не доступен"

**Решение:** Откройте приложение через Telegram бота, а не в обычном браузере.

#### Проблема: "Ссылка авторизации устарела"

**Решение:** Данные авторизации действительны только 5 минут. Попробуйте авторизоваться снова.

#### Проблема: "Ошибка обработки авторизации"

**Решение:** Проверьте логи backend и убедитесь, что все необходимые поля передаются.

### Тестирование

Для тестирования авторизации:

1. Откройте приложение в Telegram через @SuperMock_bot
2. Нажмите кнопку "Войти через Telegram"
3. Подтвердите авторизацию
4. Проверьте, что произошел переход к форме сбора данных

Если проблемы продолжаются, проверьте:

- Логи backend в контейнере Docker
- Консоль браузера на наличие ошибок
- Сетевые запросы в DevTools

## Структура проекта

```
frontend/
├── src/
│   ├── components/          # React компоненты
│   ├── pages/              # Страницы приложения
│   ├── hooks/              # React хуки
│   ├── store/              # Redux store
│   └── utils/              # Утилиты
├── backend/
│   ├── src/
│   │   ├── controllers/    # Контроллеры API
│   │   ├── services/       # Бизнес-логика
│   │   └── routes/         # Маршруты API
│   └── prisma/             # Схема базы данных
└── docker-compose.yml      # Docker конфигурация
```

## API Endpoints

### Авторизация

- `POST /api/auth/telegram` - Авторизация через Telegram Web App
- `POST /api/auth/telegram-widget` - Авторизация через Telegram Login Widget
- `POST /api/auth/verify` - Проверка JWT токена
- `GET /api/auth/test-token` - Получение тестового токена (только dev)

### Формы

- `GET /api/form` - Получение данных формы пользователя
- `POST /api/form` - Сохранение данных формы

## Развертывание

### Dokploy

Для развертывания через Dokploy используйте скрипты в папке `scripts/`:

```bash
./scripts/deploy-to-dokploy.sh
```

### Ручное развертывание

1. Соберите frontend:

   ```bash
   pnpm build
   ```

2. Соберите backend:

   ```bash
   cd backend
   pnpm build
   ```

3. Запустите через Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Лицензия

MIT
