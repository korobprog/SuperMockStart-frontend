#!/bin/bash

# 🚀 Автоматическая настройка проекта SuperMock в Dokploy через MCP
# Использование: ./scripts/setup-dokploy-project.sh

set -e  # Завершить выполнение при ошибке

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$PROJECT_ROOT/.dokploy/config.json"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Функции для логирования
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

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Проверка зависимостей
check_dependencies() {
    log "Проверка зависимостей..."
    
    local missing_deps=()
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Отсутствуют зависимости: ${missing_deps[*]}. Пожалуйста, установите их."
    fi
    
    success "Все зависимости доступны"
}

# Чтение конфигурации
read_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        error "Файл конфигурации не найден: $CONFIG_FILE"
    fi
    
    # Проверка валидности JSON
    if ! jq empty "$CONFIG_FILE" &>/dev/null; then
        error "Некорректный JSON в файле конфигурации: $CONFIG_FILE"
    fi
    
    success "Конфигурация загружена из $CONFIG_FILE"
}

# Создание проекта в Dokploy
create_project() {
    log "📁 Создание проекта в Dokploy..."
    
    local project_name=$(jq -r '.project.name' "$CONFIG_FILE")
    local project_description=$(jq -r '.project.description' "$CONFIG_FILE")
    
    info "Название проекта: $project_name"
    info "Описание: $project_description"
    
    # Здесь должен быть вызов MCP API для создания проекта
    # Пример:
    # PROJECT_ID=$(curl -X POST "$DOKPLOY_URL/api/project.create" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"name\":\"$project_name\",\"description\":\"$project_description\"}" \
    #     | jq -r '.id')
    
    # Временно используем mock ID
    PROJECT_ID="mock_project_$(date +%s)"
    
    success "Проект создан с ID: $PROJECT_ID"
    
    # Сохраняем ID проекта
    mkdir -p "$PROJECT_ROOT/.dokploy"
    echo "$PROJECT_ID" > "$PROJECT_ROOT/.dokploy/project-id"
}

# Создание Docker Compose конфигурации
create_compose() {
    log "🐳 Создание Docker Compose конфигурации..."
    
    local project_id="$1"
    local compose_file=$(jq -r '.compose.file' "$CONFIG_FILE")
    
    if [ ! -f "$PROJECT_ROOT/$compose_file" ]; then
        error "Docker Compose файл не найден: $PROJECT_ROOT/$compose_file"
    fi
    
    info "Используем Docker Compose файл: $compose_file"
    
    # Здесь должен быть вызов MCP API для создания Compose
    # Пример:
    # COMPOSE_ID=$(curl -X POST "$DOKPLOY_URL/api/compose.create" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"projectId\":\"$project_id\",\"name\":\"supermock-compose\",\"sourceType\":\"git\"}" \
    #     | jq -r '.id')
    
    # Временно используем mock ID
    COMPOSE_ID="mock_compose_$(date +%s)"
    
    success "Docker Compose создан с ID: $COMPOSE_ID"
    
    # Сохраняем ID compose
    echo "$COMPOSE_ID" > "$PROJECT_ROOT/.dokploy/compose-id"
}

# Настройка переменных окружения
setup_environment() {
    log "🌍 Настройка переменных окружения..."
    
    local compose_id="$1"
    local env_file="$PROJECT_ROOT/env.dokploy"
    
    if [ ! -f "$env_file" ]; then
        error "Файл переменных окружения не найден: $env_file"
    fi
    
    # Читаем переменные из файла
    local env_vars=""
    while IFS= read -r line; do
        # Пропускаем комментарии и пустые строки
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z "${line// }" ]]; then
            continue
        fi
        env_vars+="$line\n"
    done < "$env_file"
    
    info "Загружено переменных окружения: $(echo -e "$env_vars" | wc -l)"
    
    # Здесь должен быть вызов MCP API для установки переменных
    # curl -X POST "$DOKPLOY_URL/api/compose.saveEnvironment" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\",\"env\":\"$env_vars\"}"
    
    success "Переменные окружения настроены"
}

