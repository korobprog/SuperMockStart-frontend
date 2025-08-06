# 🚀 Развертывание SuperMock в продакшене

## 📋 Обзор проблемы и решения

### Проблема

- Отсутствие стилей на продакшен сервере
- CSS файлы не раздавались правильно через nginx

### Решение

1. **Обновлена конфигурация Vite** для правильной генерации CSS в продакшене
2. **Исправлена конфигурация nginx** для корректной раздачи статических файлов
3. **Обновлен Dockerfile** для передачи переменных окружения при сборке
4. **Создана конфигурация Docker Compose** для Dokploy

## 🛠️ Внесенные изменения

### 1. Конфигурация Vite (`vite.config.prod.ts`)

```typescript
build: {
  outDir: 'dist',
  sourcemap: false,
  cssCodeSplit: false,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label'],
      },
      assetFileNames: (assetInfo) => {
        if (assetInfo.name.endsWith('.css')) {
          return 'assets/[name]-[hash][extname]';
        }
        return 'assets/[name]-[hash][extname]';
      },
    },
  },
}
```

### 2. Конфигурация nginx (`nginx.conf`)

- Добавлена поддержка MIME типов для CSS файлов
- Расширен список статических файлов для кеширования

### 3. Dockerfile для фронтенда

- Добавлена поддержка build arguments для переменных окружения
- Используется продакшн конфигурация Vite

### 4. Docker Compose для Dokploy (`docker-compose.dokploy.yml`)

- Настроена интеграция с Traefik
- Использованы правильные пути для volumes согласно документации Dokploy
- Упрощены labels для Traefik

## 📦 Развертывание

### Первоначальная настройка

```bash
# Инициализация проекта на сервере
./scripts/init-dokploy-project.sh
```

### Обновление кода

```bash
# Быстрое обновление
./scripts/quick-deploy-dokploy.sh
```

### Ручное развертывание через SSH

```bash
# Подключение к серверу
ssh -i ~/.ssh/timeweb_vps_key root@217.198.6.238

# Переход в директорию проекта
cd /root/supermock

# Остановка старых контейнеров
docker-compose down

# Сборка и запуск новых
docker-compose build --no-cache
docker-compose up -d

# Проверка статуса
docker-compose ps
docker-compose logs --tail=50
```

## 🔍 Проверка работы

1. **Frontend**: https://supermock.ru

   - Должны отображаться все стили
   - Проверить загрузку CSS файлов в DevTools

2. **Backend**: https://api.supermock.ru/api

   - Проверить доступность API endpoints

3. **Проверка логов**:

```bash
# На сервере
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

## 🛡️ Безопасность

### ⚠️ ВАЖНО: Необходимо обновить следующие данные:

1. **JWT_SECRET** в `docker-compose.dokploy.yml`
2. **Пароль базы данных** в `docker-compose.dokploy.yml`
3. **Telegram токен** (если изменился)

### Рекомендации:

- Использовать переменные окружения вместо хардкода
- Настроить GitHub Secrets для автоматического деплоя
- Регулярно обновлять зависимости

## 📊 Мониторинг

### Проверка использования ресурсов:

```bash
docker stats
```

### Проверка дискового пространства:

```bash
df -h
docker system df
```

### Очистка при необходимости:

```bash
docker system prune -a
docker image prune -a
```

## 🚨 Устранение неполадок

### Если стили не загружаются:

1. Проверить, что CSS файлы генерируются при сборке
2. Проверить права доступа к файлам в контейнере
3. Проверить логи nginx: `docker-compose logs frontend`

### Если база данных не доступна:

1. Проверить health check: `docker-compose ps`
2. Проверить логи: `docker-compose logs database`
3. Убедиться, что volume монтируется правильно

### Если Traefik не работает:

1. Проверить, что сеть `dokploy-network` существует
2. Проверить labels в docker-compose.yml
3. Проверить логи Traefik на сервере Dokploy

## 📝 Заметки

- Проект использует Dokploy/Coolify для управления деплоем
- Все volumes монтируются через `../files/` согласно документации Dokploy
- SSL сертификаты управляются через Let's Encrypt автоматически
- База данных PostgreSQL 16 с persistent storage
