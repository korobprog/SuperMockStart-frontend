#!/bin/bash

# Скрипт для развертывания SuperMock на сервере через SSH

echo "🚀 Начинаем развертывание SuperMock на сервере..."

# Настройки
SERVER_USER="root"
SERVER_IP="217.198.6.238"
SSH_KEY="~/.ssh/timeweb_vps_key"
PROJECT_PATH="/root/supermock"

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Подготовка файлов для деплоя...${NC}"

# Создаем временную директорию для архива
TEMP_DIR=$(mktemp -d)
ARCHIVE_NAME="supermock-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"

# Копируем необходимые файлы
echo "Копирование файлов..."
cp -r . "$TEMP_DIR/supermock/"

# Удаляем ненужные файлы
cd "$TEMP_DIR/supermock"
rm -rf node_modules dist .git backend/node_modules backend/dist

# Создаем архив
cd "$TEMP_DIR"
tar -czf "$ARCHIVE_NAME" supermock/

echo -e "${GREEN}✅ Архив создан: $ARCHIVE_NAME${NC}"

# Копируем на сервер
echo -e "${YELLOW}📤 Копирование на сервер...${NC}"
scp -i "$SSH_KEY" "$ARCHIVE_NAME" "$SERVER_USER@$SERVER_IP:/tmp/"

# Выполняем команды на сервере
echo -e "${YELLOW}🔧 Развертывание на сервере...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

# Создаем директорию проекта если не существует
mkdir -p /root/supermock

# Переходим в временную директорию
cd /tmp

# Распаковываем архив
tar -xzf supermock-deploy-*.tar.gz

# Копируем файлы в директорию проекта
cp -r supermock/* /root/supermock/

# Переходим в директорию проекта
cd /root/supermock

# Останавливаем старые контейнеры
echo "Останавливаем старые контейнеры..."
docker-compose -f docker-compose.dokploy.yml down || true

# Собираем и запускаем новые контейнеры
echo "Собираем и запускаем новые контейнеры..."
docker-compose -f docker-compose.dokploy.yml build --no-cache
docker-compose -f docker-compose.dokploy.yml up -d

# Проверяем статус
echo "Проверяем статус контейнеров..."
docker-compose -f docker-compose.dokploy.yml ps

# Очищаем временные файлы
rm -f /tmp/supermock-deploy-*.tar.gz
rm -rf /tmp/supermock

echo "✅ Развертывание завершено!"
ENDSSH

# Очищаем локальные временные файлы
rm -rf "$TEMP_DIR"

echo -e "${GREEN}🎉 Развертывание успешно завершено!${NC}"
echo -e "${GREEN}📱 Frontend: https://supermock.ru${NC}"
echo -e "${GREEN}🔧 Backend: https://api.supermock.ru${NC}"