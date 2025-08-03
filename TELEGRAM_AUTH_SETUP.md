# Настройка Telegram Авторизации

Этот документ описывает, как настроить авторизацию через Telegram для приложения SuperMock.

## 🚀 Быстрый старт

### 1. Создание Telegram бота

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Telegram Bot Configuration
TELEGRAM_TOKEN=your_bot_token_here
BOT_USERNAME=your_bot_username_here

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5174

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/supermock?schema=public"
```

### 3. Запуск приложения

#### Для разработки:

```bash
# Запуск бэкенда
cd backend
npm run dev

# В другом терминале - запуск бота
cd backend
npm run dev:bot

# Запуск фронтенда
cd ..
npm run dev
```

#### Для продакшена:

```bash
# Сборка
npm run build

# Запуск сервера
cd backend
npm run start

# Запуск бота
npm run start:bot
```

## 🔧 Конфигурация

### Переменные окружения

| Переменная       | Описание                   | Пример                                  |
| ---------------- | -------------------------- | --------------------------------------- |
| `TELEGRAM_TOKEN` | Токен вашего Telegram бота | `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `BOT_USERNAME`   | Username бота без @        | `SuperMock_bot`                         |
| `JWT_SECRET`     | Секретный ключ для JWT     | `your-secret-key-here`                  |
| `FRONTEND_URL`   | URL фронтенда              | `https://supermock.ru`                  |

### Настройка бота

1. **Команды бота:**

   - `/start` - Начать работу с ботом
   - `/help` - Показать справку
   - `/info` - Информация о пользователе

2. **Настройка команд через BotFather:**

   ```
   /setcommands

   start - Начать работу с ботом
   help - Показать справку
   info - Информация о пользователе
   ```

## 🔐 Методы авторизации

### 1. Telegram Web App (для Telegram)

- Работает только внутри Telegram
- Автоматическая авторизация
- Безопасная передача данных

### 2. Telegram Bot (для обычных браузеров)

- Работает в любом браузере
- Пользователь должен начать бота
- Бот отправляет подтверждение

### 3. Dev режим (для разработки)

- Тестовые данные
- Быстрая авторизация
- Только для разработки

## 📱 Использование

### Для пользователей:

1. **В Telegram Web App:**

   - Откройте приложение в Telegram
   - Авторизация происходит автоматически

2. **В обычном браузере:**
   - Перейдите на сайт приложения
   - Нажмите "Войти через Telegram"
   - Выберите "Через Telegram бота"
   - Нажмите "Start" в боте
   - Получите подтверждение

### Для разработчиков:

1. **Запуск в dev режиме:**

   ```bash
   npm run dev:full
   ```

2. **Тестовая авторизация:**
   - В dev режиме доступна кнопка "Тестовая авторизация"
   - Использует моковые данные

## 🔍 API Endpoints

### Авторизация через Web App

```
POST /api/auth/telegram
Body: { initData: string }
```

### Авторизация через бота

```
POST /api/telegram-bot/auth-url
Body: { userId: number, redirectUrl: string }

POST /api/telegram-bot/verify-user
Body: { userId: number }
```

### Проверка токена

```
POST /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
```

## 🛠️ Разработка

### Структура проекта

```
backend/
├── src/
│   ├── services/
│   │   ├── telegramBotService.ts    # Сервис для работы с ботом
│   │   └── authService.ts           # Сервис авторизации
│   ├── controllers/
│   │   ├── telegramBotController.ts # Контроллер бота
│   │   └── authController.ts        # Контроллер авторизации
│   ├── routes/
│   │   └── telegramBot.ts           # Маршруты бота
│   └── bot.ts                       # Скрипт запуска бота
```

### Компоненты фронтенда

```
src/components/
├── TelegramAuth.tsx          # Web App авторизация
├── TelegramBotAuth.tsx       # Bot авторизация
├── TelegramAuthButton.tsx    # Кнопка авторизации
└── TelegramLoginWidget.tsx   # Telegram Login Widget
```

## 🚨 Безопасность

1. **Валидация данных:**

   - Проверка подписи Telegram
   - Валидация времени запроса
   - Проверка токена бота

2. **JWT токены:**

   - Безопасное хранение
   - Автоматическое обновление
   - Проверка срока действия

3. **CORS настройки:**
   - Разрешенные домены
   - Безопасные заголовки
   - Rate limiting

## 🔧 Troubleshooting

### Проблемы с ботом

1. **Бот не отвечает:**

   - Проверьте токен в .env
   - Убедитесь, что бот запущен
   - Проверьте логи

2. **Ошибка авторизации:**

   - Проверьте настройки CORS
   - Убедитесь в правильности URL
   - Проверьте JWT_SECRET

3. **Web App не работает:**
   - Проверьте настройки бота в BotFather
   - Убедитесь в правильности домена
   - Проверьте SSL сертификат

### Логи

```bash
# Логи сервера
npm run dev

# Логи бота
npm run dev:bot
```

## 📚 Дополнительные ресурсы

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [Telegram Login Widget](https://core.telegram.org/widgets/login)
- [Node Telegram Bot API](https://github.com/yagop/node-telegram-bot-api)
