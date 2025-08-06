#!/bin/bash

echo "🔄 Пересборка проекта с обновленными стилями Tailwind CSS..."

# Остановка контейнеров
echo "📦 Остановка контейнеров..."
docker-compose down

# Очистка кэша
echo "🧹 Очистка кэша..."
rm -rf dist/
rm -rf node_modules/.cache/

# Установка зависимостей
echo "📦 Установка зависимостей..."
pnpm install

# Сборка проекта
echo "🔨 Сборка проекта..."
pnpm run build:prod

# Проверка, что CSS файл создан
if [ -f "dist/assets/index-B8QoS82d.css" ]; then
    echo "✅ CSS файл успешно создан"
    echo "📊 Размер CSS файла: $(du -h dist/assets/index-B8QoS82d.css | cut -f1)"
else
    echo "❌ CSS файл не найден!"
    exit 1
fi

# Запуск контейнеров
echo "🚀 Запуск контейнеров..."
docker-compose up -d

echo "✅ Деплой завершен!"
echo "🌐 Проверьте сайт: https://supermock.ru" 