# Многоэтапная сборка для бэкенда
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Этап сборки
FROM base AS build
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем TypeScript
RUN npm run build

# Этап продакшн
FROM node:18-alpine AS production
WORKDIR /app

# Устанавливаем только production зависимости
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Копируем собранные файлы
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

# Копируем скрипт настройки базы данных
COPY scripts/setup-db.sh ./scripts/setup-db.sh
RUN chmod +x ./scripts/setup-db.sh

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Открываем порт 3001
EXPOSE 3001

# Переключаемся на пользователя nodejs
USER nodejs

# Запускаем приложение
CMD ["npm", "start"] 