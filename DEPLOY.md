# 🚀 Деплой SuperMock на Coolify

## 📋 Подготовка к деплою

### 1. Настройка домена

- Убедитесь, что домен `supermock.ru` указывает на ваш VPS
- Настройте DNS записи:
  ```
  A     supermock.ru     → IP вашего VPS
  A     www.supermock.ru → IP вашего VPS
  ```

### 2. Переменные окружения для Coolify

Создайте следующие переменные окружения в Coolify:

#### Frontend Environment Variables:

```
VITE_API_URL=https://supermock.ru
VITE_TELEGRAM_TOKEN=your_telegram_bot_token_here
```

#### Backend Environment Variables:

```
NODE_ENV=production
PORT=3001
TELEGRAM_TOKEN=your_telegram_bot_token_here
BOT_USERNAME=SuperMock_bot
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://supermock.ru
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Настройка SSL в Coolify

1. В Coolify перейдите в настройки проекта
2. Включите SSL/TLS
3. Выберите "Let's Encrypt" для автоматических сертификатов
4. Добавьте домены:
   - `supermock.ru`
   - `www.supermock.ru`

### 4. Деплой через Coolify

#### Вариант 1: Docker Compose

1. Загрузите файлы в Git репозиторий
2. В Coolify создайте новый проект
3. Выберите "Docker Compose"
4. Укажите путь к `docker-compose.yml`
5. Настройте переменные окружения
6. Запустите деплой

#### Вариант 2: Отдельные сервисы

1. Создайте два сервиса в Coolify:
   - **Frontend**: используйте `Dockerfile.frontend`
   - **Backend**: используйте `Dockerfile.backend`

### 5. Настройка Telegram бота

После успешного деплоя:

1. Откройте чат с @BotFather
2. Отправьте `/mybots`
3. Выберите `SuperMock_bot`
4. Перейдите в `Bot Settings` → `Mini App`
5. Нажмите `Enable Mini App`
6. Введите URL: `https://supermock.ru`

### 6. Проверка работоспособности

После деплоя проверьте:

```bash
# Проверка фронтенда
curl https://supermock.ru

# Проверка бэкенда
curl https://supermock.ru/health

# Проверка API
curl https://supermock.ru/api/auth/status
```

### 7. Мониторинг

В Coolify настройте:

- Health checks для обоих сервисов
- Логирование
- Мониторинг ресурсов
- Автоматические бэкапы

### 8. Безопасность

- Регулярно обновляйте JWT_SECRET
- Мониторьте логи на подозрительную активность
- Настройте rate limiting
- Используйте HTTPS везде

## 🔧 Troubleshooting

### Проблема: SSL сертификат не работает

**Решение**: Проверьте DNS записи и настройки SSL в Coolify

### Проблема: API не отвечает

**Решение**: Проверьте переменные окружения и логи бэкенда

### Проблема: Telegram бот не принимает URL

**Решение**: Убедитесь, что сайт доступен по HTTPS и отвечает на запросы

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в Coolify
2. Убедитесь в правильности переменных окружения
3. Проверьте доступность домена
4. Обратитесь к документации Coolify
