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

# Копируем Prisma схему до установки зависимостей
COPY prisma ./prisma

# Устанавливаем зависимости (postinstall скрипт теперь найдет schema.prisma)
RUN pnpm install --frozen-lockfile --silent

# Копируем исходный код
COPY . .

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

# Копируем файлы зависимостей и Prisma схему
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Устанавливаем только production зависимости
RUN pnpm install --frozen-lockfile --prod --silent

# Копируем собранные файлы
COPY --from=build /app/dist ./dist

# Убеждаемся, что package.json скопирован для pnpm start
COPY --from=build /app/package.json ./package.json

# Копируем скрипт настройки базы данных
COPY scripts/setup-db.sh ./scripts/setup-db.sh
RUN chmod +x ./scripts/setup-db.sh

# Копируем скрипт инициализации базы данных
COPY scripts/init-db.sh ./scripts/init-db.sh
RUN chmod +x ./scripts/init-db.sh

# Копируем скрипт исправления базы данных
COPY scripts/fix-db.sh ./scripts/fix-db.sh
RUN chmod +x ./scripts/fix-db.sh

# Копируем и делаем исполняемым startup скрипт
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Меняем владельца директории приложения
RUN chown -R nodejs:nodejs /app

# Открываем порт 3001
EXPOSE 3001

# Переключаемся на пользователя nodejs
USER nodejs

# Запускаем приложение
CMD ["./start.sh"] 