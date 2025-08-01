-- Инициализация базы данных SuperMock
-- Этот файл выполняется при первом запуске PostgreSQL контейнера

-- Создание базы данных (если не существует)
-- CREATE DATABASE IF NOT EXISTS supermock;

-- Подключение к базе данных
-- \c supermock;

-- Создание расширений (если нужны)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Примечание: Prisma автоматически создаст таблицы на основе schema.prisma
-- Этот файл можно использовать для дополнительной инициализации данных

-- Пример создания дополнительных индексов или представлений
-- CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
-- CREATE INDEX IF NOT EXISTS idx_selected_professions_user_id ON selected_professions(user_id); 