#!/bin/bash

# 🚀 Автоматическое развертывание SuperMock в Dokploy с аутентификацией
# Использование: DOKPLOY_TOKEN=your_token ./scripts/deploy-with-auth.sh

set -e

# Конфигурация
DOKPLOY_URL="${DOKPLOY_URL:-http://217.198.6.238:3000}"
PROJECT_NAME="SuperMock"
PROJECT_DESCRIPTION="Платформа для проведения технических собеседований"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Проверка токена
if [ -z "$DOKPLOY_TOKEN" ]; then
    error "DOKPLOY_TOKEN не установлен. Используйте: DOKPLOY_TOKEN=your_token $0"
fi

log "🚀 Начинаем развертывание SuperMock в Dokploy"
log "URL: $DOKPLOY_URL"

# 1. Создание проекта
log "📁 Создание проекта..."

PROJECT_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/trpc/project.create" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DOKPLOY_TOKEN" \
    -d "{\"json\":{\"name\":\"$PROJECT_NAME\",\"description\":\"$PROJECT_DESCRIPTION\"}}")

if echo "$PROJECT_RESPONSE" | grep -q "error"; then
    error "Ошибка создания проекта: $PROJECT_RESPONSE"
fi

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.result.data.json.projectId // .result.data.json.id' 2>/dev/null)

if [ "$PROJECT_ID" = "null" ] || [ -z "$PROJECT_ID" ]; then
    error "Не удалось получить ID проекта из ответа: $PROJECT_RESPONSE"
fi

success "Проект создан с ID: $PROJECT_ID"

# Сохраняем ID проекта
mkdir -p .dokploy
echo "$PROJECT_ID" > .dokploy/project-id

# 2. Создание Docker Compose конфигурации
log "🐳 Создание Docker Compose конфигурации..."

COMPOSE_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/trpc/compose.create" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DOKPLOY_TOKEN" \
    -d "{\"json\":{
        \"name\":\"supermock-compose\",
        \"projectId\":\"$PROJECT_ID\",
        \"sourceType\":\"git\",
        \"repository\":\"https://github.com/korobprog/SuperMockStart.git\",
        \"branch\":\"main\",
        \"composePath\":\"frontend/docker-compose.yml\"
    }}")

if echo "$COMPOSE_RESPONSE" | grep -q "error"; then
    error "Ошибка создания Compose: $COMPOSE_RESPONSE"
fi

COMPOSE_ID=$(echo "$COMPOSE_RESPONSE" | jq -r '.result.data.json.composeId // .result.data.json.id' 2>/dev/null)

if [ "$COMPOSE_ID" = "null" ] || [ -z "$COMPOSE_ID" ]; then
    error "Не удалось получить ID Compose из ответа: $COMPOSE_RESPONSE"
fi

success "Docker Compose создан с ID: $COMPOSE_ID"

# Сохраняем ID compose
echo "$COMPOSE_ID" > .dokploy/compose-id

# 3. Настройка переменных окружения
log "🌍 Настройка переменных окружения..."

# Читаем переменные из файла
ENV_CONTENT=""
if [ -f "env.dokploy" ]; then
    while IFS= read -r line; do
        # Пропускаем комментарии и пустые строки
        if [[ ! $line =~ ^[[:space:]]*# ]] && [[ -n "${line// }" ]]; then
            ENV_CONTENT+="$line\n"
        fi
    done < env.dokploy
else
    warn "Файл env.dokploy не найден, используем базовые переменные"
    ENV_CONTENT="NODE_ENV=production\nPORT=3001\nDATABASE_URL=postgresql://postgres:password@database:5432/supermock\n"
fi

ENV_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/trpc/compose.saveEnvironment" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DOKPLOY_TOKEN" \
    -d "{\"json\":{\"composeId\":\"$COMPOSE_ID\",\"env\":\"$ENV_CONTENT\"}}")

if echo "$ENV_RESPONSE" | grep -q "error"; then
    warn "Предупреждение при настройке переменных: $ENV_RESPONSE"
else
    success "Переменные окружения настроены"
fi

# 4. Развертывание
log "🚀 Запуск развертывания..."

DEPLOY_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/trpc/compose.deploy" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DOKPLOY_TOKEN" \
    -d "{\"json\":{\"composeId\":\"$COMPOSE_ID\"}}")

