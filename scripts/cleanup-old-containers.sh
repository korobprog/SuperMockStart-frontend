#!/bin/bash

# Скрипт для очистки старых контейнеров и образов SuperMock

echo "🧹 Очищаем старые контейнеры и образы..."

# Подключаемся к серверу
ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238 << 'ENDSSH'

echo "📋 Текущие контейнеры:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

echo -e "\n🗑️ Удаляем неиспользуемые образы и контейнеры..."
docker system prune -f

echo -e "\n🧹 Удаляем неиспользуемые образы..."
docker image prune -f

echo -e "\n📊 Освобожденное место:"
docker system df

echo -e "\n✅ Очистка завершена!"
echo -e "\n📋 Оставшиеся контейнеры:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

ENDSSH

echo "🎉 Очистка сервера завершена!"