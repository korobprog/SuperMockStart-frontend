#!/bin/bash

# Скрипт для запуска среды разработки
# Запускает базу данных, бэкенд и фронтенд

echo "🚀 Запуск среды разработки..."

# Проверяем, что мы в корневой директории проекта
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой директории проекта"
    exit 1
fi

# Функция для проверки порта
check_port() {
    local port=$1
    if netstat -ano | grep -q ":$port.*LISTENING"; then
        echo "⚠️  Порт $port занят"
        return 1
    else
        echo "✅ Порт $port свободен"
        return 0
    fi
}

# Проверяем порты
echo "🔍 Проверка портов..."
check_port 3001 || {
    echo "❌ Порт 3001 занят. Запустите ./scripts/dev-setup.sh для очистки"
    exit 1
}

check_port 5432 || {
    echo "⚠️  Порт 5432 занят (возможно PostgreSQL уже запущен)"
}

# Создаем .env.local если его нет
if [ ! -f ".env.local" ]; then
    echo "📝 Создаем .env.local..."
    cat > .env.local << EOF
VITE_API_URL=http://localhost:3001
EOF
fi

# Проверяем backend .env
if [ ! -f "backend/.env" ]; then
    echo "📝 Создаем backend/.env..."
    cp backend/env.backend backend/.env
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости фронтенда..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Устанавливаем зависимости бэкенда..."
    cd backend && npm install && cd ..
fi

# Генерируем Prisma клиент
echo "🔧 Генерируем Prisma клиент..."
cd backend && npx prisma generate && cd ..

echo ""
echo "✅ Среда разработки готова!"
echo ""
echo "📋 Запустите следующие команды в разных терминалах:"
echo ""
echo "Терминал 1 (База данных):"
echo "  cd backend && npm run db:studio"
echo ""
echo "Терминал 2 (Бэкенд):"
echo "  cd backend && npm run dev"
echo ""
echo "Терминал 3 (Фронтенд):"
echo "  npm run dev"
echo ""
echo "🌐 Доступные URL:"
echo "- Фронтенд: http://localhost:5173"
echo "- Бэкенд: http://localhost:3001"
echo "- База данных: localhost:5432"
echo ""
echo "🔧 Для очистки портов используйте: ./scripts/dev-setup.sh" 