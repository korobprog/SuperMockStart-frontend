#!/bin/bash

# Скрипт для инициализации базы данных SuperMock
# Используется при первом развертывании

set -e

echo "🗄️  Инициализация базы данных SuperMock..."

# Ждем запуска PostgreSQL
echo "⏳ Ждем запуска PostgreSQL..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL еще не готов, ждем..."
  sleep 2
done

echo "✅ PostgreSQL готов!"

# Генерируем Prisma клиент
echo "🔧 Генерируем Prisma клиент..."
npx prisma generate

# Применяем миграции
echo "📦 Применяем миграции базы данных..."
npx prisma migrate deploy

# Проверяем статус базы данных
echo "🔍 Проверяем статус базы данных..."
npx prisma db push --accept-data-loss

echo "✅ База данных успешно инициализирована!"

# Запускаем приложение
echo "🚀 Запускаем приложение..."
npm start 