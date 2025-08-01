# 🚀 Быстрое развертывание SuperMock на Coolify

## Шаги развертывания

### 1. Подготовка

```bash
# Убедитесь что код в Git репозитории
git add .
git commit -m "Add Docker and Coolify configuration"
git push
```

### 2. Настройка в Coolify

1. **Создайте новый проект** в Coolify
2. **Выберите "Docker Compose"**
3. **Подключите ваш Git репозиторий**
4. **Укажите файл**: `coolify-compose.yml`

### 3. Переменные окружения

Добавьте в Coolify следующие переменные:

```env
# База данных
POSTGRES_DB=supermock
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ваш_надежный_пароль
DATABASE_URL="postgresql://postgres:ваш_надежный_пароль@postgres:5432/supermock?schema=public"

# JWT
JWT_SECRET="ваш_супер_секретный_ключ"

# Telegram
TELEGRAM_TOKEN="ваш_токен_бота"
VITE_TELEGRAM_TOKEN="ваш_токен_бота"

# Приложение
NODE_ENV=production
FRONTEND_URL="https://ваш-домен.com"
```

### 4. Развертывание

1. Нажмите **"Deploy"**
2. Дождитесь завершения (5-10 минут)
3. Проверьте логи на ошибки

### 5. Проверка

- Frontend: `https://ваш-домен.com`
- Backend: `https://ваш-домен.com:3001/health`
- База данных: автоматически создается

## 🔧 Полезные команды

```bash
# Локальное тестирование
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## 📞 Поддержка

При проблемах проверьте:

1. Логи в Coolify
2. Переменные окружения
3. Подключение к базе данных
4. Telegram токен
