# SuperMock Backend

Backend приложения SuperMock с расширенной системой авторизации, поддерживающей как классическую аутентификацию, так и интеграцию с Telegram.

## 🚀 Основные возможности

### 💫 Система авторизации

- 📧 **Email/Password авторизация** - классическая регистрация и вход
- 🤖 **Telegram Web App** - авторизация через Telegram приложения
- 🔗 **Telegram Login Widget** - вход через веб-виджет Telegram
- 🔐 **JWT токены с ролями** - безопасная система сессий (USER/ADMIN)
- 👥 **Управление ролями** - администраторы и обычные пользователи
- 🔄 **Смена паролей** - безопасное обновление учетных данных
- 🔗 **Привязка аккаунтов** - связывание email и Telegram аккаунтов

### 🎯 Бизнес-логика

- 📊 Система профессий и интервью
- 👤 Управление статусами пользователей (интервьюер/кандидат)
- 📝 Система обратной связи и форм

### 🛡️ Безопасность и производительность

- 🔒 Хэширование паролей с bcrypt (12 rounds)
- 🏥 Health checks для zero downtime deployment
- 📈 Rate limiting для защиты от атак
- ⚡ Валидация входных данных
- 🗄️ PostgreSQL с Prisma ORM

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

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/supermock"

# Server Configuration
PORT=3001
HTTPS_PORT=3443
NODE_ENV=development

# URLs Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001/api

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Запуск

**Режим разработки:**

```bash
# Инициализация базы данных
npm run db:generate
npm run db:push

# Создание администратора по умолчанию
npm run create-admin

# Запуск сервера
npm run dev
```

**Продакшн:**

```bash
npm run build
npm run db:generate
npm run db:push
npm run create-admin
npm start
```

Сервер будет доступен по адресу: `http://localhost:3001`

### 🔧 Настройка базы данных

Проект использует PostgreSQL с Prisma ORM:

```bash
# Генерация Prisma клиента
npm run db:generate

# Применение изменений схемы к БД
npm run db:push

# Создание миграций
npm run db:migrate

# Prisma Studio (веб-интерфейс для БД)
npm run db:studio
```

### 👤 Создание администратора

```bash
# Автоматическое создание администратора по умолчанию
npm run create-admin

# Интерактивное создание
npm run create-admin interactive

# Проверка существующих администраторов
npm run create-admin check
```

**Данные администратора по умолчанию:**

- Email: `korobprog@gmail.com`
- Пароль: `Krishna1284Radha`
- Роль: ADMIN

⚠️ **Обязательно смените пароль после первого входа!**

## 📡 API Endpoints

### Аутентификация

#### POST `/api/auth/register`

Регистрация нового пользователя

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

#### POST `/api/auth/login`

Вход через email/password

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### POST `/api/auth/change-password`

Изменение пароля (требует авторизации)

**Заголовки:**

```
Authorization: Bearer your_jwt_token
```

**Тело запроса:**

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

#### POST `/api/auth/telegram`

Аутентификация через Telegram Web App

**Тело запроса:**

```json
{
  "initData": "telegram_web_app_init_data_string"
}
```

#### POST `/api/auth/telegram-widget`

Аутентификация через Telegram Login Widget

**Тело запроса:**

```json
{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "auth_date": 1640995200,
  "hash": "telegram_hash"
}
```

#### POST `/api/auth/link-telegram`

Привязка Telegram аккаунта (требует авторизации)

**Заголовки:**

```
Authorization: Bearer your_jwt_token
```

**Тело запроса:**

```json
{
  "telegramId": "123456789",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Стандартный ответ авторизации:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_db_id",
      "email": "user@example.com",
      "telegramId": "123456789",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "role": "USER",
      "status": "INTERVIEWER"
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
- `@prisma/client` - Prisma ORM клиент
- `bcryptjs` - хэширование паролей
- `node-telegram-bot-api` - работа с Telegram Bot API
- `jsonwebtoken` - JWT токены
- `cors` - CORS middleware
- `helmet` - безопасность HTTP заголовков
- `express-rate-limit` - ограничение запросов
- `dotenv` - переменные окружения
- `uuid` - генерация уникальных ID

### Разработка

- `typescript` - типизация
- `nodemon` - автоматическая перезагрузка
- `tsx` - TypeScript runner
- `prisma` - ORM для работы с базой данных

## 🚀 Деплой

### Docker и Dokploy

Проект готов для деплоя с Dokploy:

1. **См. подробную инструкцию**: [DOKPLOY_DEPLOYMENT.md](../DOKPLOY_DEPLOYMENT.md)
2. **Docker Compose**: настроен в корневой директории
3. **Health Checks**: встроены для zero downtime deployment
4. **Environment Variables**: настроены для production

### Ключевые особенности для production

- 🏥 Health checks на `/api/health`
- 🗄️ PostgreSQL с persistent volumes
- 🔒 Безопасные переменные окружения
- 📊 Logging в `/app/logs`
- ⚡ Rate limiting настроен
- 🔐 Секретные JWT ключи

## 🛠️ Архитектура

```
backend/
├── src/
│   ├── controllers/     # Контроллеры для обработки запросов
│   │   ├── authController.ts
│   │   └── ...
│   ├── middleware/      # Middleware (аутентификация, роли)
│   │   ├── auth.ts
│   │   └── ...
│   ├── routes/          # Маршруты API
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   └── ...
│   ├── services/        # Бизнес-логика
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── prisma.ts
│   ├── utils/           # Утилиты
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── telegram.ts
│   │   └── validation.ts
│   ├── types/           # TypeScript типы
│   └── index.ts         # Главный файл сервера
├── prisma/              # Схема базы данных
│   ├── schema.prisma
│   └── migrations/
├── scripts/             # Скрипты для управления
│   └── createAdmin.ts
└── Dockerfile          # Docker образ
```
