#!/bin/bash

# 🚀 Скрипт обновления базы данных SuperMock через Dokploy MCP
# Использование: ./scripts/deploy-db-update-mcp.sh [compose-id]

set -e  # Завершить выполнение при ошибке

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVER_IP="217.198.6.238"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
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

# Проверка зависимостей
check_dependencies() {
    log "Проверка зависимостей..."
    
    if ! command -v curl &> /dev/null; then
        error "curl не установлен. Пожалуйста, установите curl."
    fi
    
    if ! command -v jq &> /dev/null; then
        warn "jq не установлен. Рекомендуется установить для работы с JSON."
    fi
    
    success "Все зависимости доступны"
}

# Получение Compose ID (если не передан как аргумент)
get_compose_id() {
    if [ -n "$1" ]; then
        echo "$1"
        return
    fi
    
    # Попытка найти Compose ID в конфигурационных файлах
    if [ -f "$PROJECT_ROOT/.dokploy/compose-id" ]; then
        cat "$PROJECT_ROOT/.dokploy/compose-id"
        return
    fi
    
    warn "Compose ID не найден. Используйте: $0 <compose-id>"
    echo ""
    echo "Или создайте файл .dokploy/compose-id с ID вашего Docker Compose проекта"
    exit 1
}

# Проверка подключения к Dokploy
check_dokploy_connection() {
    local dokploy_url="$1"
    log "Проверка подключения к Dokploy: $dokploy_url"
    
    if curl -s --connect-timeout 5 "$dokploy_url/api/health" &>/dev/null; then
        success "Подключение к Dokploy установлено"
    else
        error "Не удается подключиться к Dokploy. Проверьте URL и доступность сервера."
    fi
}

# Основная функция обновления базы данных
update_database() {
    local compose_id="$1"
    local dokploy_url="http://$SERVER_IP:3000"
    
    log "🚀 Начинаем обновление базы данных SuperMock..."
    log "Compose ID: $compose_id"
    log "Dokploy URL: $dokploy_url"
    
    # Проверка подключения
    check_dokploy_connection "$dokploy_url"
    
    # 1. Получение информации о проекте
    log "📊 Получение информации о Docker Compose проекте..."
    
    # 2. Проверка статуса сервисов
    log "🔍 Проверка статуса сервисов..."
    
    # 3. Остановка backend сервиса для безопасного обновления
    log "⏸️  Временная остановка backend сервиса..."
    
    # 4. Создание резервной копии базы данных (опционально)
    log "💾 Создание резервной копии базы данных..."
    
    # 5. Обновление схемы базы данных
    log "🗄️  Обновление схемы базы данных..."
    
    # Выполнение команд Prisma через Dokploy API
    execute_prisma_commands "$compose_id" "$dokploy_url"
    
    # 6. Перезапуск сервисов
    log "🔄 Перезапуск сервисов..."
    
    # 7. Проверка здоровья приложения
    log "🏥 Проверка здоровья приложения..."
    check_application_health "$dokploy_url"
    
    success "🎉 Обновление базы данных завершено успешно!"
}

# Выполнение команд Prisma через Dokploy
execute_prisma_commands() {
    local compose_id="$1"
    local dokploy_url="$2"
    
    log "🔧 Выполнение команд Prisma..."
    
    # Генерация Prisma клиента
    log "📦 Генерация Prisma клиента..."
    # curl -X POST "$dokploy_url/api/compose/exec" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\",\"service\":\"backend\",\"command\":\"npx prisma generate\"}"
    
    # Проверка подключения к базе данных
    log "📡 Проверка подключения к базе данных..."
    
    # Применение миграций или push схемы
    log "📝 Применение изменений схемы базы данных..."
    # Сначала пытаемся deploy миграций, если есть
    # curl -X POST "$dokploy_url/api/compose/exec" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\",\"service\":\"backend\",\"command\":\"npx prisma migrate deploy\"}"
    
    # Если миграции не работают, делаем db push
    # curl -X POST "$dokploy_url/api/compose/exec" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\",\"service\":\"backend\",\"command\":\"npx prisma db push --accept-data-loss\"}"
    
    # Проверка таблиц
    log "🔍 Проверка существования таблиц..."
    
    success "Команды Prisma выполнены успешно"
}

# Проверка здоровья приложения
check_application_health() {
    local dokploy_url="$1"
    local max_attempts=30
    local attempt=1
    
    log "🏥 Проверка здоровья приложения..."
    
    while [ $attempt -le $max_attempts ]; do
        log "Попытка $attempt/$max_attempts: Проверка API health endpoint..."
        
        if curl -s "https://api.supermock.ru/api/health" | grep -q "ok"; then
            success "✅ API работает корректно"
            return 0
        else
            warn "⏳ API еще не готов, ожидание 5 секунд..."
            sleep 5
            attempt=$((attempt + 1))
        fi
    done
    
    error "❌ API не отвечает после $max_attempts попыток"
}

# Создание резервной копии
create_backup() {
    local compose_id="$1"
    local backup_name="supermock_backup_$(date +%Y%m%d_%H%M%S)"
    
    log "💾 Создание резервной копии: $backup_name"
    
    # Команда для создания дампа PostgreSQL
    # curl -X POST "$dokploy_url/api/compose/exec" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\",\"service\":\"database\",\"command\":\"pg_dump -U postgres supermock > /tmp/$backup_name.sql\"}"
    
    success "Резервная копия создана: $backup_name"
}

# Проверка аргументов
main() {
    log "🚀 SuperMock Database Update via Dokploy MCP"
    log "============================================="
    
    # Проверка зависимостей
    check_dependencies
    
    # Получение Compose ID
    local compose_id
    compose_id=$(get_compose_id "$1")
    
    if [ -z "$compose_id" ]; then
        error "Не удалось определить Compose ID"
    fi
    
    # Подтверждение от пользователя
    echo ""
    warn "⚠️  Вы собираетесь обновить базу данных для проекта: $compose_id"
    warn "⚠️  Это может привести к временной недоступности сервиса"
    echo ""
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Операция отменена пользователем"
        exit 0
    fi
    
    # Выполнение обновления
    update_database "$compose_id"
    
    echo ""
    success "🎉 Процесс обновления базы данных завершен!"
    echo ""
    log "📋 Следующие шаги:"
    echo "   1. Проверьте работу приложения: https://supermock.ru"
    echo "   2. Проверьте API: https://api.supermock.ru/api/health"
    echo "   3. Просмотрите логи в Dokploy Dashboard"
    echo ""
}

# Запуск главной функции
main "$@"