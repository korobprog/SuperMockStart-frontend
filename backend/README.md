# SuperMock Backend

Бэкенд для приложения SuperMock с аутентификацией через Telegram бота.

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- npm или pnpm
- Telegram бот (уже создан: @SuperMock_bot)

### Установка

1. Установите зависимости:

```bash
cd backend
npm install
```

2. Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

3. Настройте переменные окружения в `.env`:

```env
# Telegram Bot Configuration
TELEGRAM_TOKEN=your_telegram_bot_token_here
BOT_USERNAME=SuperMock_bot

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Запуск

**Режим разработки:**

```bash
npm run dev
```

**Продакшн:**

```bash
npm run build
npm start
```

Сервер будет доступен по адресу: `http://localhost:3001`

## 📡 API Endpoints

### Аутентификация

#### POST `/api/auth/telegram`

Аутентификация через Telegram Web App

**Тело запроса:**

```json
{
  "initData": "telegram_web_app_init_data_string"
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 123456789,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe"
    }
  },
  "message": "Authentication successful"
}
```

#### POST `/api/auth/verify`

Верификация JWT токена

**Заголовки:**

```
Authorization: Bearer your_jwt_token
```

#### GET `/api/auth/profile`

Получение профиля текущего пользователя

**Заголовки:**

```
Authorization: Bearer your_jwt_token
```

#### PUT `/api/auth/refresh-user-info`

Обновление информации о пользователе через Telegram API

**Заголовки:**

```
Authorization: Bearer your_jwt_token
```

#### GET `/api/auth/status`

Проверка статуса аутентификации

**Заголовки (опционально):**

```
Authorization: Bearer your_jwt_token
```

### Системные

#### GET `/health`

Проверка состояния сервера

## 🔐 Безопасность

- **Helmet.js** - защита заголовков HTTP
- **CORS** - настройки для фронтенда
- **Rate Limiting** - ограничение количества запросов
- **JWT** - безопасная аутентификация
- **Telegram Web App Validation** - валидация данных от Telegram

## 🏗️ Архитектура

```
src/
├── controllers/     # Контроллеры для обработки запросов
├── middleware/      # Middleware (аутентификация, валидация)
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── types/           # TypeScript типы
├── utils/           # Утилиты (JWT, Telegram)
└── index.ts         # Главный файл сервера
```

## 🔧 Настройка Telegram бота

1. Убедитесь, что у вас есть токен бота в переменной `VITE_TELEGRAM_TOKEN`
2. Бот должен быть настроен для работы с Web Apps
3. В настройках бота включите возможность добавления в группы

## 📝 Логирование

Сервер логирует все входящие запросы в формате:

```
2024-01-01T12:00:00.000Z - GET /health
2024-01-01T12:00:01.000Z - POST /api/auth/telegram
```

## 🚨 Обработка ошибок

Все ошибки возвращаются в формате:

```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

## 🔄 Разработка

### Структура проекта

- **TypeScript** для типизации
- **ES Modules** для современного импорта
- **nodemon** для автоматической перезагрузки в режиме разработки

### Команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшна
- `npm start` - запуск продакшн версии

## 📦 Зависимости

### Основные

- `express` - веб-фреймворк
- `node-telegram-bot-api` - работа с Telegram Bot API
- `jsonwebtoken` - JWT токены
- `cors` - CORS middleware
- `helmet` - безопасность

### Разработка

- `typescript` - типизация
- `nodemon` - автоматическая перезагрузка
- `tsx` - TypeScript runner
