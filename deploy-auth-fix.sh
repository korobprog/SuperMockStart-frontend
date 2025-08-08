#!/bin/bash

# Скрипт для исправления проблем с авторизацией
echo "🔧 Исправление проблем с авторизацией SuperMock"

# Остановка текущих контейнеров
echo "🛑 Остановка контейнеров..."
docker compose -f docker-compose.dokploy.yml down

# Сборка обновленных образов
echo "🏗️ Сборка обновленных образов..."
docker compose -f docker-compose.dokploy.yml build --no-cache

# Запуск обновленных контейнеров
echo "🚀 Запуск обновленных контейнеров..."
docker compose -f docker-compose.dokploy.yml up -d

# Проверка статуса
echo "📊 Проверка статуса контейнеров..."
docker compose -f docker-compose.dokploy.yml ps

# Ожидание инициализации бэкенда
echo "⏳ Ожидание инициализации бэкенда (30 секунд)..."
sleep 30

# Проверка здоровья API
echo "🏥 Проверка здоровья API..."
curl -s https://api.supermock.ru/api/health | jq '.' || echo "Health check failed"

# Тестирование auth/session endpoint
echo "🔐 Тестирование auth/session endpoint..."
curl -s https://api.supermock.ru/api/auth/session | jq '.' || echo "Session endpoint test failed"

echo "✅ Развертывание завершено!"
echo "📝 Проверьте логи: docker compose -f docker-compose.dokploy.yml logs -f"