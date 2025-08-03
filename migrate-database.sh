#!/bin/bash

# Скрипт для миграции базы данных после улучшений авторизации
# Использование: ./migrate-database.sh

SERVER_IP="217.198.6.238"
PROJECT_PATH="/root/supermock"

echo "🚀 Начинаем миграцию базы данных после улучшений авторизации..."

# Подключение к серверу и выполнение миграции
echo "📥 Подключаемся к серверу..."
ssh -i ~/.ssh/timeweb_vps_key root@$SERVER_IP << EOF
    cd $PROJECT_PATH
    
    echo "🔄 Получаем последние изменения из Git..."
    git pull origin master
    
    echo "📦 Устанавливаем зависимости backend..."
    cd backend
    npm install
    
    echo "🗄️ Генерируем Prisma клиент..."
    npx prisma generate
    
    echo "🚨 Выполняем миграцию базы данных..."
    echo "⚠️  Эта операция добавит новые поля для email авторизации и таблицу user_form_data"
    npx prisma migrate deploy
    
    echo "👤 Создаем администратора (если не существует)..."
    npm run create-admin
    
    echo "🔄 Перезапускаем backend сервис..."
    cd ..
    pm2 restart supermock-backend
    
    echo "✅ Миграция завершена!"
    
    echo "🔍 Проверяем статус сервисов..."
    pm2 status
    
    echo "🗄️  Проверяем структуру базы данных..."
    cd backend
    npx prisma db pull --print
EOF

echo ""
echo "🎉 Миграция базы данных успешно завершена!"
echo ""
echo "📊 Что было добавлено:"
echo "   ✅ UserRole enum (ADMIN, USER)"
echo "   ✅ Поля email и password для классической авторизации"
echo "   ✅ Поле role для управления ролями пользователей"
echo "   ✅ Поля isActive и lastLoginAt для расширенного управления"
echo "   ✅ Таблица user_form_data для данных форм"
echo "   ✅ Уникальный индекс на email"
echo ""
echo "🔗 Проверьте работу обновленного API:"
echo "   Frontend: https://supermock.ru"
echo "   Backend Health: https://api.supermock.ru/api/health"
echo "   Auth endpoints: https://api.supermock.ru/api/auth"