#!/bin/bash

# Скрипт для настройки webhook в продакшене
# Использование: ./scripts/setup-production-webhook.sh

set -e

echo "🔗 Настройка webhook для продакшена"
echo "===================================="

# Проверяем наличие токена
if [ -z "$TELEGRAM_TOKEN" ]; then
    echo "❌ Ошибка: TELEGRAM_TOKEN не установлен"
    echo "Пожалуйста, установите переменную окружения TELEGRAM_TOKEN"
    echo "export TELEGRAM_TOKEN=your_bot_token_here"
    exit 1
fi

# Параметры для продакшена
BOT_USERNAME=${BOT_USERNAME:-"SuperMock_bot"}
WEBHOOK_URL="https://api.supermock.ru/api/telegram-bot/webhook"

echo "📋 Параметры настройки:"
echo "  - Токен бота: ${TELEGRAM_TOKEN:0:10}..."
echo "  - Имя бота: @$BOT_USERNAME"
echo "  - Webhook URL: $WEBHOOK_URL"
echo ""

# 1. Проверяем текущий webhook
echo "🔍 Проверка текущего webhook..."
CURRENT_WEBHOOK=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo")
echo "Текущий webhook: $CURRENT_WEBHOOK"

# 2. Очищаем старый webhook (если есть)
echo "🧹 Очистка старого webhook..."
curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/deleteWebhook" \
  -H "Content-Type: application/json" \
  -d '{"drop_pending_updates": true}'

echo "✅ Старый webhook очищен"

# 3. Настраиваем новый webhook
echo "🔗 Настройка нового webhook..."
WEBHOOK_RESPONSE=$(curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"$WEBHOOK_URL\",
    \"allowed_updates\": [\"message\", \"callback_query\"],
    \"drop_pending_updates\": true
  }")

echo "Ответ от Telegram API: $WEBHOOK_RESPONSE"

# 4. Проверяем новый webhook
echo "🔍 Проверка нового webhook..."
NEW_WEBHOOK=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo")
echo "Новый webhook: $NEW_WEBHOOK"

# 5. Тестируем webhook
echo "🧪 Тестирование webhook..."
TEST_RESPONSE=$(curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 10000,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "first_name": "Test",
        "username": "testuser"
      },
      "chat": {
        "id": 123456789,
        "type": "private"
      },
      "date": 1441645532,
      "text": "/start"
    }
  }')

echo "Тест webhook: $TEST_RESPONSE"

echo ""
echo "🎉 Настройка webhook завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Проверьте бота в Telegram: @$BOT_USERNAME"
echo "2. Отправьте команду /start"
echo "3. Протестируйте авторизацию на сайте"
echo ""
echo "🔧 Для отладки используйте:"
echo "  - Проверка webhook: curl https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo"
echo "  - Логи бота: docker logs <container_name>"
echo ""
echo "📚 Документация: https://core.telegram.org/bots/webhooks"
