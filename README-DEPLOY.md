# 🚀 Деплой SuperMock на Dokploy

## Быстрый старт

### 1. Установите Dokploy на сервер

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

### 2. Настройте переменные окружения

```bash
cp env.dokploy .env
# Отредактируйте .env файл с вашими значениями
```

### 3. Деплой через Docker Compose

1. Откройте dokploy в браузере (http://your-server:3000)
2. Создайте новый **Docker Compose** проект
3. Укажите репозиторий и ветку
4. Загрузите `docker-compose.yml`
5. Настройте переменные окружения
6. Нажмите "Deploy"

### 4. Настройте домены

- **Фронтенд**: `your-domain.com` → порт 80
- **API**: `api.your-domain.com` → порт 3001

## Структура проекта для деплоя

```
├── Dockerfile                 # Фронтенд
├── backend/Dockerfile         # Бэкенд
├── docker-compose.yml        # Оркестрация
├── env.dokploy              # Переменные окружения
├── DEPLOY.md                # Подробные инструкции
└── .github/workflows/       # GitHub Actions
```

## Переменные окружения

**Обязательные:**

- `TELEGRAM_TOKEN` - токен бота
- `JWT_SECRET` - секрет для JWT
- `BOT_USERNAME` - имя бота

**Опциональные:**

- `FRONTEND_URL` - URL фронтенда
- `RATE_LIMIT_*` - настройки rate limiting

## Автоматический деплой

Настройте GitHub Secrets:

- `DOKPLOY_URL` - URL вашего dokploy
- `DOKPLOY_TOKEN` - API токен
- `DOKPLOY_APPLICATION_ID` - ID приложения

## Подробные инструкции

См. файл [DEPLOY.md](./DEPLOY.md) для полного руководства.
