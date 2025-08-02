#!/bin/bash

# Скрипт для настройки базы данных в продакшене
echo "Настройка базы данных..."

# Ждем, пока база данных будет готова
echo "Ожидание готовности базы данных..."
until npx prisma db push --accept-data-loss; do
  echo "База данных недоступна, ожидание..."
  sleep 2
done

# Генерируем Prisma клиент
echo "Генерация Prisma клиента..."
npx prisma generate

# Выполняем миграции
echo "Выполнение миграций..."
npx prisma migrate deploy

echo "База данных настроена успешно!" 