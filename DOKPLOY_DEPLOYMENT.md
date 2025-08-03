# 🚀 Деплой SuperMock с Dokploy

## Предварительные требования

1. **Сервер с установленным Dokploy**

   - Ubuntu/Debian/CentOS
   - Минимум 2GB RAM, 20GB storage
   - Dokploy установлен и запущен

2. **Доменные имена** (настроенные DNS записи):

   - `supermock.ru` → IP сервера
   - `api.supermock.ru` → IP сервера

3. **Telegram Bot Token**
   - Создайте бота через [@BotFather](https://t.me/botfather)
   - Сохраните токен и username

## 📋 Пошаговая инструкция

### 1. Подготовка переменных окружения

В Dokploy создайте **Shared Variables** (на уровне проекта):

```bash
# Telegram настройки
TELEGRAM_TOKEN=your_bot_token_here
BOT_USERNAME=your_bot_username

# JWT настройки
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# URL настройки
FRONTEND_URL=https://supermock.ru
BACKEND_URL=https://api.supermock.ru/api
```

### 2. Создание проекта в Dokploy

1. Войдите в панель Dokploy
2. Создайте новый проект `SuperMock`
3. Добавьте описание: `Система авторизации и собеседований`

### 3. Настройка Docker Compose

1. В проекте создайте **Docker Compose** сервис
2. Название: `supermock-app`
3. Подключите Git репозиторий
4. Выберите ветку для деплоя (например, `main`)

### 4. Environment Variables

В **Environment Variables** добавьте ссылки на Shared Variables:

```bash
TELEGRAM_TOKEN=${{project.TELEGRAM_TOKEN}}
BOT_USERNAME=${{project.BOT_USERNAME}}
JWT_SECRET=${{project.JWT_SECRET}}
FRONTEND_URL=${{project.FRONTEND_URL}}
BACKEND_URL=${{project.BACKEND_URL}}
```

### 5. Настройка доменов

#### Для Frontend:

- **Domain**: `supermock.ru`
- **Service Name**: `frontend`
- **Port**: `80`

#### Для Backend:

- **Domain**: `api.supermock.ru`
- **Service Name**: `backend`
- **Port**: `3001`
- **Path Prefix**: `/api`

### 6. Volumes Configuration

Настройте volumes для постоянного хранения:

```yaml
# В Advanced -> Volumes
../files/postgres-data:/var/lib/postgresql/data
../files/backend-logs:/app/logs
```

### 7. Health Checks

Dokploy автоматически использует health checks из docker-compose.yml:

- **Frontend**: Проверка доступности на порту 80
- **Backend**: GET `/api/health` каждые 30 секунд
- **Database**: `pg_isready` проверка PostgreSQL

## 🔧 Настройка автоматического деплоя

### GitHub Webhook

1. В настройках сервиса откройте **Deployments**
2. Скопируйте **Webhook URL**
3. В GitHub репозитории:
   - Settings → Webhooks → Add webhook
   - Paste URL
   - Trigger: Push events
   - Branch: выбранная ветка

### GitLab/Bitbucket

Аналогично настройте webhook в соответствующем Git провайдере.

## 🗄️ База данных

### Автоматическая настройка

Docker Compose создаст PostgreSQL с:

- User: `postgres`
- Password: `password`
- Database: `supermock`

### Миграции

После первого деплоя выполните:

```bash
# В контейнере backend
npm run db:generate
npm run db:push
```

### Создание администратора

```bash
# В контейнере backend
npm run create-admin
```

Будет создан администратор:

- Email: `korobprog@gmail.com`
- Password: `Krishna1284Radha`

⚠️ **Смените пароль после первого входа!**

## 🔒 SSL сертификаты

Dokploy автоматически получит SSL сертификаты через Let's Encrypt для:

- `https://supermock.ru`
- `https://api.supermock.ru`

## 📊 Мониторинг

### Health Check endpoints

- **Frontend**: `https://supermock.ru/`
- **Backend**: `https://api.supermock.ru/api/health`
- **API Info**: `https://api.supermock.ru/api`

### Логи

Просматривайте логи в реальном времени через Dokploy:

- Project → Service → Logs
- Real-time streaming доступен

## 🚨 Troubleshooting

### Проблемы с базой данных

1. Проверьте статус PostgreSQL контейнера
2. Убедитесь в корректности DATABASE_URL
3. Проверьте логи database сервиса

### Проблемы с Telegram

1. Проверьте правильность TELEGRAM_TOKEN
2. Убедитесь, что бот активен
3. Проверьте логи backend для ошибок валидации

### SSL проблемы

1. Убедитесь, что домены указывают на сервер
2. Проверьте статус сертификатов в Traefik
3. Дождитесь полного прохождения DNS propagation

### Zero Downtime Deployment

Health checks обеспечивают zero downtime:

- Новые контейнеры запускаются параллельно
- Трафик переключается только после прохождения health checks
- Старые контейнеры удаляются после переключения

## 🔄 Обновления

### Автоматические

Push в настроенную ветку автоматически запустит деплой.

### Ручные

В Dokploy панели: Service → Deploy → Manual Deploy

## 📈 Scaling

Для увеличения производительности:

1. **Resources**: увеличьте CPU/Memory лимиты
2. **Replicas**: увеличьте количество backend контейнеров
3. **Database**: рассмотрите внешнюю PostgreSQL

## 🔐 Безопасность

### Production настройки

1. **Смените JWT_SECRET** на криптографически стойкий ключ
2. **Обновите пароль администратора**
3. **Настройте CORS** для production доменов
4. **Включите rate limiting** (уже настроен)

### Backup

Регулярно делайте backup:

- PostgreSQL данных из `/files/postgres-data`
- Логов из `/files/backend-logs`

## 📞 Поддержка

При проблемах:

1. Проверьте логи всех сервисов
2. Убедитесь в правильности переменных окружения
3. Проверьте health checks endpoints
4. Консультируйтесь с документацией Dokploy

---

## ✅ Checklist финального деплоя

- [ ] Dokploy сервер настроен и доступен
- [ ] DNS записи для доменов настроены
- [ ] Telegram bot создан и токен получен
- [ ] Shared Variables настроены в Dokploy
- [ ] Docker Compose сервис создан и сконфигурирован
- [ ] Домены добавлены и SSL сертификаты получены
- [ ] Health checks работают корректно
- [ ] База данных инициализирована
- [ ] Администратор создан и пароль изменен
- [ ] Автоматический деплой настроен
- [ ] Backup стратегия реализована

🎉 **Поздравляем! SuperMock успешно развернут!**
