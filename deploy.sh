#!/bin/bash

# 🚀 SuperMock Deploy Script
echo "🚀 Starting SuperMock deployment..."

# Проверяем наличие необходимых файлов
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found!"
    exit 1
fi

if [ ! -f "Dockerfile.frontend" ]; then
    echo "❌ Dockerfile.frontend not found!"
    exit 1
fi

if [ ! -f "backend/Dockerfile.backend" ]; then
    echo "❌ backend/Dockerfile.backend not found!"
    exit 1
fi

echo "✅ All required files found"

# Сборка и запуск
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Проверка статуса
echo "⏳ Waiting for services to start..."
sleep 10

# Проверка здоровья сервисов
echo "🏥 Checking service health..."

# Проверка бэкенда
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Проверка фронтенда
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
fi

echo "🎉 Deployment completed!"
echo "📱 Frontend: http://localhost"
echo "🔧 Backend: http://localhost:3001"
echo "🏥 Health: http://localhost:3001/health" 