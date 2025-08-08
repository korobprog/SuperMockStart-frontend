#!/bin/bash

# 🔧 Быстрое обновление переменных окружения в Dokploy
# Использование: ./scripts/quick-update-env.sh

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

log "🔧 Быстрое обновление переменных окружения в Dokploy"

# Проверка наличия файла переменных окружения
if [ ! -f "env.dokploy" ]; then
    error "Файл env.dokploy не найден"
fi

# Чтение переменных из файла
ENV_CONTENT=$(cat env.dokploy)

log "📋 Загружено переменных окружения: $(echo "$ENV_CONTENT" | grep -v '^#' | grep -v '^$' | wc -l)"

# Выводим основные переменные для проверки
log "🔍 Основные переменные:"
echo "$ENV_CONTENT" | grep -E "^(TELEGRAM_TOKEN|JWT_SECRET|DATABASE_URL|NODE_ENV)" | while read line; do
    if [[ $line == TELEGRAM_TOKEN* ]]; then
        echo "  - TELEGRAM_TOKEN: ${line#*=} (длина: ${#line} символов)"
    elif [[ $line == JWT_SECRET* ]]; then
        echo "  - JWT_SECRET: ${line#*=} (длина: ${#line} символов)"
    elif [[ $line == DATABASE_URL* ]]; then
        echo "  - DATABASE_URL: ${line#*=}"
    elif [[ $line == NODE_ENV* ]]; then
        echo "  - NODE_ENV: ${line#*=}"
    fi
done

warn "⚠️  Для применения переменных окружения в Dokploy:"
echo "   1. Откройте Dokploy Dashboard: http://217.198.6.238:3000"
echo "   2. Найдите ваш проект SuperMock"
echo "   3. Перейдите в раздел 'Environment Variables'"
echo "   4. Скопируйте содержимое файла env.dokploy"
echo "   5. Вставьте и сохраните переменные"
echo "   6. Перезапустите сервисы"

log "📋 Содержимое env.dokploy:"
echo "----------------------------------------"
echo "$ENV_CONTENT"
echo "----------------------------------------"

success "✅ Переменные окружения готовы для копирования в Dokploy"
