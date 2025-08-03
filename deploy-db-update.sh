#!/bin/bash

# Скрипт для обновления базы данных на сервере
# Использование: ./deploy-db-update.sh

SERVER_IP="217.198.6.238"
PROJECT_PATH="/root/supermock"  # Путь к проекту на сервере

echo "🚀 Начинаем обновление базы данных на сервере $SERVER_IP..."

# 1. Подключение к серверу и обновление кода
echo "📥 Подключаемся к серверу и обновляем код..."
ssh root@$SERVER_IP << 'EOF'
    cd $PROJECT_PATH
    
    echo "🔄 Получаем последние изменения из Git..."
    git pull origin master
    
    echo "📦 Устанавливаем зависимости..."
    npm install
    
    echo "🗄️ Обновляем схему базы данных..."
    npx prisma generate
    npx prisma db push
    
    echo "🔄 Перезапускаем сервер..."
    pm2 restart supermock-backend
    
    echo "✅ Обновление завершено!"
EOF

echo "🎉 База данных успешно обновлена на сервере!"
echo "🔗 Проверьте работу API: http://$SERVER_IP:3001/health" 