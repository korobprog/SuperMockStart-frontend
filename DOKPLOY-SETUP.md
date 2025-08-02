# 🚀 SuperMock на Dokploy - Готово к деплою!

## Что было подготовлено

### ✅ Docker конфигурация

- **Dockerfile** для фронтенда (React + Vite)
- **Dockerfile** для бэкенда (Node.js + Express)
- **docker-compose.yml** для оркестрации
- **Health checks** для мониторинга

### ✅ Конфигурация Dokploy

- Настройки Traefik для маршрутизации
- SSL сертификаты через Let's Encrypt
- Переменные окружения
- Автоматические деплои

### ✅ Автоматизация

- GitHub Actions workflow
- Webhooks для автоматических деплоев
- Скрипты настройки базы данных

### ✅ Документация

- Подробные инструкции (DEPLOY.md)
- Краткое руководство (README-DEPLOY.md)
- Чек-лист (CHECKLIST.md)

## Быстрый старт

1. **Установите Dokploy:**

   ```bash
   curl -sSL https://dokploy.com/install.sh | sh
   ```

2. **Настройте переменные:**

   ```bash
   cp env.dokploy .env
   # Отредактируйте .env
   ```

3. **Создайте Docker Compose проект в Dokploy**

4. **Настройте домены:**
   - Фронтенд: `your-domain.com`
   - API: `api.your-domain.com`

## Структура файлов

```
├── Dockerfile                 # Фронтенд
├── backend/Dockerfile         # Бэкенд
├── docker-compose.yml        # Оркестрация
├── env.dokploy              # Переменные окружения
├── DEPLOY.md                # Подробные инструкции
├── README-DEPLOY.md         # Краткое руководство
├── CHECKLIST.md             # Чек-лист
└── .github/workflows/       # GitHub Actions
```

## Следующие шаги

1. Настройте сервер с Dokploy
2. Создайте Docker Compose проект
3. Настройте домены и переменные окружения
4. Выполните первый деплой
5. Проверьте работу приложения

## Поддержка

- 📖 [Подробные инструкции](./DEPLOY.md)
- ✅ [Чек-лист](./CHECKLIST.md)
- 🚀 [Быстрый старт](./README-DEPLOY.md)

---

**Проект готов к деплою на Dokploy! 🎉**
