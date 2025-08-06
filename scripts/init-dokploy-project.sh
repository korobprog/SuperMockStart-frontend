#!/bin/bash

# Инициализация проекта SuperMock на Dokploy

echo "🚀 Инициализация SuperMock на Dokploy..."

# Настройки
SERVER_USER="root"
SERVER_IP="217.198.6.238"
SSH_KEY="~/.ssh/timeweb_vps_key"

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Создаем архив с проектом
echo -e "${YELLOW}📦 Создаем архив проекта...${NC}"
ARCHIVE_NAME="supermock-init.tar.gz"

# Исключаем ненужные файлы
tar --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='backend/node_modules' \
    --exclude='backend/dist' \
    -czf "$ARCHIVE_NAME" .

echo -e "${YELLOW}📤 Копируем на сервер...${NC}"
scp -i "$SSH_KEY" "$ARCHIVE_NAME" "$SERVER_USER@$SERVER_IP:/tmp/"

# Выполняем команды на сервере
echo -e "${YELLOW}🔧 Настройка на сервере...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

# Создаем директорию проекта
mkdir -p /root/supermock
cd /root/supermock

# Распаковываем архив
echo "📦 Распаковываем файлы..."
tar -xzf /tmp/supermock-init.tar.gz

# Создаем необходимые директории
mkdir -p files/postgres-data
mkdir -p files/backend-logs

# Устанавливаем права
chmod -R 755 files/

# Копируем docker-compose файл
cp docker-compose.dokploy.yml docker-compose.yml

# Проверяем сеть dokploy
echo "🔗 Проверяем сеть dokploy..."
docker network ls | grep dokploy-network || docker network create --driver overlay --attachable dokploy-network

# Запускаем контейнеры
echo "🐳 Запускаем контейнеры..."
docker-compose up -d --build

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 10

# Проверяем статус
echo "✅ Статус контейнеров:"
docker-compose ps

# Инициализируем базу данных
echo "🗄️ Инициализируем базу данных..."
docker-compose exec backend npx prisma migrate deploy || echo "Миграции будут применены при первом запуске"

# Очищаем временные файлы
rm -f /tmp/supermock-init.tar.gz

echo "✅ Инициализация завершена!"
ENDSSH

# Удаляем локальный архив
rm -f "$ARCHIVE_NAME"

echo -e "${GREEN}🎉 Проект успешно инициализирован!${NC}"
echo -e "${GREEN}📱 Frontend: https://supermock.ru${NC}"
echo -e "${GREEN}🔧 Backend: https://api.supermock.ru/api${NC}"
echo -e "${YELLOW}💡 Для последующих обновлений используйте: ./scripts/quick-deploy-dokploy.sh${NC}"