# 🔧 Исправления ошибок сборки

## Проблемы, которые были исправлены:

### 1. **Отсутствие TypeScript типов в production сборке**

- **Проблема**: `npm ci --only=production` не устанавливал dev-зависимости с типами
- **Решение**: Изменили на `npm ci` в build этапе и `npm ci --omit=dev` в production

### 2. **Устаревший атрибут version в docker-compose.yml**

- **Проблема**: Docker Compose предупреждал об устаревшем атрибуте `version`
- **Решение**: Удалили строку `version: '3.8'`

### 3. **Неправильный импорт ms**

- **Проблема**: `import type { StringValue } from 'ms'` не работал
- **Решение**: Убрали импорт типа и изменили типизацию на `string | number`

### 4. **Отсутствующие типы**

- **Проблема**: Не хватало `@types/ms`
- **Решение**: Добавили в devDependencies

### 5. **Несоответствие версий в package-lock.json**

- **Проблема**: `package-lock.json` содержал `@types/ms@2.1.0`, а `package.json` требовал `@types/ms@0.7.31`
- **Решение**: Обновили lock-файл командой `npm install` в backend директории

### 6. **Права доступа к скрипту в Dockerfile** ⭐ НОВОЕ

- **Проблема**: `chmod +x ./scripts/setup-db.sh` выполнялся после переключения на пользователя `nodejs`
- **Решение**: Переместили копирование и изменение прав **до** переключения пользователя

## Измененные файлы:

### `backend/Dockerfile`

```dockerfile
# Было:
RUN npm ci --only=production

# Стало:
RUN npm ci
```

```dockerfile
# Было:
USER nodejs
# Копируем скрипт настройки базы данных
COPY scripts/setup-db.sh ./scripts/setup-db.sh
RUN chmod +x ./scripts/setup-db.sh

# Стало:
# Копируем скрипт настройки базы данных
COPY scripts/setup-db.sh ./scripts/setup-db.sh
RUN chmod +x ./scripts/setup-db.sh
# Переключаемся на пользователя nodejs
USER nodejs
```

### `docker-compose.yml`

```yaml
# Было:
version: '3.8'
# Стало:
# (удалено)
```

### `backend/package.json`

```json
// Добавлено:
"@types/ms": "^0.7.31"
```

### `backend/package-lock.json`

```json
// Обновлены версии @types/ms с 2.1.0 на 0.7.31
```

### `backend/src/index.ts`

```typescript
// Было:
import type { StringValue } from 'ms';

// Стало:
import ms from 'ms';
```

### `backend/src/utils/jwt.ts`

```typescript
// Было:
private static expiresIn: StringValue | number;
static initialize(secret: string, expiresIn: StringValue | number)

// Стало:
private static expiresIn: string | number;
static initialize(secret: string, expiresIn: string | number)
```

## ✅ Результат:

- Сборка TypeScript теперь работает корректно
- Все типы установлены правильно
- Docker Compose без предупреждений
- Production образ оптимизирован
- **Lock-файлы синхронизированы**
- **Права доступа к скриптам исправлены** ⭐

## 🚀 Команды для исправления:

```bash
# Обновить lock-файл
cd backend && npm install

# Закоммитить изменения
git add backend/package-lock.json
git commit -m "Fix package-lock.json version mismatch"
git push
```

**Теперь деплой должен пройти успешно!** 🎯
