# Многоэтапная сборка для бэкенда
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Suppress deprecation warnings during build
ENV NPM_CONFIG_LOGLEVEL=error
ENV PNPM_LOG_LEVEL=error
RUN corepack enable

# Этап сборки
FROM base AS build
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --silent

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем TypeScript
RUN pnpm run build

# Этап продакшн
FROM node:20-alpine AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Suppress deprecation warnings during build
ENV NPM_CONFIG_LOGLEVEL=error
ENV PNPM_LOG_LEVEL=error
RUN corepack enable

WORKDIR /app

# Устанавливаем только production зависимости
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --silent

# Копируем собранные файлы
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma

# Убеждаемся, что package.json скопирован для pnpm start
COPY --from=build /app/package.json ./package.json

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
CMD ["pnpm", "start"] 