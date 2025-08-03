#!/bin/bash

echo "🔄 Переключение режимов Telegram авторизации..."

case "$1" in
  "dev")
    echo "📝 Включаем dev виджет (без CSP проблем)..."
    sed -i 's|VITE_USE_DEV_WIDGET=false|VITE_USE_DEV_WIDGET=true|g' .env
    echo "✅ Dev виджет включен"
    echo "🎯 Теперь используйте: pnpm run dev:full:telegram"
    ;;
  "real")
    echo "📝 Включаем реальный Telegram Login Widget..."
    sed -i 's|VITE_USE_DEV_WIDGET=true|VITE_USE_DEV_WIDGET=false|g' .env
    echo "✅ Реальный виджет включен"
    echo "⚠️  Могут появиться CSP ошибки в разработке"
    echo "🎯 Теперь используйте: pnpm run dev:full:telegram"
    ;;
  "status")
    echo "📊 Текущий статус:"
    if grep -q "VITE_USE_DEV_WIDGET=true" .env; then
      echo "🔧 Режим: DEV виджет (без CSP проблем)"
    else
      echo "🌐 Режим: Реальный Telegram Login Widget"
    fi
    echo ""
    echo "📡 Сервисы:"
    echo "   - Фронтенд: https://127.0.0.1:4042"
    echo "   - Бэкенд: https://127.0.0.1:3002"
    ;;
  *)
    echo "❌ Неизвестная команда: $1"
    echo ""
    echo "📖 Использование:"
    echo "   ./scripts/telegram-switch.sh dev    - включить dev виджет"
    echo "   ./scripts/telegram-switch.sh real   - включить реальный виджет"
    echo "   ./scripts/telegram-switch.sh status - показать текущий статус"
    ;;
esac 