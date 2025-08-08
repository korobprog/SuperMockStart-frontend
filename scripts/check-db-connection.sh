#!/bin/bash

# Скрипт для проверки соединения с базой данных

echo "🔍 Проверка соединения с базой данных..."

# Проверяем, запущены ли контейнеры
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "database.*Up"; then
    echo "❌ База данных не запущена. Запустите: ./scripts/dev-setup.sh"
    exit 1
fi

# Проверяем соединение с базой данных
echo "📊 Проверяем статус базы данных..."
if docker-compose -f docker-compose.dev.yml exec -T database pg_isready -U postgres -d supermock; then
    echo "✅ База данных доступна"
else
    echo "❌ База данных недоступна"
    exit 1
fi

# Проверяем схему Prisma
echo "🔧 Проверяем схему Prisma..."
if docker-compose -f docker-compose.dev.yml exec backend-dev npx prisma db push --accept-data-loss; then
    echo "✅ Схема Prisma синхронизирована"
else
    echo "❌ Ошибка синхронизации схемы Prisma"
    exit 1
fi

# Проверяем количество таблиц
echo "📋 Проверяем таблицы в базе данных..."
TABLE_COUNT=$(docker-compose -f docker-compose.dev.yml exec -T database psql -U postgres -d supermock -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
echo "📊 Найдено таблиц: $TABLE_COUNT"

# Проверяем API
echo "🌐 Проверяем API..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ API доступен"
else
    echo "⚠️  API недоступен (возможно, еще запускается)"
fi

echo ""
echo "🎉 Проверка завершена!"
echo ""
echo "📋 Доступные сервисы:"
echo "   • Backend API: http://localhost:3001"
echo "   • База данных: localhost:5432"
echo "   • Adminer: http://localhost:8080"
