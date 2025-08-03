#!/bin/bash

# Скрипт для переключения между dev и prod конфигурациями

case "$1" in
  "dev")
    echo "Переключаемся на dev конфигурацию..."
    cp env.example .env
    echo "✅ Dev конфигурация применена"
    echo "📝 VITE_API_URL=http://localhost:3001"
    echo "📝 VITE_TELEGRAM_NAME=your_bot_username"
    ;;
  "prod")
    echo "Переключаемся на prod конфигурацию..."
    cp env.prod .env
    echo "✅ Prod конфигурация применена"
    echo "📝 VITE_API_URL=https://supermock.ru"
    echo "📝 VITE_TELEGRAM_NAME=supermockstart_bot"
    ;;
  *)
    echo "Использование: $0 {dev|prod}"
    echo ""
    echo "Команды:"
    echo "  dev   - Применить dev конфигурацию (localhost)"
    echo "  prod  - Применить prod конфигурацию (supermock.ru)"
    echo ""
    echo "Примеры:"
    echo "  $0 dev   # Переключиться на dev"
    echo "  $0 prod  # Переключиться на prod"
    ;;
esac 