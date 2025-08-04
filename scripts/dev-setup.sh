#!/bin/bash

# Скрипт для настройки среды разработки
# Останавливает Docker контейнеры и освобождает порты

echo "🔧 Настройка среды разработки..."

# Останавливаем все Docker контейнеры
echo "🛑 Останавливаем Docker контейнеры..."
docker stop $(docker ps -q) 2>/dev/null || true

# Ждем немного
sleep 2

# Проверяем и освобождаем порт 3001
echo "🔍 Проверяем порт 3001..."
if netstat -ano | grep -q ":3001.*LISTENING"; then
    echo "⚠️  Порт 3001 занят, освобождаем..."
    PID=$(netstat -ano | grep ":3001.*LISTENING" | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
        echo "🔄 Завершаем процесс $PID..."
        taskkill /PID $PID /F 2>/dev/null || true
        sleep 2
    fi
else
    echo "✅ Порт 3001 свободен"
fi

# Проверяем и освобождаем порт 5432 (PostgreSQL)
echo "🔍 Проверяем порт 5432..."
if netstat -ano | grep -q ":5432.*LISTENING"; then
    echo "⚠️  Порт 5432 занят, освобождаем..."
    PID=$(netstat -ano | grep ":5432.*LISTENING" | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
        echo "🔄 Завершаем процесс $PID..."
        taskkill /PID $PID /F 2>/dev/null || true
        sleep 2
    fi
else
    echo "✅ Порт 5432 свободен"
fi

echo "✅ Среда разработки готова!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Запустите базу данных: cd backend && npm run db:studio"
echo "2. Запустите бэкенд: cd backend && npm run dev"
echo "3. Запустите фронтенд: npm run dev"
echo ""
echo "🌐 Доступные URL:"
echo "- Фронтенд: http://localhost:5173"
echo "- Бэкенд: http://localhost:3001"
echo "- База данных: localhost:5432" 