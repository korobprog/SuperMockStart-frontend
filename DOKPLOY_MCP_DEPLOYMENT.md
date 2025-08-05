# 🚀 Развертывание SuperMock в Dokploy с использованием MCP Servers

Данная инструкция описывает правильную настройку развертывания проекта SuperMock на платформе Dokploy с использованием MCP (Model Context Protocol) servers для автоматизации процесса.

## 📋 Предварительные требования

- **Сервер Dokploy**: Установленный и настроенный сервер Dokploy
- **Docker**: Докер-окружение на сервере
- **MCP Dokploy**: Настроенный MCP сервер для работы с Dokploy
- **Git репозиторий**: Доступ к репозиторию проекта

## 🏗️ Архитектура проекта

SuperMock состоит из трёх основных компонентов:

### Frontend (React + TypeScript)

- **Порт**: 80 (внутри контейнера)
- **Build**: Multi-stage Docker build с Nginx
- **Домен**: supermock.ru

### Backend (Node.js + Express + Prisma)

- **Порт**: 3001
- **База данных**: PostgreSQL 16
- **Health Check**: `/api/health`
- **Домен**: api.supermock.ru

### Database (PostgreSQL)

- **Порт**: 5432
- **Версия**: PostgreSQL 16 Alpine
- **Хранилище**: Persistent volumes

## 🔧 Настройка развертывания в Dokploy

### 1. Создание проекта

Используйте MCP для создания нового проекта:

```bash
# Создание проекта в Dokploy
dokploy project create --name "SuperMock" --description "Платформа для проведения технических собеседований"
```

### 2. Конфигурация Docker Compose

Проект использует `docker-compose.yml` со следующими сервисами:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    expose: [80]
    networks: [dokploy-network]
    labels:
      - traefik.enable=true
      - traefik.http.routers.frontend.rule=Host(`supermock.ru`)

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    expose: [3001]
    networks: [dokploy-network]
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3001/api/health']

  database:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=supermock
```

### 3. Переменные окружения

Создайте файл переменных окружения на основе `env.dokploy`:

```bash
# Telegram Bot Configuration
TELEGRAM_TOKEN=your_telegram_bot_token_here
BOT_USERNAME=SuperMock_bot

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here_make_it_long_and_random

# Database Configuration
DATABASE_URL=postgresql://postgres:password@database:5432/supermock

# Server Configuration
NODE_ENV=production
PORT=3001

# Frontend URL
FRONTEND_URL=https://supermock.ru
BACKEND_URL=https://api.supermock.ru

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Развертывание через MCP

Используйте Dokploy MCP сервер для автоматизации развертывания:

```javascript
// Создание Docker Compose приложения
await dokployMCP.compose.create({
  name: 'supermock-full-stack',
  projectId: PROJECT_ID,
  sourceType: 'git',
  repository: 'https://github.com/your-repo/SuperMockStart',
  branch: 'main',
  dockerComposeFile: 'docker-compose.yml',
});

// Настройка переменных окружения
await dokployMCP.compose.saveEnvironment({
  composeId: COMPOSE_ID,
  env: envVariables,
});

// Развертывание
await dokployMCP.compose.deploy({
  composeId: COMPOSE_ID,
});
```

## 🗄️ Обновление базы данных

### Схема базы данных

Проект использует Prisma ORM со следующими основными таблицами:

- **users**: Пользователи системы
- **interviews**: Интервью
- **interview_queue**: Очередь собеседований
- **interview_sessions**: Сессии собеседований
- **notifications**: Уведомления
- **feedback**: Обратная связь
- **selected_professions**: Выбранные профессии
- **user_form_data**: Данные форм пользователей

### Миграции базы данных

Проект включает несколько скриптов для работы с базой данных:

1. **init-db.sh**: Инициализация базы данных
2. **setup-db.sh**: Настройка схемы
3. **fix-db.sh**: Исправление проблем
4. **reset-db.sh**: Полный сброс
5. **check-db.sh**: Проверка состояния

### Автоматическое обновление базы данных

Используйте скрипт `deploy-db-update.sh` для обновления базы данных на сервере:

```bash
#!/bin/bash
# Обновление базы данных через MCP
SERVER_IP="217.198.6.238"
PROJECT_PATH="/root/supermock"

# Подключение к серверу через MCP
dokploy server connect --ip $SERVER_IP

# Обновление кода
dokploy compose update --id COMPOSE_ID --sourceType git

# Миграции базы данных
dokploy compose exec --id COMPOSE_ID --service backend -- npx prisma migrate deploy
dokploy compose exec --id COMPOSE_ID --service backend -- npx prisma generate

# Перезапуск сервисов
dokploy compose redeploy --id COMPOSE_ID
```

