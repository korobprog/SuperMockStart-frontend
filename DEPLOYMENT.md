# 🚀 Deployment Guide

## Автоматический деплой

При пуше в ветку `main` или `master` автоматически запускается деплой через GitHub Actions.

### Что происходит при деплое:

1. **Сборка frontend** - `npm run build`
2. **Сборка backend** - `npm run build` в папке backend
3. **Деплой в Dokploy** - автоматическое обновление на сервере
4. **Health check** - проверка работоспособности API
5. **Уведомления** - статус деплоя

## Ручной деплой

### Полный деплой (с пересборкой)

```bash
./scripts/deploy.sh
```

### Быстрый деплой (только изменения)

```bash
./scripts/quick-deploy.sh
```

## Мониторинг деплоя

### GitHub Actions

- [Actions](https://github.com/korobprog/SuperMockStart-frontend/actions)

### Проверка работоспособности

```bash
# Frontend
curl -I https://supermock.ru

# Backend API
curl https://api.supermock.ru/health
```

## Структура деплоя

### Сервер

- **IP**: 217.198.6.238
- **Traefik**: Reverse proxy на портах 80/443
- **Frontend**: https://supermock.ru
- **Backend**: https://api.supermock.ru

### Контейнеры

- `code-frontend-1` - React приложение
- `code-backend-1` - Node.js API
- `code-database-1` - PostgreSQL
- `dokploy-traefik` - Reverse proxy

## Переменные окружения

### Frontend

- `VITE_API_URL` - URL API (https://api.supermock.ru)

### Backend

- `NODE_ENV` - production
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `TELEGRAM_TOKEN` - Telegram bot token
- `BOT_USERNAME` - Telegram bot username

## Troubleshooting

### Если деплой не работает:

1. Проверьте GitHub Actions: https://github.com/korobprog/SuperMockStart-frontend/actions
2. Проверьте логи на сервере: `docker logs code-backend-1`
3. Проверьте health check: `curl https://api.supermock.ru/health`

### Если нужно перезапустить контейнеры:

```bash
ssh dokploy-server "cd /etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code && docker-compose restart"
```

### Если нужно пересобрать образы:

```bash
ssh dokploy-server "cd /etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code && docker-compose down && docker-compose up -d --build"
```
