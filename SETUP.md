# SuperMock - Настройка проекта

Полная инструкция по настройке и запуску проекта SuperMock с аутентификацией через Telegram бота.

## 📋 Предварительные требования

- Node.js 18+
- npm или pnpm
- Telegram бот @SuperMock_bot (уже создан)
- Токен бота в переменной окружения `VITE_TELEGRAM_TOKEN`

## 🚀 Быстрая настройка

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта (frontend):

```env
# Telegram Bot Token (уже должен быть в VITE_TELEGRAM_TOKEN)
VITE_TELEGRAM_TOKEN=your_telegram_bot_token_here

# Backend URL
VITE_API_URL=http://localhost:3001
```

### 2. Установка зависимостей

```bash
# Установка зависимостей фронтенда
npm install

# Установка зависимостей бэкенда
cd backend
npm install
cd ..
```

### 3. Настройка бэкенда

Создайте файл `.env` в папке `backend`:

```env
# Telegram Bot Configuration
TELEGRAM_TOKEN=${VITE_TELEGRAM_TOKEN}
BOT_USERNAME=SuperMock_bot

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=supermock-jwt-secret-key-2024-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Запуск проекта

**Терминал 1 - Бэкенд:**

```bash
cd backend
npm run dev
```

**Терминал 2 - Фронтенд:**

```bash
npm run dev
```

## 🔧 Настройка Telegram бота

### 1. Проверка токена бота

Убедитесь, что токен бота доступен в переменной окружения:

```bash
echo $VITE_TELEGRAM_TOKEN
```

### 2. Настройка Web App

1. Откройте @BotFather в Telegram
2. Найдите вашего бота @SuperMock_bot
3. Выполните команду `/setmenubutton`
4. Выберите вашего бота
5. Введите URL вашего приложения: `http://localhost:5173`
6. Введите текст кнопки: "Открыть SuperMock"

### 3. Тестирование

1. Откройте бота @SuperMock_bot в Telegram
2. Нажмите на кнопку меню
3. Выберите "Открыть SuperMock"
4. Приложение должно открыться с аутентификацией

## 📡 API Endpoints

### Аутентификация

- `POST /api/auth/telegram` - Аутентификация через Telegram Web App
- `POST /api/auth/verify` - Верификация JWT токена
- `GET /api/auth/profile` - Получение профиля пользователя
- `PUT /api/auth/refresh-user-info` - Обновление информации пользователя
- `GET /api/auth/status` - Проверка статуса аутентификации

### Системные

- `GET /health` - Проверка состояния сервера

## 🧪 Тестирование

### Тестирование API

Используйте файл `backend/test-api.http` для тестирования API endpoints.

### Тестирование фронтенда

1. Откройте `http://localhost:5173` в браузере
2. Компонент `TelegramAuth` покажет сообщение о необходимости открыть приложение из Telegram
3. Откройте приложение через бота для полного тестирования

## 🔐 Безопасность

- Все API endpoints защищены CORS
- JWT токены имеют ограниченное время жизни
- Rate limiting защищает от DDoS атак
- Telegram Web App данные валидируются криптографически

## 🐛 Отладка

### Логи бэкенда

Бэкенд логирует все запросы в консоль:

```
2024-01-01T12:00:00.000Z - GET /health
2024-01-01T12:00:01.000Z - POST /api/auth/telegram
```

### Проверка состояния

```bash
# Проверка бэкенда
curl http://localhost:3001/health

# Проверка фронтенда
curl http://localhost:5173
```

## 📁 Структура проекта

```
frontend/
├── src/
│   ├── components/
│   │   ├── TelegramAuth.tsx    # Компонент аутентификации
│   │   └── ui/                 # UI компоненты
│   ├── pages/
│   │   └── Home.tsx           # Главная страница
│   └── ...
├── backend/
│   ├── src/
│   │   ├── controllers/       # Контроллеры API
│   │   ├── middleware/        # Middleware
│   │   ├── routes/           # Маршруты
│   │   ├── services/         # Бизнес-логика
│   │   ├── utils/            # Утилиты
│   │   └── index.ts          # Главный файл сервера
│   └── ...
└── ...
```

## 🚨 Решение проблем

### Проблема: "Telegram Web App Required"

**Решение:** Приложение должно быть открыто из Telegram бота, а не напрямую в браузере.

### Проблема: "Invalid Telegram Web App data"

**Решение:**

1. Проверьте токен бота в переменных окружения
2. Убедитесь, что приложение открыто из Telegram
3. Проверьте, что данные не устарели (больше 1 часа)

### Проблема: CORS ошибки

**Решение:**

1. Проверьте настройки CORS в бэкенде
2. Убедитесь, что фронтенд запущен на правильном порту
3. Проверьте переменную `FRONTEND_URL` в `.env`

### Проблема: Бэкенд не запускается

**Решение:**

1. Проверьте, что порт 3001 свободен
2. Убедитесь, что все зависимости установлены
3. Проверьте синтаксис в файле `.env`

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что Telegram бот работает корректно
4. Убедитесь, что приложение открыто из Telegram, а не напрямую в браузере
