#!/bin/bash

# Скрипт для настройки Telegram бота для SuperMock
# Использование: ./scripts/setup-telegram-bot.sh

set -e

echo "🤖 Настройка Telegram бота для SuperMock"
echo "========================================"

# Проверяем наличие токена
if [ -z "$TELEGRAM_TOKEN" ]; then
    echo "❌ Ошибка: TELEGRAM_TOKEN не установлен"
    echo "Пожалуйста, установите переменную окружения TELEGRAM_TOKEN"
    echo "export TELEGRAM_TOKEN=your_bot_token_here"
    exit 1
fi

BOT_USERNAME=${BOT_USERNAME:-"SuperMock_bot"}
DOMAIN=${DOMAIN:-"supermock.ru"}

echo "📋 Параметры настройки:"
echo "  - Токен бота: ${TELEGRAM_TOKEN:0:10}..."
echo "  - Имя бота: @$BOT_USERNAME"
echo "  - Домен: $DOMAIN"
echo ""

# 1. Настройка команд бота
echo "🔧 Настройка команд бота..."
curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Начать работу с ботом"},
      {"command": "help", "description": "Показать справку"},
      {"command": "info", "description": "Информация о пользователе"}
    ]
  }'

echo ""
echo "✅ Команды бота настроены"

# 2. Настройка домена для Login Widget
echo "🌐 Настройка домена для Login Widget..."
curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setDomain" \
  -H "Content-Type: application/json" \
  -d "{
    \"domain\": \"$DOMAIN\"
  }"

echo ""
echo "✅ Домен настроен"

# 3. Получение информации о боте
echo "📊 Получение информации о боте..."
BOT_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getMe")
echo "Информация о боте: $BOT_INFO"

# 4. Настройка webhook (если указан URL)
if [ ! -z "$WEBHOOK_URL" ]; then
    echo "🔗 Настройка webhook..."
    curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setWebhook" \
      -H "Content-Type: application/json" \
      -d "{
        \"url\": \"$WEBHOOK_URL\",
        \"allowed_updates\": [\"message\", \"callback_query\"]
      }"
    
    echo ""
    echo "✅ Webhook настроен"
fi

# 5. Проверка настроек
echo "🔍 Проверка настроек..."
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo")
echo "Информация о webhook: $WEBHOOK_INFO"

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Проверьте бота в Telegram: @$BOT_USERNAME"
echo "2. Отправьте команду /start"
echo "3. Протестируйте Login Widget на сайте"
echo ""
echo "🔧 Для отладки используйте:"
echo "  - Логи бота: tail -f backend/logs/bot.log"
echo "  - Проверка API: curl https://api.telegram.org/bot$TELEGRAM_TOKEN/getMe"
echo ""
echo "📚 Документация: dock/telegram-setup.md"
