#!/bin/bash

echo "🚀 Настройка Telegram для продакшена..."

# Проверяем наличие SSL сертификатов
if [ ! -f "ssl/localhost-key.pem" ] || [ ! -f "ssl/localhost.pem" ]; then
    echo "❌ SSL сертификаты не найдены в папке ssl/"
    echo "📝 Создайте SSL сертификаты для продакшена"
    echo "💡 Используйте команду: openssl req -x509 -newkey rsa:4096 -keyout ssl/localhost-key.pem -out ssl/localhost.pem -days 365 -nodes"
    exit 1
fi

# Применяем конфигурацию для продакшена
echo "📝 Применяем конфигурацию для продакшена..."
cp env.example .env

# Обновляем .env для продакшена
sed -i 's|VITE_API_URL=http://localhost:3001|VITE_API_URL=https://your-domain.com|g' .env
sed -i 's|VITE_API_URL_HTTPS=https://127.0.0.1:3002|VITE_API_URL_HTTPS=https://your-domain.com|g' .env
sed -i 's|VITE_TELEGRAM_DEV_URL=https://127.0.0.1:4042|VITE_TELEGRAM_DEV_URL=https://your-domain.com|g' .env
sed -i 's|VITE_USE_DEV_WIDGET=true|VITE_USE_DEV_WIDGET=false|g' .env

echo "✅ Конфигурация применена!"
echo ""
echo "🎯 Для продакшена необходимо:"
echo "   1. Заменить 'your-domain.com' на ваш реальный домен"
echo "   2. Обновить BOT_TOKEN в backend/server-https.js"
echo "   3. Настроить NODE_ENV=production"
echo ""
echo "📡 Сервисы будут доступны на:"
echo "   - Фронтенд: https://your-domain.com"
echo "   - Бэкенд: https://your-domain.com:3002"
echo ""
echo "🔐 Для работы с реальным Telegram:"
echo "   1. Создайте бота через @BotFather"
echo "   2. Получите токен бота"
echo "   3. Обновите BOT_TOKEN в backend/server-https.js"
echo "   4. Настройте Web App URL в боте"
echo ""
echo "⚠️  ВАЖНО: В продакшене будет включена проверка подписи Telegram!" 