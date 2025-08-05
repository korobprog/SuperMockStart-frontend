# Система аутентификации

## Обзор

Новая система аутентификации централизованно управляет токенами и состоянием пользователя через Redux store. Токены сохраняются в localStorage и автоматически восстанавливаются при перезагрузке приложения.

## Основные компоненты

### 1. AuthSlice (`src/store/slices/authSlice.ts`)

Центральный slice для управления аутентификацией:

- Хранит токен, пользователя и состояние загрузки
- Автоматически сохраняет/загружает данные из localStorage
- Предоставляет actions для входа, выхода и проверки токена

### 2. Утилиты (`src/utils/auth.ts`)

Централизованные функции для работы с токенами:

- `getStoredToken()` - получение токена из localStorage
- `setStoredToken(token)` - сохранение токена
- `removeStoredToken()` - удаление токена
- `getAuthHeaders()` - получение заголовков для API запросов

### 3. Хук useAuth (`src/hooks/useAuth.ts`)

Удобный хук для работы с аутентификацией:

```typescript
const { user, token, isAuthenticated, login, logout, checkAuth } = useAuth();
```

### 4. AuthProvider (`src/components/AuthProvider.tsx`)

Компонент для инициализации аутентификации при загрузке приложения.

## Использование

### В компонентах

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Требуется авторизация</div>;
  }

  return <div>Добро пожаловать, {user.first_name}!</div>;
};
```

### В API запросах

```typescript
import { getAuthHeaders } from '../utils/auth';

const response = await fetch('/api/some-endpoint', {
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
});
```

## Преимущества новой системы

1. **Централизованное хранение** - токен хранится в одном месте
2. **Автоматическое восстановление** - токен восстанавливается при перезагрузке
3. **Единый интерфейс** - все компоненты используют один хук
4. **Совместимость** - поддерживает старые ключи localStorage
5. **Типобезопасность** - полная типизация TypeScript

## Миграция

Старые компоненты автоматически работают с новой системой благодаря:

- Совместимости ключей localStorage (`authToken` и `telegram_token`)
- Автоматической инициализации в AuthProvider
- Обратной совместимости API

## Отладка

Для отладки аутентификации используйте:

```typescript
// В консоли браузера
console.log('Токен:', localStorage.getItem('authToken'));
console.log('Пользователь:', localStorage.getItem('user'));
```

## Безопасность

- Токены автоматически очищаются при неудачной верификации
- Поддержка проверки срока действия токенов
- Безопасное хранение в localStorage
