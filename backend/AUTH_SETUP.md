# Настройка системы авторизации SuperMock

## Обзор

Система авторизации SuperMock поддерживает два способа входа:
1. **Классическая авторизация** - через email и пароль
2. **Telegram авторизация** - через Telegram Web App и Login Widget

## Архитектура

### Модели данных
- **User** - основная модель пользователя с поддержкой обоих типов авторизации
- **UserRole** - роли пользователей (ADMIN, USER)
- **UserStatus** - статусы пользователей (INTERVIEWER, CANDIDATE)

### Ключевые компоненты
- `AuthService` - основная логика авторизации
- `UserService` - управление пользователями в БД
- `JwtUtils` - работа с JWT токенами
- `PasswordUtils` - хэширование и проверка паролей
- `ValidationUtils` - валидация входных данных

## Установка и настройка

### 1. Обновление схемы базы данных

```bash
# Генерируем миграцию
npx prisma migrate dev --name add-auth-system

# Применяем изменения к БД
npx prisma db push

# Генерируем Prisma Client
npx prisma generate
```

### 2. Создание администратора

```bash
# Создать администратора по умолчанию
npm run create-admin

# Интерактивное создание администратора
npm run create-admin interactive

# Проверить существующих администраторов
npm run create-admin check
```

**Данные администратора по умолчанию:**
- Email: `korobprog@gmail.com`
- Пароль: `Krishna1284Radha`
- Роль: ADMIN

⚠️ **ВАЖНО:** Смените пароль администратора после первого входа!

### 3. Переменные окружения

Убедитесь, что в `.env` файле настроены следующие переменные:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Telegram Bot Configuration
TELEGRAM_TOKEN=your-telegram-bot-token
BOT_USERNAME=your-bot-username

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database"
```

## API Endpoints

### Классическая авторизация

#### Регистрация
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

#### Вход
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Изменение пароля
```http
POST /api/auth/change-password
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### Telegram авторизация

#### Telegram Web App
```http
POST /api/auth/telegram
Content-Type: application/json

{
  "initData": "telegram-web-app-init-data"
}
```

#### Telegram Login Widget
```http
POST /api/auth/telegram-widget
Content-Type: application/json

{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "auth_date": 1640995200,
  "hash": "telegram-hash"
}
```

### Общие endpoints

#### Получение профиля
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

#### Проверка статуса
```http
GET /api/auth/status
Authorization: Bearer <jwt-token>
```

#### Привязка Telegram аккаунта
```http
POST /api/auth/link-telegram
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "telegramId": "123456789",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Middleware

### Аутентификация
- `authenticateToken` - проверка стандартного JWT токена (для обратной совместимости)
- `authenticateExtendedToken` - проверка расширенного JWT токена с ролями
- `optionalAuth` - опциональная проверка токена
- `optionalExtendedAuth` - опциональная проверка расширенного токена

### Авторизация
- `requireAdmin` - требует роль администратора
- `requireRole(role)` - требует определенную роль

### Пример использования

```typescript
import { authenticateExtendedToken, requireAdmin } from '../middleware/auth.js';

// Требует аутентификации
router.get('/protected', authenticateExtendedToken, controller);

// Требует роль администратора
router.get('/admin', authenticateExtendedToken, requireAdmin, adminController);

// Требует определенную роль
router.get('/user', authenticateExtendedToken, requireRole(UserRole.USER), userController);
```

## Валидация

### Пароли
- Минимум 8 символов
- Обязательные заглавные буквы
- Обязательные строчные буквы
- Обязательные цифры
- Специальные символы (опционально)

### Email
- Стандартная проверка формата email
- Максимум 254 символа

### Имена
- Минимум 2 символа
- Максимум 50 символов
- Только буквы, пробелы и дефисы

## Безопасность

### Хэширование паролей
- Используется bcrypt с salt rounds = 12
- Пароли никогда не возвращаются в API ответах

### JWT токены
- Двухуровневая система токенов:
  - Стандартные токены (для обратной совместимости)
  - Расширенные токены (с ролями и типом авторизации)
- Конфигурируемое время жизни токенов

### Валидация Telegram данных
- Проверка подписи через Telegram Bot API
- Проверка времени жизни данных (5 минут для Widget)
- Защита от атак повторного воспроизведения

## Миграция с существующей системы

### Для существующих Telegram пользователей

При первом входе через обновленную систему:
1. Пользователь автоматически создается в новой схеме
2. Данные из Telegram сохраняются в БД
3. Выдается расширенный JWT токен

### Обновление существующих токенов

Старые токены продолжают работать для обратной совместимости, но рекомендуется обновить клиентскую часть для использования новых endpoints.

## Логирование

Система логирует следующие события:
- Попытки регистрации и входа
- Ошибки валидации
- Ошибки аутентификации
- Действия администраторов

## Troubleshooting

### Проблемы с миграцией
```bash
# Сброс миграций (ОСТОРОЖНО: потеря данных!)
npx prisma migrate reset

# Применение миграций заново
npx prisma migrate deploy
```

### Проблемы с JWT токенами
- Проверьте правильность JWT_SECRET
- Убедитесь, что время на сервере синхронизировано
- Проверьте время жизни токенов

### Проблемы с Telegram авторизацией
- Проверьте TELEGRAM_TOKEN
- Убедитесь, что бот активен
- Проверьте валидность Telegram данных

## Рекомендации по развертыванию

1. **Используйте HTTPS** для всех авторизационных endpoints
2. **Настройте CORS** правильно для вашего фронтенда
3. **Установите rate limiting** для endpoints авторизации
4. **Настройте мониторинг** попыток входа
5. **Регулярно ротируйте** JWT_SECRET
6. **Используйте сильные пароли** для администраторов

## Архитектурные улучшения

### Возможные улучшения без усложнения:

1. **Refresh токены** - для более безопасного обновления сессий
2. **Email верификация** - подтверждение email при регистрации
3. **Восстановление пароля** - сброс пароля через email
4. **2FA** - двухфакторная аутентификация через Telegram
5. **Аудит логи** - детальное логирование действий пользователей
6. **Session management** - управление активными сессиями
7. **Блокировка аккаунтов** - временная блокировка при подозрительной активности

### Масштабирование:

1. **Redis для сессий** - хранение сессий в Redis
2. **OAuth2 провайдеры** - интеграция с Google, GitHub и др.
3. **Микросервисная архитектура** - выделение auth в отдельный сервис
4. **Rate limiting по IP** - защита от брутфорса
5. **Геолокационная проверка** - уведомления о входе из новых локаций