# SuperMock - Платформа для подготовки к IT-собеседованиям

## 🚀 Быстрый старт

### Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev:full
```

### Настройка Telegram бота

Для работы авторизации через Telegram необходимо настроить бота:

1. **Создайте бота через @BotFather в Telegram**
2. **Настройте бота с помощью скрипта:**

```bash
# Установите токен бота
export TELEGRAM_TOKEN=your_bot_token_here

# Запустите скрипт настройки
./scripts/setup-telegram-bot.sh
```

3. **Добавьте переменные окружения в `.env`:**

```env
TELEGRAM_TOKEN=your_bot_token_here
BOT_USERNAME=SuperMock_bot
VITE_TELEGRAM_BOT_USERNAME=SuperMock_bot
```

4. **Протестируйте авторизацию:**
   - Откройте приложение в браузере
   - Нажмите "Регистрация"
   - Выберите метод авторизации (Telegram Bot, Login Widget или Web App)

📚 **Подробная документация:** [dock/telegram-setup.md](dock/telegram-setup.md)

## 🛠️ Разработка

### Структура проекта

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
└── scripts/                # Скрипты развертывания
```

### Команды разработки

```bash
# Запуск фронтенда
pnpm dev

# Запуск бэкенда
cd backend && npm run dev

# Запуск полного стека
pnpm dev:full

# Сборка для продакшена
pnpm build

# Развертывание
./scripts/deploy.sh
```

## 🔧 Технологии

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Авторизация:** Telegram Bot API, JWT
- **Развертывание:** Docker, Nginx

## 📝 Лицензия

MIT License
