# 🚀 Руководство по миграции базы данных

## Обзор изменений

После улучшений бекенда и авторизации добавлены следующие возможности:

### ✨ Новые функции

- **Классическая авторизация** (email/password) в дополнение к Telegram
- **Система ролей** (ADMIN, USER) для управления доступом
- **Расширенные поля пользователей** (isActive, lastLoginAt)
- **Форма сбора данных пользователей** (profession, country, experience)

### 🗄️ Изменения в базе данных

#### Новый enum `UserRole`

```sql
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
```

#### Новые поля в таблице `users`

- `email` TEXT (уникальное, для классической авторизации)
- `password` TEXT (хэшированный пароль)
- `role` UserRole (роль пользователя, по умолчанию USER)
- `isActive` BOOLEAN (активен ли пользователь, по умолчанию true)
- `lastLoginAt` TIMESTAMP (время последнего входа)

#### Новая таблица `user_form_data`

```sql
CREATE TABLE "user_form_data" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Автоматическая миграция

### Быстрый способ

```bash
./migrate-database.sh
```

Этот скрипт:

1. Подключается к серверу через SSH
2. Получает последние изменения из Git
3. Устанавливает зависимости
4. Выполняет миграцию базы данных
5. Создает администратора
6. Перезапускает сервисы

## 🔧 Ручная миграция

### Шаг 1: Подключение к серверу

```bash
ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238
```

### Шаг 2: Обновление кода

```bash
cd /root/supermock
git pull origin master
```

### Шаг 3: Установка зависимостей

```bash
cd backend
npm install
```

### Шаг 4: Генерация Prisma клиента

```bash
npx prisma generate
```

### Шаг 5: Выполнение миграции

```bash
npx prisma migrate deploy
```

### Шаг 6: Создание администратора

```bash
npm run create-admin
```

### Шаг 7: Перезапуск сервисов

```bash
cd ..
pm2 restart supermock-backend
```

## ✅ Проверка успешной миграции

### Проверка статуса сервисов

```bash
pm2 status
```

### Проверка здоровья API

```bash
curl https://api.supermock.ru/api/health
```

### Проверка новых endpoints авторизации

```bash
# Регистрация нового пользователя
curl -X POST https://api.supermock.ru/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Авторизация
curl -X POST https://api.supermock.ru/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Проверка структуры базы данных

```bash
cd backend
npx prisma db pull --print
```

## 🔄 Rollback (в случае проблем)

Если что-то пошло не так, можно откатить изменения:

```bash
# Остановить сервисы
pm2 stop supermock-backend

# Восстановить предыдущую версию из Git
git checkout HEAD~1

# Восстановить базу данных из бэкапа
# (если был создан бэкап перед миграцией)
```

## 📊 Тестирование новых возможностей

### 1. Классическая авторизация

- Регистрация через email/password
- Вход через email/password
- Проверка JWT токенов с новыми полями

### 2. Система ролей

- Создание администратора
- Проверка middleware requireAdmin
- Проверка разграничения доступа

### 3. Формы пользователей

- Сохранение данных формы
- Получение истории профессий
- Связь данных с пользователем

## 🚨 Важные моменты

⚠️ **Бэкап**: Всегда создавайте бэкап базы данных перед миграцией

⚠️ **Тестирование**: После миграции проверьте все критические функции

⚠️ **Мониторинг**: Следите за логами в течение первых часов после деплоя

⚠️ **Безопасность**: Смените пароль администратора после создания

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `pm2 logs supermock-backend`
2. Проверьте статус: `pm2 status`
3. Проверьте здоровье API: `curl https://api.supermock.ru/api/health`
4. Обратитесь к логам миграции Prisma

---

**Удачной миграции! 🚀**
