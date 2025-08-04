# SuperMock - Платформа для проведения собеседований

Интерактивная платформа для проведения технических собеседований с интеграцией Telegram бота.

## 🚀 Быстрый старт

### Автоматическая настройка

```bash
# Настройка среды разработки
bash scripts/dev-setup.sh

# Запуск всех сервисов
bash scripts/start-dev.sh
```

### Ручная настройка

1. **Остановите Docker контейнеры** (если запущены):

```bash
docker stop $(docker ps -q)
```

2. **Запустите базу данных**:

```bash
cd backend
npm run db:studio
```

3. **Запустите бэкенд**:

```bash
cd backend
npm run dev
```

4. **Запустите фронтенд**:

```bash
npm run dev
```

## 🔧 Решение проблем

### Проблема: "EADDRINUSE: address already in use :::3001"

**Причина**: Конфликт между Docker контейнерами и локальными процессами.

**Решение**:

```bash
# Автоматическое решение
bash scripts/dev-setup.sh

# Ручное решение
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Проблема: "Database connection failed"

**Причина**: PostgreSQL не запущен.

**Решение**:

```bash
# Запустить PostgreSQL
cd backend
npm run db:studio
```

## 📁 Структура проекта

```
├── src/                    # Фронтенд (React + TypeScript)
│   ├── components/         # React компоненты
│   ├── pages/             # Страницы приложения
│   └── store/             # Redux store
├── backend/               # Бэкенд (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Контроллеры API
│   │   ├── services/      # Бизнес-логика
│   │   └── routes/        # Маршруты API
│   └── prisma/           # Схема базы данных
├── scripts/              # Скрипты для разработки
└── docker-compose.yml    # Docker конфигурация
```

## 🌐 Доступные URL

- **Фронтенд**: http://localhost:5173
- **Бэкенд**: http://localhost:3001
- **База данных**: localhost:5432

## 🔑 Переменные окружения

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001
```

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/supermock
JWT_SECRET=your-secret-key-change-in-production
TELEGRAM_TOKEN=your-telegram-token
```

## 📚 Документация

- [DEV_SETUP.md](./DEV_SETUP.md) - Подробная настройка среды разработки
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Инструкции по развертыванию
- [FORM_IMPLEMENTATION_SUMMARY.md](./FORM_IMPLEMENTATION_SUMMARY.md) - Документация по формам

## 🛠️ Команды разработки

```bash
# Установка зависимостей
npm install
cd backend && npm install

# Запуск в режиме разработки
npm run dev                    # Фронтенд
cd backend && npm run dev      # Бэкенд

# База данных
cd backend && npm run db:studio    # Prisma Studio
cd backend && npm run db:migrate   # Миграции
cd backend && npm run db:push      # Push схемы

# Сборка
npm run build                 # Фронтенд
cd backend && npm run build   # Бэкенд
```

## 🐳 Docker

### Разработка

```bash
docker-compose -f docker-compose.dev.yml up
```

### Продакшен

```bash
docker-compose up -d
```

## 📝 Основные функции

- ✅ Telegram авторизация
- ✅ Форма сбора контактов
- ✅ Выбор профессии и опыта
- ✅ Календарь собеседований
- ✅ Система очередей
- ✅ Уведомления
- ✅ Обратная связь

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License
