#!/bin/bash

echo "🔄 Обновляем только frontend..."

ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238 << 'ENDSSH'
cd /root/supermock

echo "🛑 Останавливаем frontend..."
docker-compose stop frontend
docker-compose rm -f frontend

echo "🧹 Очищаем старые образы..."
docker image prune -f

echo "🔨 Собираем новый frontend..."
docker-compose build --no-cache frontend

echo "🚀 Запускаем frontend..."
docker-compose up -d frontend

echo "✅ Проверяем статус..."
docker-compose ps frontend

echo "📋 Логи frontend:"
docker-compose logs --tail=10 frontend
ENDSSH

echo "🎉 Frontend обновлен!" 