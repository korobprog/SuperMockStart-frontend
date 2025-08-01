# SuperMock - Frontend с Redux и Backend с Prisma

Это приложение для моковых собеседований с интеграцией Redux Toolkit на фронтенде и Prisma ORM на бэкенде.

📖 **Подробные инструкции по разработке**: [DEV_SETUP.md](./DEV_SETUP.md)

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- PostgreSQL
- pnpm (рекомендуется)

### Установка и настройка

1. **Клонирование репозитория**

```bash
git clone <repository-url>
cd SuperMockStart/frontend
```

2. **Установка зависимостей**

```bash
# Установка зависимостей фронтенда
pnpm install

# Установка зависимостей бэкенда
cd backend
npm install
```

3. **Настройка базы данных**

Создайте файл `.env` в папке `backend`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/supermock?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
```

4. **Инициализация базы данных**

```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Запуск приложения**

```bash
# Вариант 1: Полный запуск с базой данных (рекомендуется)
# Windows:
.\start-dev.ps1

# Unix/macOS:
./start-dev.sh

# Вариант 2: Ручной запуск
pnpm dev:full:with-db

# Вариант 3: Запуск фронтенда и бэкенда (без БД)
pnpm dev:full

# Вариант 4: Запуск по отдельности
pnpm dev:backend  # Бэкенд
pnpm dev          # Фронтенд
```

**Доступные адреса:**

- **Фронтенд**: http://localhost:5174
- **Бэкенд API**: http://localhost:3001

## 📁 Структура проекта

### Backend (Prisma + Express)

```
backend/
├── prisma/
│   └── schema.prisma          # Схема базы данных
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── professionController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── prisma.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── professions.ts
│   │   └── index.ts
│   └── index.ts
└── package.json
```

### Frontend (React + Redux Toolkit)

```
src/
├── store/
│   ├── index.ts               # Redux store
│   ├── hooks.ts               # Типизированные хуки
│   └── slices/
│       └── professionSlice.ts # Slice для профессий
├── components/
│   ├── ui/                    # UI компоненты
│   ├── Navigation.tsx
│   ├── TelegramAuth.tsx
│   └── ProfessionHistory.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   └── Interview.tsx
└── App.tsx
```

## 🗄️ База данных

### Модели Prisma

#### User

- `id` - Уникальный идентификатор
- `telegramId` - ID пользователя в Telegram
- `username` - Имя пользователя
- `firstName` - Имя
- `lastName` - Фамилия
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

#### SelectedProfession

- `id` - Уникальный идентификатор
- `userId` - Ссылка на пользователя
- `profession` - Название выбранной профессии
- `createdAt` - Дата выбора

## 🔄 Redux Store

### Состояние профессий

```typescript
interface ProfessionState {
  selectedProfessions: SelectedProfession[];
  loading: boolean;
  error: string | null;
  currentProfession: string | null;
}
```

### Действия

- `addSelectedProfession` - Добавление выбранной профессии
- `fetchUserProfessions` - Загрузка профессий пользователя
- `removeSelectedProfession` - Удаление профессии
- `setCurrentProfession` - Установка текущей профессии

## 🛠️ API Endpoints

### Профессии

- `POST /api/professions/selected` - Добавить выбранную профессию
- `GET /api/professions/user/:userId` - Получить профессии пользователя
- `GET /api/professions/user/:userId/with-professions` - Получить пользователя с профессиями
- `DELETE /api/professions/selected/:id` - Удалить профессию

## 🎯 Функциональность

### Выбор профессии

1. Пользователь выбирает профессию из выпадающего списка
2. Выбор сохраняется в Redux store
3. Данные отправляются на бэкенд и сохраняются в базе данных
4. Отображается история выбранных профессий

### История профессий

- Отображение всех выбранных пользователем профессий
- Возможность удаления профессий
- Индикация загрузки и ошибок

## 🔧 Разработка

### Добавление новой профессии

1. Добавьте профессию в массив `itPositions` в `src/pages/Interview.tsx`
2. Профессия автоматически появится в выпадающем списке

### Изменение схемы базы данных

1. Отредактируйте `backend/prisma/schema.prisma`
2. Выполните миграцию:

```bash
cd backend
npx prisma db push
```

### Добавление новых API endpoints

1. Создайте контроллер в `backend/src/controllers/`
2. Добавьте маршруты в `backend/src/routes/`
3. Подключите маршруты в `backend/src/routes/index.ts`

## 🚀 Деплой

### Docker

```bash
# Сборка и запуск
docker-compose up --build
```

### Ручной деплой

1. Соберите фронтенд: `pnpm build`
2. Соберите бэкенд: `cd backend && npm run build`
3. Настройте переменные окружения
4. Запустите приложение

## 📝 Лицензия

MIT