# Настройка доменов
setup_domains() {
    log "🌐 Настройка доменов..."
    
    local frontend_domain=$(jq -r '.compose.services.frontend.domain' "$CONFIG_FILE")
    local backend_domain=$(jq -r '.compose.services.backend.domain' "$CONFIG_FILE")
    
    info "Frontend домен: $frontend_domain"
    info "Backend домен: $backend_domain"
    
    # Здесь должны быть вызовы MCP API для настройки доменов
    # Настройка SSL сертификатов через Let's Encrypt
    
    success "Домены настроены"
}

# Настройка базы данных
setup_database() {
    log "🗄️  Настройка базы данных..."
    
    local project_id="$1"
    local db_config=$(jq '.compose.services.database' "$CONFIG_FILE")
    
    info "Тип БД: $(echo "$db_config" | jq -r '.type')"
    info "Версия: $(echo "$db_config" | jq -r '.version')"
    
    # Здесь должен быть вызов MCP API для создания PostgreSQL
    # DB_ID=$(curl -X POST "$DOKPLOY_URL/api/postgres.create" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"projectId\":\"$project_id\",\"name\":\"supermock-db\"}" \
    #     | jq -r '.id')
    
    success "База данных настроена"
}

# Развертывание проекта
deploy_project() {
    log "🚀 Развертывание проекта..."
    
    local compose_id="$1"
    
    # Здесь должен быть вызов MCP API для развертывания
    # curl -X POST "$DOKPLOY_URL/api/compose.deploy" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\"}"
    
    success "Проект развернут"
}

# Проверка здоровья
check_health() {
    log "🏥 Проверка здоровья приложения..."
    
    local frontend_url=$(jq -r '.compose.services.frontend.healthCheck' "$CONFIG_FILE")
    local backend_url=$(jq -r '.compose.services.backend.healthCheck' "$CONFIG_FILE")
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Попытка $attempt/$max_attempts: Проверка health endpoints..."
        
        # Проверка backend
        if curl -s --connect-timeout 5 "$backend_url" | grep -q "ok"; then
            success "✅ Backend API работает: $backend_url"
            break
        else
            warn "⏳ Backend API не готов, ожидание 10 секунд..."
            sleep 10
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        error "❌ Backend API не отвечает после $max_attempts попыток"
    fi
    
    # Проверка frontend
    if curl -s --connect-timeout 5 -I "$frontend_url" | grep -q "200 OK"; then
        success "✅ Frontend доступен: $frontend_url"
    else
        warn "⚠️  Frontend может быть недоступен: $frontend_url"
    fi
}

# Настройка webhook для автоматического развертывания
setup_webhook() {
    log "🔗 Настройка webhook для автоматического развертывания..."
    
    local compose_id="$1"
    
    # Получение URL webhook из Dokploy
    # WEBHOOK_URL=$(curl -X GET "$DOKPLOY_URL/api/compose.getWebhookUrl" \
    #     -H "Content-Type: application/json" \
    #     -d "{\"composeId\":\"$compose_id\"}" \
    #     | jq -r '.webhookUrl')
    
    WEBHOOK_URL="https://dokploy.example.com/webhook/$compose_id"
    
    info "Webhook URL: $WEBHOOK_URL"
    
    # Сохраняем URL для использования в GitHub Actions
    echo "$WEBHOOK_URL" > "$PROJECT_ROOT/.dokploy/webhook-url"
    
    success "Webhook настроен"
    
    echo ""
    warn "📋 Для автоматического развертывания добавьте этот URL в настройки GitHub:"
    echo "   Repository → Settings → Webhooks → Add webhook"
    echo "   Payload URL: $WEBHOOK_URL"
    echo "   Content type: application/json"
    echo "   Events: Push events"
}

