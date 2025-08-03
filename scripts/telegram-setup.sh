#!/bin/bash

echo "🚀 Настройка Telegram разработки..."

# Проверяем наличие SSL сертификатов
if [ ! -f "ssl/localhost-key.pem" ] || [ ! -f "ssl/localhost.pem" ]; then
    echo "❌ SSL сертификаты не найдены в папке ssl/"
    echo "📝 Создайте SSL сертификаты для localhost"
    echo "💡 Используйте команду: openssl req -x509 -newkey rsa:4096 -keyout ssl/localhost-key.pem -out ssl/localhost.pem -days 365 -nodes"
    exit 1
fi

# Применяем конфигурацию для Telegram
echo "📝 Применяем конфигурацию для Telegram..."
cp env.example .env

# Обновляем .env для Telegram разработки
sed -i 's|VITE_API_URL=http://localhost:3001|VITE_API_URL=https://127.0.0.1:3002|g' .env
sed -i 's|VITE_USE_DEV_WIDGET=false|VITE_USE_DEV_WIDGET=false|g' .env

echo "✅ Конфигурация применена!"
echo ""
echo "🎯 Для запуска с реальным Telegram Login Widget:"
echo "   pnpm run dev:full:telegram"
echo ""
echo "🧪 Для запуска с dev виджетом (без CSP проблем):"
echo "   sed -i 's|VITE_USE_DEV_WIDGET=false|VITE_USE_DEV_WIDGET=true|g' .env"
echo "   pnpm run dev:full:telegram"
echo ""
echo "📡 Сервисы будут доступны на:"
echo "   - Фронтенд: https://127.0.0.1:4042"
echo "   - Бэкенд: https://127.0.0.1:3002"
echo ""
echo "🔐 Для работы с реальным Telegram:"
echo "   1. Создайте бота через @BotFather"
echo "   2. Получите токен бота"
echo "   3. Обновите BOT_TOKEN в backend/server-https.js"
echo "   4. Настройте Web App URL в боте" 