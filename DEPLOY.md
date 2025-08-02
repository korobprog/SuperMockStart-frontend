# Деплой SuperMock на Dokploy

## Подготовка к деплою

### 1. Установка Dokploy

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

### 2. Настройка переменных окружения

1. Скопируйте файл `env.dokploy` в `.env`:

```bash
cp env.dokploy .env
```

2. Отредактируйте `.env` файл:
   - Замените `your_telegram_bot_token_here` на ваш токен Telegram бота
   - Замените `your_very_secure_jwt_secret_key_here_make_it_long_and_random` на безопасный JWT секрет
   - Замените `your-domain.com` на ваш домен
   - Замените `your_server_ip_here` на IP вашего сервера

### 3. Настройка доменов

В dokploy настройте следующие домены:

#### Фронтенд

- **Host**: `your-domain.com`
- **Path**: `/`
- **Container Port**: `80`
- **HTTPS**: Включено
- **Certificate**: letsencrypt

#### API (Бэкенд)

- **Host**: `api.your-domain.com`
- **Path**: `/`
- **Container Port**: `3001`
- **HTTPS**: Включено
- **Certificate**: letsencrypt

### 4. Деплой через Dokploy

#### Вариант 1: Docker Compose (Рекомендуется)

1. В dokploy создайте новый **Docker Compose** проект
2. Укажите репозиторий: `https://github.com/your-username/supermock.git`
3. Укажите ветку: `main`
4. Загрузите файл `docker-compose.yml`
5. Настройте переменные окружения в интерфейсе dokploy
6. Нажмите "Deploy"

#### Вариант 2: Отдельные приложения

##### Фронтенд

1. Создайте новое **Application**
2. Укажите репозиторий и ветку
3. Выберите **Build Type**: `Dockerfile`
4. **Dockerfile Path**: `Dockerfile`
5. **Port**: `80`
6. Настройте домен

##### Бэкенд

1. Создайте новое **Application**
2. Укажите репозиторий и ветку
3. Выберите **Build Type**: `Dockerfile`
4. **Dockerfile Path**: `backend/Dockerfile`
5. **Port**: `3001`
6. Настройте домен
7. Добавьте переменные окружения

### 5. Настройка базы данных

После первого деплоя выполните миграции:

```bash
# Подключитесь к контейнеру бэкенда
docker exec -it <backend-container-name> sh

# Выполните миграции
npx prisma migrate deploy
```

### 6. Настройка автоматических деплоев

#### GitHub

1. В dokploy скопируйте Webhook URL
2. В GitHub репозитории перейдите в Settings → Webhooks
3. Добавьте новый webhook с URL из dokploy
4. Выберите "Push events"

#### GitLab

1. В dokploy скопируйте Webhook URL
2. В GitLab репозитории перейдите в Settings → Webhooks
3. Добавьте новый webhook с URL из dokploy
4. Выберите "Push events"

### 7. Мониторинг и логи

- **Логи приложений**: Доступны в интерфейсе dokploy
- **Логи базы данных**: В папке `files/postgres-data`
- **Логи бэкенда**: В папке `files/backend-logs`

### 8. Обновление приложения

При каждом push в основную ветку dokploy автоматически пересоберет и перезапустит приложение.

### 9. Откат к предыдущей версии

В интерфейсе dokploy можно откатиться к предыдущей версии приложения.

## Структура файлов для деплоя

```
├── Dockerfile                 # Dockerfile для фронтенда
├── backend/
│   └── Dockerfile            # Dockerfile для бэкенда
├── docker-compose.yml        # Оркестрация сервисов
├── env.dokploy              # Шаблон переменных окружения
├── nginx.conf               # Конфигурация nginx
└── DEPLOY.md               # Эти инструкции
```

## Переменные окружения

### Обязательные

- `TELEGRAM_TOKEN` - токен Telegram бота
- `JWT_SECRET` - секретный ключ для JWT
- `BOT_USERNAME` - имя пользователя бота

### Опциональные

- `FRONTEND_URL` - URL фронтенда для CORS
- `RATE_LIMIT_WINDOW_MS` - окно для rate limiting
- `RATE_LIMIT_MAX_REQUESTS` - максимальное количество запросов

## Безопасность

- Все пароли и секреты хранятся в переменных окружения
- HTTPS включен по умолчанию с Let's Encrypt
- Rate limiting настроен для защиты от DDoS
- Helmet.js защищает заголовки HTTP
- CORS настроен только для разрешенных доменов
