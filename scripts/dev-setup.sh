#!/bin/bash

# Скрипт для настройки и запуска среды разработки SuperMock

set -e

echo "🚀 Настройка среды разработки SuperMock..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.dev.yml down

# Удаляем старые volumes если нужно
if [ "$1" = "--clean" ]; then
    echo "🧹 Очищаем старые данные..."
    docker-compose -f docker-compose.dev.yml down -v
    docker volume rm $(docker volume ls -q | grep postgres_dev_data) 2>/dev/null || true
fi

# Создаем сеть если её нет
echo "🌐 Создаем сеть для разработки..."
docker network create supermock-dev-network 2>/dev/null || true

# Запускаем сервисы
echo "🚀 Запускаем сервисы разработки..."
docker-compose -f docker-compose.dev.yml up --build -d

# Ждем пока база данных будет готова
echo "⏳ Ждем готовности базы данных..."
until docker-compose -f docker-compose.dev.yml exec -T database pg_isready -U postgres -d supermock; do
    echo "База данных еще не готова, ждем..."
    sleep 2
done

echo "✅ База данных готова!"

# Проверяем статус сервисов
echo "📊 Статус сервисов:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 Среда разработки готова!"
echo ""
echo "📋 Доступные сервисы:"
echo "   • Backend API: http://localhost:3001"
echo "   • База данных: localhost:5432"
echo "   • Adminer (управление БД): http://localhost:8080"
echo ""
echo "🔧 Полезные команды:"
echo "   • Просмотр логов: docker-compose -f docker-compose.dev.yml logs -f"
echo "   • Остановить: docker-compose -f docker-compose.dev.yml down"
echo "   • Перезапустить: docker-compose -f docker-compose.dev.yml restart"
echo "   • Очистить и перезапустить: ./scripts/dev-setup.sh --clean"
echo ""
echo "📝 Для просмотра базы данных через Adminer:"
echo "   • Система: PostgreSQL"
echo "   • Сервер: database"
echo "   • Пользователь: postgres"
echo "   • Пароль: krishna1284radha"
echo "   • База данных: supermock" 