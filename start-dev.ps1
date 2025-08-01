# PowerShell скрипт для запуска разработки
Write-Host "🚀 Запуск SuperMock в режиме разработки..." -ForegroundColor Green

# Проверяем Docker
Write-Host "📦 Проверка Docker..." -ForegroundColor Yellow
try {
    docker info > $null 2>&1
    Write-Host "✅ Docker доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не запущен. Запускаем Docker Desktop..." -ForegroundColor Red
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "⏳ Ждем запуска Docker Desktop..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Проверяем снова
try {
    docker info > $null 2>&1
    Write-Host "✅ Docker готов к работе" -ForegroundColor Green
} catch {
    Write-Host "❌ Не удалось запустить Docker. Используйте локальную установку PostgreSQL." -ForegroundColor Red
    Write-Host "💡 Установите PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    exit 1
}

# Запускаем базу данных
Write-Host "🗄️ Запуск PostgreSQL..." -ForegroundColor Yellow
pnpm dev:db

# Ждем запуска базы данных
Write-Host "⏳ Ожидание запуска базы данных..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Настраиваем базу данных
Write-Host "🔧 Настройка базы данных..." -ForegroundColor Yellow
pnpm db:setup

# Запускаем приложение
Write-Host "🎯 Запуск приложения..." -ForegroundColor Yellow
pnpm dev:full:with-db

Write-Host "🎉 Готово! Приложение запущено:" -ForegroundColor Green
Write-Host "   🌐 Фронтенд: http://localhost:5174" -ForegroundColor Cyan
Write-Host "   🔧 Бэкенд: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   🗄️ База данных: localhost:5432" -ForegroundColor Cyan 