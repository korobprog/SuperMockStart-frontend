# Настройка домена и HTTPS в Coolify

## Предварительные требования

1. **Домен**: У вас должен быть зарегистрирован домен `supermock.ru`
2. **DNS настройки**: Настройте A записи для вашего домена
3. **Coolify**: Установленный и настроенный Coolify на вашем сервере

## Шаг 1: Настройка DNS

Добавьте следующие DNS записи в панели управления вашего домена:

```
A    supermock.ru        → [IP_АДРЕС_ВАШЕГО_СЕРВЕРА]
A    www.supermock.ru    → [IP_АДРЕС_ВАШЕГО_СЕРВЕРА]
```

## Шаг 2: Подготовка переменных окружения

1. Скопируйте `env.example` в `.env`:

```bash
cp env.example .env
```

2. Отредактируйте `.env` файл:

```env
# Database Configuration
POSTGRES_DB=supermock
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Telegram Bot Configuration
TELEGRAM_TOKEN="your-telegram-bot-token"
VITE_TELEGRAM_TOKEN="your-telegram-bot-token"

# Domain Configuration
DOMAIN=supermock.ru
FRONTEND_URL=https://supermock.ru
SSL_EMAIL=your-email@example.com

# Application Configuration
NODE_ENV=production
```

## Шаг 3: Развертывание в Coolify

### Вариант A: Через веб-интерфейс Coolify

1. **Создание нового приложения**:

   - Войдите в панель управления Coolify
   - Нажмите "New Application"
   - Выберите "Docker Compose"
   - Загрузите файл `coolify.yaml`

2. **Настройка переменных окружения**:

   - В разделе "Environment Variables" добавьте все переменные из `.env` файла
   - Убедитесь, что `SSL_EMAIL` содержит ваш реальный email

3. **Настройка домена**:

   - В разделе "Domains" добавьте:
     - `supermock.ru`
     - `www.supermock.ru`
   - Включите опцию "Force HTTPS"
   - Включите опцию "Redirect www to non-www" (или наоборот)

4. **Настройка SSL**:
   - В разделе "SSL" выберите "Let's Encrypt"
   - Введите ваш email в поле "SSL Email"
   - Нажмите "Save"

### Вариант B: Через Git репозиторий

1. **Подготовка репозитория**:

   ```bash
   git add .
   git commit -m "Add Coolify configuration"
   git push origin main
   ```

2. **Создание приложения в Coolify**:

   - Выберите "Git Repository"
   - Укажите URL вашего репозитория
   - Выберите ветку `main`
   - Укажите путь к файлу: `coolify.yaml`

3. **Настройка переменных и домена** (как в Варианте A)

## Шаг 4: Проверка развертывания

1. **Проверка DNS**:

   ```bash
   nslookup supermock.ru
   nslookup www.supermock.ru
   ```

2. **Проверка SSL**:

   - Откройте https://supermock.ru
   - Убедитесь, что сертификат действителен
   - Проверьте редирект с HTTP на HTTPS

3. **Проверка приложения**:
   - Проверьте работу фронтенда
   - Проверьте работу API через `/api/health`

## Шаг 5: Мониторинг

В Coolify панели вы можете:

- Отслеживать логи приложения
- Мониторить использование ресурсов
- Настраивать автоматические обновления
- Управлять SSL сертификатами

## Устранение неполадок

### Проблема: SSL сертификат не выдается

**Решение**:

- Убедитесь, что DNS записи правильно настроены
- Проверьте, что порты 80 и 443 открыты
- Убедитесь, что email в `SSL_EMAIL` корректен

### Проблема: Приложение не доступно

**Решение**:

- Проверьте логи в Coolify
- Убедитесь, что все переменные окружения настроены
- Проверьте, что база данных запущена

### Проблема: API не работает

**Решение**:

- Проверьте настройки nginx
- Убедитесь, что backend сервис запущен
- Проверьте переменную `FRONTEND_URL`

## Дополнительные настройки

### Настройка CDN

Для улучшения производительности можно настроить CDN:

- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### Настройка мониторинга

Рекомендуется настроить:

- Uptime monitoring
- Error tracking (Sentry)
- Performance monitoring

### Резервное копирование

Настройте автоматическое резервное копирование:

- База данных
- Файлы приложения
- Конфигурации
