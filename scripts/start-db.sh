#!/bin/bash

# Скрипт для запуска PostgreSQL локально для разработки

echo "🐘 Запуск PostgreSQL для разработки..."

# Проверяем, установлен ли Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker для продолжения."
    exit 1
fi

# Проверяем, запущен ли контейнер с PostgreSQL
if docker ps | grep -q "postgres"; then
    echo "✅ PostgreSQL уже запущен"
else
    echo "🚀 Запуск PostgreSQL контейнера..."
    
    # Останавливаем существующие контейнеры с PostgreSQL
    docker stop postgres-dev 2>/dev/null || true
    docker rm postgres-dev 2>/dev/null || true
    
    # Запускаем новый контейнер
    docker run -d \
        --name postgres-dev \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=krishna1284radha \
        -e POSTGRES_DB=supermock \
        -p 5432:5432 \
        postgres:16-alpine
    
    echo "⏳ Ожидание запуска PostgreSQL..."
    sleep 5
    
    # Проверяем подключение
    if docker exec postgres-dev pg_isready -U postgres; then
        echo "✅ PostgreSQL успешно запущен на localhost:5432"
        echo "📊 Данные для подключения:"
        echo "   Host: localhost"
        echo "   Port: 5432"
        echo "   Database: supermock"
        echo "   Username: postgres"
        echo "   Password: krishna1284radha"
    else
        echo "❌ Ошибка запуска PostgreSQL"
        exit 1
    fi
fi

echo ""
echo "🔧 Для применения миграций выполните:"
echo "   cd backend && pnpm prisma migrate dev"
echo ""
echo "🔍 Для проверки подключения выполните:"
echo "   cd backend && pnpm prisma db push"
echo ""
echo "🛑 Для остановки базы данных выполните:"
echo "   docker stop postgres-dev"