if echo "$DEPLOY_RESPONSE" | grep -q "error"; then
    error "Ошибка развертывания: $DEPLOY_RESPONSE"
fi

success "Развертывание запущено"

# 5. Ожидание завершения развертывания
log "⏳ Ожидание завершения развертывания (это может занять несколько минут)..."

for i in {1..30}; do
    sleep 10
    log "Проверка статуса ($i/30)..."
    
    # Проверяем статус через API health
    if curl -s --connect-timeout 5 "https://api.supermock.ru/api/health" | grep -q "ok"; then
        success "✅ API работает!"
        break
    elif [ $i -eq 30 ]; then
        warn "⚠️  API еще не отвечает, но развертывание может продолжаться"
    fi
done

# 6. Финальная проверка
log "🔍 Финальная проверка развертывания..."

echo ""
success "🎉 Развертывание SuperMock завершено!"
echo ""
log "📋 Информация о развертывании:"
echo "   • Project ID: $PROJECT_ID"
echo "   • Compose ID: $COMPOSE_ID"
echo "   • Frontend: https://supermock.ru"
echo "   • Backend API: https://api.supermock.ru/api/health"
echo "   • Dokploy Dashboard: $DOKPLOY_URL"
echo ""

log "🔗 Полезные команды:"
echo "   # Просмотр логов:"
echo "   curl -X GET '$DOKPLOY_URL/api/trpc/compose.logs' -H 'Authorization: Bearer \$DOKPLOY_TOKEN' -G -d 'composeId=$COMPOSE_ID'"
echo ""
echo "   # Обновление переменных окружения:"
echo "   curl -X POST '$DOKPLOY_URL/api/trpc/compose.saveEnvironment' -H 'Authorization: Bearer \$DOKPLOY_TOKEN' -d '{\"json\":{\"composeId\":\"$COMPOSE_ID\",\"env\":\"NEW_VAR=value\"}}'"
echo ""

# Создаем отчет
cat > .dokploy/deployment-report.md << EOF
# SuperMock Deployment Report

**Дата развертывания**: $(date)
**Project ID**: $PROJECT_ID
**Compose ID**: $COMPOSE_ID

## URLs
- Frontend: https://supermock.ru
- Backend API: https://api.supermock.ru/api/health
- Dokploy Dashboard: $DOKPLOY_URL

## Управление
- Докплой Dashboard: $DOKPLOY_URL
- Project: $DOKPLOY_URL/dashboard/project/$PROJECT_ID
- Compose: $DOKPLOY_URL/dashboard/project/$PROJECT_ID/services/compose/$COMPOSE_ID

## API Commands
\`\`\`bash
# Просмотр статуса
curl -X GET '$DOKPLOY_URL/api/trpc/compose.one' \\
  -H 'Authorization: Bearer \$DOKPLOY_TOKEN' \\
  -G -d 'composeId=$COMPOSE_ID'

# Перезапуск
curl -X POST '$DOKPLOY_URL/api/trpc/compose.redeploy' \\
  -H 'Authorization: Bearer \$DOKPLOY_TOKEN' \\
  -d '{"json":{"composeId":"$COMPOSE_ID"}}'
\`\`\`
EOF

success "Отчет сохранен в .dokploy/deployment-report.md"

echo ""
warn "🔧 Следующие шаги:"
echo "   1. Проверьте работу: https://api.supermock.ru/api/health"
echo "   2. Обновите переменные окружения с реальными значениями"
echo "   3. Настройте домены в Dokploy Dashboard"
echo "   4. Проверьте SSL сертификаты"
echo ""