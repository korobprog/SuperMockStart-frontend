# Настройка HTTPS для разработки

## Обзор

Для работы с Telegram Login Widget требуется HTTPS, даже в режиме разработки. Данная инструкция поможет настроить HTTPS для локальной разработки.

## Автоматическая настройка

### 1. Сертификаты уже созданы

Самоподписанные сертификаты уже созданы в папке `ssl/`:
- `ssl/localhost.pem` - сертификат
- `ssl/localhost-key.pem` - приватный ключ

### 2. Конфигурация Vite

Vite настроен для работы с HTTPS в `vite.config.ts`:

```typescript
server: {
  host: '0.0.0.0',
  port: 5173,
  https: {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
  },
},
```

### 3. Конфигурация Backend

Backend также настроен для HTTPS в `backend/src/index.ts` и будет доступен на порту 3443.

## Запуск с HTTPS

### Вариант 1: Только Frontend с HTTPS

```bash
pnpm run dev:https
```

Приложение будет доступно по адресу: `https://localhost:5173`

### Вариант 2: Frontend + Backend с HTTPS

```bash
pnpm run dev:full:https
```

- Frontend: `https://localhost:5173`
- Backend: `https://localhost:3443`

## Настройка Telegram Bot

### 1. Настройка домена в @BotFather

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте команду `/setdomain`
4. Выберите вашего бота `SuperMock_bot`
5. Введите домен: `localhost`

### 2. Проверка работы

После настройки:
1. Откройте `https://localhost:5173`
2. Нажмите "Войти через Telegram"
3. Telegram Login Widget должен загрузиться без ошибок

## Устранение проблем

### 1. Ошибка "Bot domain invalid"

Убедитесь, что:
- Домен `localhost` настроен в @BotFather
- Используется HTTPS (`https://localhost:5173`)
- Сертификаты созданы корректно

### 2. Предупреждение о небезопасном соединении

Это нормально для самоподписанных сертификатов:
1. Нажмите "Дополнительно"
2. Нажмите "Перейти на localhost (небезопасно)"

### 3. Проблемы с сертификатами

Если сертификаты повреждены, пересоздайте их:

```bash
rm -rf ssl/
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/localhost-key.pem -out ssl/localhost.pem -days 365 -nodes -subj "//C=RU/ST=Moscow/L=Moscow/O=Development/CN=localhost"
```

## Переменные окружения

Для HTTPS разработки используются следующие настройки:

```env
# API URL для разработки с HTTPS
VITE_API_URL=https://localhost:3001

# Имя Telegram бота
VITE_TELEGRAM_NAME=SuperMock_bot
```

## Полезные команды

```bash
# Запуск только frontend с HTTPS
pnpm run dev:https

# Запуск frontend + backend с HTTPS
pnpm run dev:full:https

# Проверка сертификатов
openssl x509 -in ssl/localhost.pem -text -noout
```

## Безопасность

⚠️ **Важно:** Самоподписанные сертификаты используются только для разработки. В продакшене используйте настоящие SSL сертификаты от доверенных центров сертификации. 