#!/bin/bash

# Скрипт для переключения между Telegram ботами (dev/prod)

case "$1" in
  "dev")
    echo "🤖 Переключаемся на DEV бота (SuperMockTest_bot)..."
    
    # Обновляем frontend переменные
    export VITE_TELEGRAM_BOT_USERNAME=SuperMockTest_bot
    export VITE_TELEGRAM_TOKEN_DEV=8213869730:AAHIR0oUPS-sfyMvwzStYapJYc7YH4lMlS4
    
    # Обновляем backend переменные
    export TELEGRAM_TOKEN=8213869730:AAHIR0oUPS-sfyMvwzStYapJYc7YH4lMlS4
    export BOT_USERNAME=SuperMockTest_bot
    
    echo "✅ DEV конфигурация применена"
    echo "📝 Бот: SuperMockTest_bot"
    echo "📝 Токен: 8213869730:AAHIR0oUPS-sfyMvwzStYapJYc7YH4lMlS4"
    echo "📝 Окружение: development"
    ;;
    
  "prod")
    echo "🤖 Переключаемся на PROD бота (SuperMock_bot)..."
    
    # Обновляем frontend переменные
    export VITE_TELEGRAM_BOT_USERNAME=SuperMock_bot
    export VITE_TELEGRAM_TOKEN_PROD=8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o
    
    # Обновляем backend переменные
    export TELEGRAM_TOKEN=8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o
    export BOT_USERNAME=SuperMock_bot
    
    echo "✅ PROD конфигурация применена"
    echo "📝 Бот: SuperMock_bot"
    echo "📝 Токен: 8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o"
    echo "📝 Окружение: production"
    ;;
    
  "status")
    echo "📊 Статус текущей конфигурации:"
    echo "🤖 Frontend бот: ${VITE_TELEGRAM_BOT_USERNAME:-'не установлен'}"
    echo "🔑 Backend токен: ${TELEGRAM_TOKEN:-'не установлен'}"
    echo "🌍 NODE_ENV: ${NODE_ENV:-'не установлен'}"
    echo "🔗 API URL: ${VITE_API_URL:-'не установлен'}"
    ;;
    
  *)
    echo "Использование: $0 {dev|prod|status}"
    echo ""
    echo "Команды:"
    echo "  dev    - Переключиться на DEV бота (SuperMockTest_bot)"
    echo "  prod   - Переключиться на PROD бота (SuperMock_bot)"
    echo "  status - Показать текущую конфигурацию"
    echo ""
    echo "Примеры:"
    echo "  $0 dev   # Переключиться на dev бота"
    echo "  $0 prod  # Переключиться на prod бота"
    echo "  $0 status # Показать статус"
    echo ""
    echo "ℹ️  После переключения перезапустите приложение"
    ;;
esac 