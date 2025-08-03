# Альтернативные домены для @BotFather

## Попробуйте эти варианты в @BotFather:

### 1. IP адрес

```
127.0.0.1
```

### 2. Локальные домены

```
localhost.local
dev.localhost
test.localhost
```

### 3. Специальные домены для разработки

```
localhost.localdomain
localhost.home.arpa
```

### 4. Если ничего не работает - используйте ngrok

#### Установка ngrok:

1. Зарегистрируйтесь на https://dashboard.ngrok.com/signup
2. Получите authtoken
3. Выполните: `./ngrok.exe authtoken YOUR_TOKEN`
4. Запустите: `./ngrok.exe http 5173`

## Порядок тестирования:

1. **Попробуйте `127.0.0.1`** - самый простой вариант
2. **Если не работает, попробуйте `localhost.local`**
3. **Если и это не работает, настройте ngrok**

## Проверка работы:

После настройки домена:

1. Запустите: `pnpm run dev:https`
2. Откройте: `https://localhost:5173`
3. Попробуйте авторизацию через Telegram
