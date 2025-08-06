# Многоэтапная сборка для фронтенда
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Этап сборки
FROM base AS build
WORKDIR /app

# Принимаем build arguments
ARG VITE_API_URL=https://api.supermock.ru
ARG VITE_TELEGRAM_BOT_USERNAME=SuperMock_bot

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Копируем продакшн переменные окружения
COPY env.prod .env

# Устанавливаем переменные окружения для сборки
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_TELEGRAM_BOT_USERNAME=${VITE_TELEGRAM_BOT_USERNAME}
ENV NODE_ENV=production

# Запускаем продакшн сборку
RUN pnpm run build:prod

# Этап продакшн
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Копируем собранные файлы
COPY --from=build /app/dist .

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"] 