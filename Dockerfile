# Многоэтапная сборка для фронтенда
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Этап сборки
FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Отладка - проверяем структуру проекта
RUN echo "=== Project structure ===" && ls -la
RUN echo "=== Source directory ===" && ls -la src/ || echo "src directory not found"
RUN echo "=== Check package.json ===" && cat package.json | grep -A5 -B5 build
RUN echo "=== Check tsconfig.json ===" && cat tsconfig.json || echo "tsconfig.json not found"
RUN echo "=== Check vite.config.ts ===" && cat vite.config.ts || echo "vite.config.ts not found"

# Запускаем сборку только с Vite (без TypeScript проверки)
RUN pnpm run build:vite

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