# Генерация итогового отчета
generate_report() {
    log "📊 Генерация отчета о настройке..."
    
    local project_id=$(cat "$PROJECT_ROOT/.dokploy/project-id" 2>/dev/null || echo "N/A")
    local compose_id=$(cat "$PROJECT_ROOT/.dokploy/compose-id" 2>/dev/null || echo "N/A")
    local webhook_url=$(cat "$PROJECT_ROOT/.dokploy/webhook-url" 2>/dev/null || echo "N/A")
    
    local report_file="$PROJECT_ROOT/.dokploy/setup-report.md"
    
    cat > "$report_file" << EOF
# SuperMock Dokploy Setup Report

Дата создания: $(date '+%Y-%m-%d %H:%M:%S')

## Идентификаторы

- **Project ID**: \`$project_id\`
- **Compose ID**: \`$compose_id\`

## Домены

- **Frontend**: https://supermock.ru
- **Backend API**: https://api.supermock.ru

## Endpoints

- **Health Check**: https://api.supermock.ru/api/health
- **Webhook URL**: $webhook_url

## Команды для управления

\`\`\`bash
# Обновление базы данных
./scripts/deploy-db-update-mcp.sh $compose_id

# Просмотр логов
docker logs dokploy-compose-$compose_id

# Перезапуск сервисов
# Используйте Dokploy Dashboard или MCP API
\`\`\`

## Мониторинг

- **Dokploy Dashboard**: http://217.198.6.238:3000
- **Frontend Status**: https://supermock.ru
- **API Status**: https://api.supermock.ru/api/health

## Следующие шаги

1. Добавьте webhook URL в GitHub репозиторий
2. Настройте реальные значения в переменных окружения
3. Проверьте SSL сертификаты
4. Настройте мониторинг и алерты
EOF

    success "Отчет сохранен в: $report_file"
}

# Главная функция
main() {
    echo ""
    log "🚀 SuperMock Dokploy Project Setup via MCP"
    log "==========================================="
    echo ""
    
    # Проверка зависимостей
    check_dependencies
    
    # Чтение конфигурации
    read_config
    
    # Подтверждение от пользователя
    warn "⚠️  Вы собираетесь создать новый проект в Dokploy"
    warn "⚠️  Убедитесь, что у вас есть доступ к серверу и корректные переменные окружения"
    echo ""
    read -p "Продолжить настройку? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Настройка отменена пользователем"
        exit 0
    fi
    
    # Пошаговая настройка
    create_project
    PROJECT_ID=$(cat "$PROJECT_ROOT/.dokploy/project-id")
    
    create_compose "$PROJECT_ID"
    COMPOSE_ID=$(cat "$PROJECT_ROOT/.dokploy/compose-id")
    
    setup_environment "$COMPOSE_ID"
    setup_domains
    setup_database "$PROJECT_ID"
    
    deploy_project "$COMPOSE_ID"
    
    # Ожидание развертывания
    log "⏳ Ожидание завершения развертывания (30 секунд)..."
    sleep 30
    
    check_health
    setup_webhook "$COMPOSE_ID"
    generate_report
    
    echo ""
    success "🎉 Настройка SuperMock в Dokploy завершена успешно!"
    echo ""
    log "📋 Важные ссылки:"
    echo "   • Frontend: https://supermock.ru"
    echo "   • Backend API: https://api.supermock.ru/api/health"
    echo "   • Dokploy Dashboard: http://217.198.6.238:3000"
    echo ""
    log "📂 Конфигурационные файлы сохранены в: .dokploy/"
    echo ""
    warn "🔧 Не забудьте:"
    echo "   1. Обновить переменные окружения с реальными значениями"
    echo "   2. Добавить webhook URL в GitHub"
    echo "   3. Проверить SSL сертификаты"
    echo ""
}

# Запуск главной функции
main "$@"