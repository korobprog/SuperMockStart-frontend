#!/bin/bash

# Скрипт для деплоя SuperMock на сервер
echo "🚀 Начинаем деплой SuperMock на сервер..."

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose-prod.yml" ]; then
    echo "❌ Ошибка: docker-compose-prod.yml не найден"
    exit 1
fi

# Останавливаем локальные контейнеры
echo "📦 Останавливаем локальные контейнеры..."
docker-compose -f docker-compose-simple.yml down

# Собираем образы для продакшена
echo "🔨 Собираем образы для продакшена..."
docker-compose -f docker-compose-prod.yml build --no-cache

# Проверяем, что образы собрались успешно
if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке образов"
    exit 1
fi

echo "✅ Образы собраны успешно!"

# Копируем файлы на сервер
echo "📤 Копируем файлы на сервер..."
scp -i ~/.ssh/timeweb_vps_key docker-compose-prod.yml root@217.198.6.238:/etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code/
scp -i ~/.ssh/timeweb_vps_key .env root@217.198.6.238:/etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code/
scp -i ~/.ssh/timeweb_vps_key nginx.conf root@217.198.6.238:/etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code/

# Проверяем успешность копирования
if [ $? -ne 0 ]; then
    echo "❌ Ошибка при копировании файлов на сервер"
    exit 1
fi

echo "✅ Файлы скопированы на сервер!"

# Подключаемся к серверу и запускаем деплой
echo "🌐 Подключаемся к серверу и запускаем деплой..."
ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238 << 'EOF'
    cd /etc/dokploy/compose/supermock-supermock-full-stack-yrvopu/code
    
    # Останавливаем старые контейнеры
    echo "🛑 Останавливаем старые контейнеры..."
    docker-compose -f docker-compose-prod.yml down
    
    # Удаляем старые образы
    echo "🗑️ Удаляем старые образы..."
    docker system prune -f
    
    # Запускаем новые контейнеры
    echo "🚀 Запускаем новые контейнеры..."
    docker-compose -f docker-compose-prod.yml up -d
    
    # Проверяем статус
    echo "📊 Проверяем статус контейнеров..."
    docker-compose -f docker-compose-prod.yml ps
    
    # Проверяем логи
    echo "📋 Проверяем логи backend..."
    docker-compose -f docker-compose-prod.yml logs backend --tail=20
    
    echo "✅ Деплой завершен!"
EOF

echo "🎉 Деплой на сервер завершен!"
echo "🌐 Сайт должен быть доступен по адресу: https://supermock.ru"
echo "🔗 API должен быть доступен по адресу: https://api.supermock.ru" 