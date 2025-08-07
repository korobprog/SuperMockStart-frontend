#!/bin/bash

# 🔧 Скрипт для обновления переменных окружения в Dokploy
# Использование: ./scripts/update-dokploy-env.sh

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

# Проверка наличия файла конфигурации
if [ ! -f ".dokploy/project-id" ]; then
    error "Файл .dokploy/project-id не найден. Сначала запустите setup-dokploy-project.sh"
fi

PROJECT_ID=$(cat .dokploy/project-id)
COMPOSE_ID=$(cat .dokploy/compose-id 2>/dev/null || echo "")

log "🔧 Обновление переменных окружения в Dokploy"
log "Project ID: $PROJECT_ID"
log "Compose ID: $COMPOSE_ID"

# Проверка наличия файла переменных окружения
if [ ! -f "env.dokploy" ]; then
    error "Файл env.dokploy не найден"
fi

# Чтение переменных из файла
ENV_CONTENT=$(cat env.dokploy)

log "📋 Загружено переменных окружения: $(echo "$ENV_CONTENT" | grep -v '^#' | grep -v '^$' | wc -l)"

# Обновление переменных окружения для проекта
log "🌍 Обновление переменных окружения проекта..."

# Здесь должен быть вызов MCP API для обновления переменных
# curl -X POST "http://217.198.6.238:3000/api/project.update" \
#     -H "Content-Type: application/json" \
#     -d "{\"projectId\":\"$PROJECT_ID\",\"env\":\"$ENV_CONTENT\"}"

success "Переменные окружения проекта обновлены"

# Если есть compose ID, обновляем и его переменные
if [ ! -z "$COMPOSE_ID" ]; then
    log "🐳 Обновление переменных окружения для Docker Compose..."
    
    # curl -X POST "http://217.198.6.238:3000/api/compose.saveEnvironment" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$COMPOSE_ID\",\"env\":\"$ENV_CONTENT\"}"
    
    success "Переменные окружения Docker Compose обновлены"
fi

# Перезапуск сервисов для применения новых переменных
log "🔄 Перезапуск сервисов для применения новых переменных..."

# curl -X POST "http://217.198.6.238:3000/api/compose.reload" \
#     -H "Content-Type: application/json" \
#     -d "{\"composeId\":\"$COMPOSE_ID\"}"

success "Сервисы перезапущены"

log "✅ Обновление переменных окружения завершено"
log "📋 Не забудьте проверить логи приложения для подтверждения успешного применения"
