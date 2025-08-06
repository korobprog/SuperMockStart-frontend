#!/bin/bash

# Быстрый деплой SuperMock на Dokploy

echo "🚀 Развертывание SuperMock на сервере..."

# Настройки
SERVER_USER="root"
SERVER_IP="217.198.6.238"
SSH_KEY="~/.ssh/timeweb_vps_key"

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📤 Подключение к серверу...${NC}"

# Выполняем команды на сервере
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

# Переходим в директорию проекта
cd /root/supermock || { echo "Проект не найден, клонируем..."; git clone https://github.com/your-repo/supermock.git /root/supermock && cd /root/supermock; }

echo "📥 Обновляем код..."
git pull origin master || echo "Git не настроен, пропускаем..."

# Создаем docker-compose.yml из docker-compose.dokploy.yml если не существует
if [ ! -f docker-compose.yml ]; then
  cp docker-compose.dokploy.yml docker-compose.yml 2>/dev/null || echo "docker-compose.dokploy.yml не найден"
fi

# Останавливаем старые контейнеры
echo "🛑 Останавливаем старые контейнеры..."
docker-compose down || true

# Очищаем неиспользуемые образы
echo "🧹 Очищаем старые образы..."
docker image prune -f

# Собираем и запускаем новые контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose build --no-cache
docker-compose up -d

# Проверяем статус
echo "✅ Проверяем статус контейнеров..."
docker-compose ps

# Проверяем логи
echo "📋 Последние логи:"
docker-compose logs --tail=20

echo "✅ Развертывание завершено!"
ENDSSH

echo -e "${GREEN}🎉 Развертывание успешно завершено!${NC}"
echo -e "${GREEN}📱 Frontend: https://supermock.ru${NC}"
echo -e "${GREEN}🔧 Backend: https://api.supermock.ru/api${NC}"