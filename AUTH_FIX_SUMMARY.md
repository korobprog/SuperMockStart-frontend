# Исправление проблем с авторизацией SuperMock

## Обнаруженные проблемы

### 1. 404 ошибка на `/api/auth/session`
**Проблема**: Фронтенд обращается к `https://api.supermock.ru/api/auth/session`, но запросы не достигают бэкенда.

**Причина**: В конфигурации Traefik для бэкенда было указано правило:
```yaml
- traefik.http.routers.supermock-backend.rule=Host(`api.supermock.ru`) && PathPrefix(`/api`)
```

Это приводило к дублированию `/api` в пути: `/api/api/auth/session`

**Исправление**: Убрано условие `PathPrefix(/api)` из правил маршрутизации Traefik:
```yaml
- traefik.http.routers.supermock-backend.rule=Host(`api.supermock.ru`)
```

### 2. Проблема с валидацией Telegram виджета
**Проблема**: Логи показывают "Widget data hash validation failed"

**Причины**:
- Отсутствие COOKIE_DOMAIN для корректной работы cookies между доменами
- Недостаточное логирование для отладки проблемы с валидацией

**Исправления**:
1. Добавлена переменная `COOKIE_DOMAIN=.supermock.ru` в конфигурацию Docker Compose
2. Улучшено логирование в функции `validateWidgetData` для отладки

## Внесенные изменения

### 1. `docker-compose.dokploy.yml`
- Убраны `PathPrefix(/api)` из правил маршрутизации Traefik
- Добавлена переменная окружения `COOKIE_DOMAIN=.supermock.ru`

### 2. `backend/src/utils/telegram.ts`
- Добавлено подробное логирование в функцию `validateWidgetData`
- Улучшена отладочная информация для диагностики проблем с валидацией

### 3. Создан скрипт развертывания
- `deploy-auth-fix.sh` - скрипт для обновления и перезапуска сервисов

## Инструкции по развертыванию

1. Выполните скрипт развертывания:
```bash
./deploy-auth-fix.sh
```

2. Или выполните команды вручную:
```bash
# Остановка контейнеров
docker compose -f docker-compose.dokploy.yml down

# Сборка обновленных образов
docker compose -f docker-compose.dokploy.yml build --no-cache

# Запуск контейнеров
docker compose -f docker-compose.dokploy.yml up -d
```

3. Проверьте логи для подтверждения исправления:
```bash
# Логи бэкенда
docker compose -f docker-compose.dokploy.yml logs -f backend

# Логи фронтенда
docker compose -f docker-compose.dokploy.yml logs -f frontend
```

## Проверка исправлений

### Тест 1: Проверка эндпоинта `/api/auth/session`
```bash
curl -s https://api.supermock.ru/api/auth/session
```
Ожидаемый результат: `{"success":true,"data":{"authenticated":false,"user":null}}`

### Тест 2: Проверка здоровья API
```bash
curl -s https://api.supermock.ru/api/health
```
Ожидаемый результат: статус 200 с информацией о сервисах

### Тест 3: Проверка авторизации через Telegram
1. Перейти на https://supermock.ru/login
2. Нажать кнопку "Login with Telegram"
3. Проверить логи бэкенда на предмет подробной отладочной информации

## Дополнительные рекомендации

1. **Мониторинг логов**: После развертывания следите за логами бэкенда для получения отладочной информации о валидации Telegram виджета.

2. **Проверка cookies**: Убедитесь, что cookies устанавливаются корректно с доменом `.supermock.ru`.

3. **Тестирование**: Протестируйте авторизацию как в web-версии, так и в Telegram Mini App.

## Контакты для поддержки

При возникновении проблем:
1. Проверьте логи контейнеров
2. Убедитесь, что все сервисы запущены
3. Проверьте доступность эндпоинтов через curl

---

*Дата создания: $(date)*
*Автор: Claude AI Assistant*