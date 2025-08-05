# 🚀 SuperMock Dokploy MCP - Быстрый старт

Это краткое руководство по быстрой настройке и развертыванию проекта SuperMock с использованием Dokploy MCP серверов.

## 📋 Быстрый чеклист

- [ ] Сервер с установленным Dokploy
- [ ] Настроенный MCP сервер для Dokploy
- [ ] Доступ к репозиторию GitHub
- [ ] SSH ключ для сервера

## ⚡ Быстрая настройка (5 минут)

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-repo/SuperMockStart.git
cd SuperMockStart/frontend
```

### 2. Настройка переменных окружения

```bash
# Скопируйте и отредактируйте файл переменных окружения
cp env.dokploy .env.production

# Обязательно обновите:
# - TELEGRAM_TOKEN (токен вашего Telegram бота)
# - JWT_SECRET (сгенерируйте надежный ключ)
# - DATABASE_URL (если отличается от стандартной)
```

### 3. Автоматическая настройка проекта

```bash
# Запустите автоматическую настройку
./scripts/setup-dokploy-project.sh
```

Этот скрипт автоматически:

- ✅ Создаст проект в Dokploy
- ✅ Настроит Docker Compose конфигурацию
- ✅ Установит переменные окружения
- ✅ Настроит домены и SSL
- ✅ Развернет базу данных PostgreSQL
- ✅ Запустит приложение
- ✅ Настроит webhook для автоматических обновлений

### 4. Проверка развертывания

```bash
# Проверьте API
curl https://api.supermock.ru/api/health

# Проверьте фронтенд
curl -I https://supermock.ru
```

## 🗄️ Обновление базы данных

### Автоматическое обновление

```bash
# Получите Compose ID из файла
COMPOSE_ID=$(cat .dokploy/compose-id)

# Запустите обновление БД
./scripts/deploy-db-update-mcp.sh $COMPOSE_ID
```

### Ручное обновление через MCP

```javascript
// Через Dokploy MCP API
await dokployMCP.compose.exec({
  composeId: 'your-compose-id',
  service: 'backend',
  command: 'npx prisma migrate deploy',
});

await dokployMCP.compose.exec({
  composeId: 'your-compose-id',
  service: 'backend',
  command: 'npx prisma generate',
});
```

## 🔄 Автоматические обновления

### GitHub Webhook

После настройки получите webhook URL:

```bash
cat .dokploy/webhook-url
```

Добавьте его в GitHub:

1. Repository → Settings → Webhooks
2. Add webhook
3. Payload URL: (ваш webhook URL)
4. Content type: `application/json`
5. Events: Push events

### GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Dokploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Dokploy Deploy
        run: |
          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_URL }}"
```

## 📊 Мониторинг

### Dokploy Dashboard

- **URL**: http://217.198.6.238:3000
- **Логи**: Реальное время для всех сервисов
- **Метрики**: CPU, Memory, Network, Disk

### Health Checks

- **Backend API**: https://api.supermock.ru/api/health
- **Frontend**: https://supermock.ru
- **Database**: Через Dokploy dashboard

### Команды для диагностики

```bash
# Просмотр логов через MCP
dokploy compose logs --id $COMPOSE_ID --service backend

# Проверка статуса сервисов
dokploy compose status --id $COMPOSE_ID

# Перезапуск сервиса
dokploy compose restart --id $COMPOSE_ID --service backend
```

## 🛠️ Управление через MCP

### Основные операции

```javascript
// Получение информации о проекте
const project = await dokployMCP.compose.one({
  composeId: 'your-compose-id',
});

// Остановка сервисов
await dokployMCP.compose.stop({
  composeId: 'your-compose-id',
});

// Запуск сервисов
await dokployMCP.compose.deploy({
  composeId: 'your-compose-id',
});

// Обновление переменных окружения
await dokployMCP.compose.saveEnvironment({
  composeId: 'your-compose-id',
  env: 'NODE_ENV=production\nPORT=3001',
});
```

### Работа с базой данных

```javascript
// Создание резервной копии
await dokployMCP.postgres.backup({
  postgresId: 'your-postgres-id',
});

// Выполнение SQL команд
await dokployMCP.compose.exec({
  composeId: 'your-compose-id',
  service: 'database',
  command: "psql -U postgres -d supermock -c 'SELECT COUNT(*) FROM users;'",
});
```

## 🚨 Решение проблем

### База данных не подключается

```bash
# Проверка статуса PostgreSQL
dokploy compose exec --service database -- pg_isready -U postgres

# Проверка логов базы данных
dokploy compose logs --service database --tail 50

# Перезапуск базы данных
dokploy compose restart --service database
```

### API не отвечает

```bash
# Проверка логов backend
dokploy compose logs --service backend --tail 100

# Проверка переменных окружения
dokploy compose env --list

# Принудительный перезапуск
dokploy compose stop && dokploy compose deploy
```

### Проблемы с SSL

```bash
# Проверка сертификатов
curl -vI https://supermock.ru

# Обновление сертификатов через Dokploy
# Используйте веб-интерфейс Dokploy для управления сертификатами
```

## 📁 Структура конфигурации

```
.dokploy/
├── config.json          # Основная конфигурация
├── project-id            # ID проекта в Dokploy
├── compose-id            # ID Docker Compose
├── webhook-url           # URL для GitHub webhook
└── setup-report.md       # Отчет о настройке
```

## 🔗 Полезные ссылки

- **Подробная документация**: [DOKPLOY_MCP_DEPLOYMENT.md](./DOKPLOY_MCP_DEPLOYMENT.md)
- **Frontend**: https://supermock.ru
- **API Health**: https://api.supermock.ru/api/health
- **Dokploy Dashboard**: http://217.198.6.238:3000
- **Context7 Dokploy**: Документация по MCP серверам

## 💡 Советы

1. **Переменные окружения**: Всегда используйте безопасные значения для production
2. **Backup**: Настройте автоматические резервные копии базы данных
3. **Мониторинг**: Регулярно проверяйте логи и метрики
4. **Security**: Регулярно обновляйте SSL сертификаты
5. **Updates**: Используйте автоматические обновления через webhook

---

✨ **Готово!** Ваше приложение SuperMock теперь развернуто в Dokploy с использованием MCP серверов.