## 🔄 Автоматическое развертывание

### GitHub Actions + Dokploy Webhook

1. **Настройка webhook в Dokploy**:

   - Включите Auto Deploy в настройках приложения
   - Скопируйте Webhook URL

2. **Конфигурация GitHub Actions**:

```yaml
name: Deploy to Dokploy
on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Dokploy Deployment
        run: |
          curl -X 'POST' \
            '${{ secrets.DOKPLOY_WEBHOOK_URL }}' \
            -H 'accept: application/json' \
            -H 'Content-Type: application/json'
```

## 🏥 Health Checks и мониторинг

### Backend Health Check

Эндпоинт `/api/health` возвращает:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "services": {
    "prisma": "ok",
    "telegram": "ok"
  }
}
```

### Traefik Health Check

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3001/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 🛠️ Управление через MCP

### Основные команды

```javascript
// Проверка статуса
await dokployMCP.compose.one({ composeId: COMPOSE_ID });

// Остановка
await dokployMCP.compose.stop({ composeId: COMPOSE_ID });

// Запуск
await dokployMCP.compose.deploy({ composeId: COMPOSE_ID });

// Просмотр логов
await dokployMCP.compose.logs({ composeId: COMPOSE_ID, service: 'backend' });

// Обновление переменных окружения
await dokployMCP.compose.saveEnvironment({
  composeId: COMPOSE_ID,
  env: newEnvVariables,
});
```

### Работа с базой данных

```javascript
// Создание PostgreSQL
await dokployMCP.postgres.create({
  name: 'supermock-db',
  projectId: PROJECT_ID,
  databaseName: 'supermock',
  databaseUser: 'postgres',
  databasePassword: 'secure_password',
  dockerImage: 'postgres:16',
});

// Развертывание базы данных
await dokployMCP.postgres.deploy({
  postgresId: POSTGRES_ID,
});
```

## 🚨 Troubleshooting

### Проблемы с подключением к базе данных

1. Проверьте health check базы данных:

```bash
dokploy compose exec --service database -- pg_isready -U postgres -d supermock
```

2. Проверьте логи инициализации:

```bash
dokploy compose logs --service db-init
```

### Проблемы с Prisma

1. Перегенерация клиента:

```bash
dokploy compose exec --service backend -- npx prisma generate
```

2. Принудительное обновление схемы:

```bash
dokploy compose exec --service backend -- npx prisma db push --accept-data-loss
```

### Проблемы с Telegram Bot

1. Проверьте переменные окружения:

```bash
dokploy compose env --check TELEGRAM_TOKEN BOT_USERNAME
```

2. Проверьте подключение к Telegram API:

```bash
dokploy compose exec --service backend -- curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getMe"
```

## 📊 Мониторинг и логи

### Dokploy Dashboard

- CPU, Memory, Disk usage
- Network monitoring
- Real-time logs
- Deployment history

### Логи приложения

- **Backend logs**: `/app/logs`
- **Database logs**: PostgreSQL logs
- **Nginx logs**: Access и error logs

## 🔐 Безопасность

### SSL/TLS сертификаты

Dokploy автоматически управляет SSL сертификатами через Let's Encrypt для доменов:

- `supermock.ru` (frontend)
- `api.supermock.ru` (backend)

### Переменные окружения

Все секретные данные хранятся в зашифрованном виде в Dokploy:

- JWT_SECRET
- TELEGRAM_TOKEN
- DATABASE_URL

## 📈 Масштабирование

### Горизонтальное масштабирование

```javascript
// Настройка реплик для backend
await dokployMCP.compose.update({
  composeId: COMPOSE_ID,
  services: {
    backend: {
      replicas: 3,
      deploy: {
        update_config: {
          parallelism: 1,
          order: 'start-first',
        },
      },
    },
  },
});
```

### Вертикальное масштабирование

```javascript
// Увеличение ресурсов
await dokployMCP.compose.update({
  composeId: COMPOSE_ID,
  services: {
    backend: {
      deploy: {
        resources: {
          limits: {
            cpus: '2.0',
            memory: '2G',
          },
          reservations: {
            cpus: '1.0',
            memory: '1G',
          },
        },
      },
    },
  },
});
```

## 📝 Заключение

Использование Dokploy MCP значительно упрощает процесс развертывания и управления приложением SuperMock. Автоматизация через MCP позволяет:

- Быстро развертывать обновления
- Легко управлять переменными окружения
- Отслеживать состояние сервисов
- Автоматически обновлять базу данных
- Обеспечивать zero-downtime deployments

Данная конфигурация обеспечивает надежную работу платформы для проведения технических собеседований в production-среде.
