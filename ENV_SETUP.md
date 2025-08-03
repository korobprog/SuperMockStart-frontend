# Настройка переменных окружения

## Обзор

Система поддерживает **два режима конфигурации**:

- **DEV режим** - для локальной разработки
- **PROD режим** - для продакшена

## Файлы конфигурации

### 1. `env.example` - Dev конфигурация

```env
# Development конфигурация
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_NAME=your_bot_username
```

### 2. `env.prod` - Prod конфигурация

```env
# Продакшен конфигурация
VITE_API_URL=https://supermock.ru
VITE_TELEGRAM_NAME=supermockstart_bot
```

## Команды для переключения

### NPM скрипты

```bash
# Переключиться на dev конфигурацию
npm run env:dev

# Переключиться на prod конфигурацию
npm run env:prod

# Показать текущую конфигурацию
npm run env:status
```

### Bash скрипт

```bash
# Сделать скрипт исполняемым
chmod +x scripts/env-switch.sh

# Переключиться на dev
./scripts/env-switch.sh dev

# Переключиться на prod
./scripts/env-switch.sh prod
```

## Сборка и запуск

### Dev режим

```bash
# Применить dev конфигурацию
npm run env:dev

# Запустить разработку
npm run dev:full
```

### Prod режим

```bash
# Сборка с prod конфигурацией
npm run build:prod

# Предварительный просмотр с prod конфигурацией
npm run preview:prod
```

## Автоматическое переключение

### При сборке

- `npm run build:prod` - автоматически копирует `env.prod` в `.env`
- После сборки возвращает `env.example` в `.env`

### При preview

- `npm run preview:prod` - автоматически копирует `env.prod` в `.env`
- После preview возвращает `env.example` в `.env`

## Структура файлов

```
├── env.example          # Dev конфигурация (localhost)
├── env.prod            # Prod конфигурация (supermock.ru)
├── .env                # Текущая конфигурация (генерируется)
├── scripts/
│   └── env-switch.sh   # Скрипт переключения
└── package.json        # NPM скрипты
```

## Переменные окружения

### VITE_API_URL

- **Dev:** `http://localhost:3001`
- **Prod:** `https://supermock.ru`

### VITE_TELEGRAM_NAME

- **Dev:** `your_bot_username` (placeholder)
- **Prod:** `supermockstart_bot` (реальный бот)

## Рабочий процесс

### 1. Разработка

```bash
# Переключиться на dev
npm run env:dev

# Запустить разработку
npm run dev:full

# Проверить конфигурацию
npm run env:status
```

### 2. Тестирование prod

```bash
# Собрать с prod конфигурацией
npm run build:prod

# Запустить preview с prod конфигурацией
npm run preview:prod
```

### 3. Деплой

```bash
# Собрать для продакшена
npm run build:prod

# Файлы готовы для деплоя в dist/
```

## Проверка конфигурации

### В браузере

```javascript
// Проверить текущие переменные
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_TELEGRAM_NAME);
```

### В терминале

```bash
# Показать текущую конфигурацию
npm run env:status

# Или напрямую
cat .env | grep VITE_
```

## Безопасность

### .gitignore

Убедитесь, что `.env` добавлен в `.gitignore`:

```
.env
```

### Резервные копии

- `env.example` - шаблон для dev
- `env.prod` - шаблон для prod
- `.env` - текущая конфигурация (не коммитится)

## Возможные проблемы

### 1. "Файл .env не найден"

```bash
# Создать .env из шаблона
npm run env:dev
```

### 2. "Неправильная конфигурация"

```bash
# Проверить текущую конфигурацию
npm run env:status

# Переключиться на нужную
npm run env:dev   # или npm run env:prod
```

### 3. "Сборка не работает"

```bash
# Очистить и пересобрать
rm -rf dist/
npm run build:prod
```

## Интеграция с CI/CD

### GitHub Actions

```yaml
- name: Build for production
  run: |
    npm run build:prod
    # dist/ готов для деплоя
```

### Docker

```dockerfile
# Копировать prod конфигурацию
COPY env.prod .env
RUN npm run build
```

## Заключение

Эта система позволяет:

- ✅ **Легко переключаться** между dev и prod конфигурациями
- ✅ **Автоматически применять** правильные настройки при сборке
- ✅ **Безопасно хранить** конфигурации (не коммитить .env)
- ✅ **Удобно отлаживать** проблемы с конфигурацией
- ✅ **Интегрироваться** с CI/CD системами
