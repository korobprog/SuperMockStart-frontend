# Настройка среды разработки

## Проблема

При разработке возникает конфликт портов между:

- **Docker контейнерами** (production/development)
- **Локальными процессами** Node.js

## Решение

### 1. Автоматическое решение

Запустите скрипт настройки:

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

### 2. Ручное решение

#### Шаг 1: Остановить Docker контейнеры

```bash
# Посмотреть запущенные контейнеры
docker ps

# Остановить все контейнеры
docker stop $(docker ps -q)

# Или остановить конкретный контейнер
docker stop <container_id>
```

#### Шаг 2: Освободить порты

```bash
# Проверить, какие процессы занимают порты
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Завершить процесс по PID
taskkill /PID <PID> /F
```

#### Шаг 3: Запустить локальную разработку

```bash
# Терминал 1: База данных
cd backend
npm run db:studio

# Терминал 2: Бэкенд
cd backend
npm run dev

# Терминал 3: Фронтенд
npm run dev
```

## Конфигурация

### Порт 3001 - Бэкенд

- **Docker**: `3002:3001` (внешний:внутренний)
- **Локально**: `3001`

### Порт 5432 - PostgreSQL

- **Docker**: `5432:5432`
- **Локально**: `5432`

### Порт 5173 - Фронтенд

- **Docker**: `5174:5173`
- **Локально**: `5173` (или следующий свободный)

## Проверка работоспособности

```bash
# Проверить бэкенд
curl http://localhost:3001/health

# Проверить фронтенд
curl http://localhost:5173

# Проверить базу данных
psql -h localhost -p 5432 -U postgres -d supermock
```

## Переменные окружения

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/supermock
JWT_SECRET=your-secret-key-change-in-production
TELEGRAM_TOKEN=your-telegram-token
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001
```

## Устранение неполадок

### Ошибка "EADDRINUSE"

```bash
# Найти процесс
netstat -ano | findstr :3001

# Завершить процесс
taskkill /PID <PID> /F
```

### Ошибка "Database connection failed"

```bash
# Проверить, запущена ли база данных
docker ps | grep postgres

# Или запустить локально
cd backend
npm run db:studio
```

### Ошибка "CORS blocked"

Проверьте настройки CORS в `backend/src/index.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // добавьте нужные порты
];
```
