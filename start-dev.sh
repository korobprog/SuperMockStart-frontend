#!/bin/bash

echo "🚀 Запуск SuperMock в режиме разработки..."

# Проверяем Docker
echo "📦 Проверка Docker..."
if docker info > /dev/null 2>&1; then
    echo "✅ Docker доступен"
else
    echo "❌ Docker не запущен. Запустите Docker Desktop вручную."
    echo "💡 Или установите PostgreSQL локально:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

# Запускаем базу данных
echo "🗄️ Запуск PostgreSQL..."
pnpm dev:db

# Ждем запуска базы данных
echo "⏳ Ожидание запуска базы данных..."
sleep 10

# Настраиваем базу данных
echo "🔧 Настройка базы данных..."
pnpm db:setup

# Запускаем приложение
echo "🎯 Запуск приложения..."
pnpm dev:full:with-db

echo "🎉 Готово! Приложение запущено:"
echo "   🌐 Фронтенд: http://localhost:5174"
echo "   🔧 Бэкенд: http://localhost:3001"
echo "   🗄️ База данных: localhost:5432" 