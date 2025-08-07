#!/bin/bash

# Скрипт для обновления бота в продакшене
# Использование: ./scripts/update-bot-production.sh

set -e

echo "🔄 Обновление бота в продакшене"
echo "================================"

# Проверяем наличие токена
if [ -z "$TELEGRAM_TOKEN" ]; then
    echo "❌ Ошибка: TELEGRAM_TOKEN не установлен"
    echo "Пожалуйста, установите переменную окружения TELEGRAM_TOKEN"
    echo "export TELEGRAM_TOKEN=your_bot_token_here"
    exit 1
fi

echo "📋 Параметры:"
echo "  - Токен бота: ${TELEGRAM_TOKEN:0:10}..."
echo "  - Имя бота: @SuperMock_bot"
echo ""

# 1. Останавливаем webhook (если есть)
echo "🧹 Очистка webhook..."
curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/deleteWebhook" \
  -H "Content-Type: application/json" \
  -d '{"drop_pending_updates": true}'

echo "✅ Webhook очищен"

# 2. Проверяем статус бота
echo "🔍 Проверка статуса бота..."
BOT_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getMe")
echo "Информация о боте: $BOT_INFO"

# 3. Проверяем webhook info
echo "🔍 Проверка webhook info..."
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo")
echo "Информация о webhook: $WEBHOOK_INFO"

echo ""
echo "🎉 Обновление завершено!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Перезапустите контейнеры на сервере"
echo "2. Проверьте бота в Telegram: @SuperMock_bot"
echo "3. Отправьте команду /start"
echo "4. Протестируйте авторизацию на сайте"
echo ""
echo "🔧 Для перезапуска контейнеров:"
echo "  docker-compose -f docker-compose.yml down"
echo "  docker-compose -f docker-compose.yml up -d"
echo ""
echo "📚 Документация: https://core.telegram.org/bots/webhooks"
