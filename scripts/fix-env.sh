#!/bin/bash

# Скрипт для исправления переменных окружения в контейнере
echo "🔧 Исправляем переменные окружения в контейнере..."

# Создаем .env файл в контейнере
ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238 << 'EOF'
docker exec code-frontend-1 sh -c 'cat > .env << "ENV_EOF"
VITE_API_URL=https://api.supermock.ru
VITE_TELEGRAM_NAME=SuperMock_bot
ENV_EOF'

# Перезапускаем контейнер для применения изменений
docker restart code-frontend-1

echo "✅ Переменные окружения обновлены и контейнер перезапущен"
echo "🌐 Проверяем доступность API..."
sleep 5

# Проверяем, что API работает
curl -s https://api.supermock.ru/api/auth/test-token | jq .
EOF

echo "🎉 Исправление завершено!" 