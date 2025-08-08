#!/bin/bash

# 🔧 Скрипт для проверки и исправления проблем с базой данных
# Использование: ./scripts/check-db.sh

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

log "🔧 Проверка и исправление проблем с базой данных"

# Проверяем, что мы в правильной директории
if [ ! -f "backend/prisma/schema.prisma" ]; then
    error "Файл backend/prisma/schema.prisma не найден. Запустите скрипт из корневой директории проекта."
fi

cd backend

log "📋 Проверка переменных окружения..."
if [ -z "$DATABASE_URL" ]; then
    warn "DATABASE_URL не установлена. Проверяем файлы .env..."
    
    # Ищем DATABASE_URL в файлах .env
    if [ -f ".env" ]; then
        export DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
        log "Найдена DATABASE_URL в .env"
    elif [ -f "env.production" ]; then
        export DATABASE_URL=$(grep DATABASE_URL env.production | cut -d '=' -f2-)
        log "Найдена DATABASE_URL в env.production"
    else
        error "DATABASE_URL не найдена в файлах .env"
    fi
fi

log "🔍 DATABASE_URL: ${DATABASE_URL:0:50}..."

# Проверяем подключение к базе данных
log "🔌 Проверка подключения к базе данных..."
if npx prisma db pull --force 2>/dev/null; then
    success "Подключение к базе данных успешно"
else
    error "Не удалось подключиться к базе данных. Проверьте DATABASE_URL и доступность сервера."
fi

# Проверяем состояние миграций
log "📊 Проверка состояния миграций..."
if npx prisma migrate status 2>/dev/null; then
    success "Миграции в порядке"
else
    warn "Проблемы с миграциями. Попытка исправления..."
    
    # Создаем новую миграцию если нужно
    if npx prisma migrate dev --name fix_schema 2>/dev/null; then
        success "Миграции исправлены"
    else
        error "Не удалось исправить миграции"
    fi
fi

# Генерируем Prisma Client
log "🔨 Генерация Prisma Client..."
if npx prisma generate; then
    success "Prisma Client сгенерирован"
else
    error "Ошибка генерации Prisma Client"
fi

# Проверяем схему базы данных
log "📋 Проверка схемы базы данных..."
if npx prisma db push --accept-data-loss; then
    success "Схема базы данных синхронизирована"
else
    error "Ошибка синхронизации схемы базы данных"
fi

# Проверяем, что таблицы существуют
log "🗄️  Проверка существования таблиц..."
if npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null; then
    success "Таблицы базы данных доступны"
else
    error "Проблемы с доступом к таблицам базы данных"
fi

# Проверяем подключение через Prisma
log "🧪 Тестирование подключения через Prisma..."
cat > test-db.js << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Пробуем выполнить простой запрос
    const userCount = await prisma.user.count();
    console.log(`✅ Подключение к базе данных успешно. Пользователей: ${userCount}`);
    
    // Проверяем структуру таблицы User
    const user = await prisma.user.findFirst();
    if (user) {
      console.log('✅ Таблица User доступна и содержит данные');
    } else {
      console.log('ℹ️  Таблица User пуста (это нормально для нового проекта)');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

if node test-db.js; then
    success "Тест подключения к базе данных прошел успешно"
else
    error "Тест подключения к базе данных не прошел"
fi

# Удаляем временный файл
rm -f test-db.js

log "✅ Проверка базы данных завершена"
log "📋 Рекомендации:"
echo "   1. Убедитесь, что DATABASE_URL корректна"
echo "   2. Проверьте, что PostgreSQL сервер запущен"
echo "   3. Убедитесь, что база данных существует"
echo "   4. Проверьте права доступа к базе данных"
