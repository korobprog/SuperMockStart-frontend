# 🚀 Развертывание в Coolify

## Настройка приложения в Coolify

### 1. Создание нового приложения

1. Войдите в Coolify Dashboard
2. Создайте новое приложение
3. Выберите "Docker Compose" как тип развертывания
4. Загрузите файл `coolify.yaml`

### 2. Настройка переменных окружения

Добавьте следующие переменные в настройках приложения:

```env
# Telegram Bot
TELEGRAM_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_TOKEN=your_telegram_bot_token

# JWT
JWT_SECRET=your_jwt_secret_key

# Database
POSTGRES_DB=supermock
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_secure_password@supermock-postgres:5432/supermock?schema=public

# Domain
DOMAIN=your-domain.com

# SSL (если используете Let's Encrypt)
SSL_EMAIL=your-email@domain.com

# Frontend URL
FRONTEND_URL=http://your-domain.com
```

### 3. Настройка портов

- **Frontend**: 3000 (внешний) → 80 (внутренний)
- **Backend**: 3001 (внешний) → 3001 (внутренний)
- **Database**: 5432 (внешний) → 5432 (внутренний)

### 4. Настройка домена и SSL

1. Добавьте ваш домен в настройках приложения
2. Включите SSL (Let's Encrypt)
3. Укажите email для SSL сертификатов

### 5. Развертывание

1. Нажмите "Deploy" в Coolify Dashboard
2. Дождитесь завершения сборки и развертывания
3. Проверьте логи на наличие ошибок

## Альтернативные конфигурации

### Использование coolify-compose.yml

Если у вас проблемы с портом 80, используйте `coolify-compose.yml` вместо `coolify.yaml`.

### Использование Traefik

Для более продвинутой настройки используйте `docker-compose.yml` с Traefik.

## Устранение неполадок

### Порт 80 занят

- Используйте `coolify-compose.yml` (порт 3000)
- Или остановите процесс, занимающий порт 80

### Проблемы с базой данных

- Проверьте переменные окружения DATABASE_URL
- Убедитесь, что PostgreSQL запущен

### Проблемы с Telegram Bot

- Проверьте токен бота
- Убедитесь, что бот активен

## Мониторинг

- Проверяйте логи в Coolify Dashboard
- Используйте health checks: `/health` для backend
- Мониторьте использование ресурсов
