# Развертывание SuperMock на Coolify

## Подготовка к развертыванию

### 1. Подготовка репозитория

Убедитесь, что ваш код находится в Git репозитории (GitHub, GitLab, etc.).

### 2. Настройка переменных окружения

Скопируйте `coolify.env.example` в `.env` и заполните все переменные:

```bash
cp coolify.env.example .env
```

**Обязательные переменные:**

- `POSTGRES_PASSWORD` - надежный пароль для базы данных
- `JWT_SECRET` - секретный ключ для JWT токенов
- `TELEGRAM_TOKEN` - токен вашего Telegram бота
- `FRONTEND_URL` - URL вашего домена (например, https://supermock.ru)

### 3. Настройка в Coolify

#### Шаг 1: Создание нового проекта

1. Войдите в панель управления Coolify
2. Создайте новый проект
3. Выберите "Docker Compose" как тип развертывания

#### Шаг 2: Подключение репозитория

1. Подключите ваш Git репозиторий
2. Укажите ветку (обычно `main` или `master`)

#### Шаг 3: Настройка Docker Compose

1. В поле "Docker Compose File" укажите: `coolify-compose.yml`
2. В поле "Environment Variables" добавьте все переменные из `.env` файла

#### Шаг 4: Настройка домена

1. Добавьте ваш домен в настройки проекта
2. Настройте SSL сертификат (Coolify может автоматически получить Let's Encrypt)

### 4. Переменные окружения для Coolify

Добавьте следующие переменные в Coolify:

```env
# Database
POSTGRES_DB=supermock
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL="postgresql://postgres:your_secure_password_here@postgres:5432/supermock?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Telegram
TELEGRAM_TOKEN="your-telegram-bot-token"
VITE_TELEGRAM_TOKEN="your-telegram-bot-token"

# App
NODE_ENV=production
FRONTEND_URL="https://your-domain.com"
```

### 5. Развертывание

1. Нажмите "Deploy" в Coolify
2. Дождитесь завершения сборки и развертывания
3. Проверьте логи на наличие ошибок

### 6. Проверка работоспособности

После развертывания проверьте:

1. **Frontend**: `https://your-domain.com`
2. **Backend API**: `https://your-domain.com:3001`
3. **Health check**: `https://your-domain.com:3001/health`

### 7. Мониторинг и логи

В Coolify вы можете:

- Просматривать логи каждого сервиса
- Мониторить использование ресурсов
- Настраивать автоматические перезапуски
- Настраивать масштабирование

### 8. Обновления

Для обновления приложения:

1. Запушьте изменения в Git репозиторий
2. В Coolify нажмите "Redeploy"
3. Или настройте автоматическое развертывание при push в определенную ветку

### 9. Резервное копирование

Coolify автоматически создает резервные копии:

- База данных PostgreSQL
- Файлы приложения
- Конфигурации

### 10. Troubleshooting

**Проблема**: Приложение не запускается
**Решение**: Проверьте логи в Coolify, убедитесь что все переменные окружения заполнены

**Проблема**: База данных не подключается
**Решение**: Проверьте `DATABASE_URL` и убедитесь что PostgreSQL контейнер запущен

**Проблема**: Telegram бот не работает
**Решение**: Проверьте `TELEGRAM_TOKEN` и убедитесь что бот активен

### 11. Безопасность

- Используйте надежные пароли для базы данных
- Регулярно обновляйте JWT_SECRET
- Настройте firewall на сервере
- Используйте HTTPS для всех соединений
- Регулярно обновляйте зависимости

### 12. Производительность

- Настройте кэширование в nginx
- Оптимизируйте запросы к базе данных
- Настройте мониторинг производительности
- Рассмотрите использование CDN для статических файлов
