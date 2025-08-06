#!/bin/bash

echo "🔧 Полная пересборка приложения..."

# Останавливаем все контейнеры
docker-compose down

# Удаляем все образы проекта
docker rmi $(docker images -q code-frontend) 2>/dev/null || true
docker rmi $(docker images -q code-backend) 2>/dev/null || true
docker rmi $(docker images -q code-db-init) 2>/dev/null || true

# Очищаем кеш Docker
docker builder prune -f

# Пересобираем с принудительной пересборкой
docker-compose build --no-cache
docker-compose up -d

echo "✅ Пересборка завершена!"
echo "🌐 Проверяем доступность приложения..."
sleep 10

# Проверяем статус контейнеров
docker ps

echo "🎉 Готово! Приложение должно использовать правильный API URL." 