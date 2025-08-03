#!/bin/bash

echo "🚀 Deploying SuperMock to server..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Собираем frontend
echo "📦 Building frontend..."
npm run build

# Собираем backend
echo "🔧 Building backend..."
cd backend
npm run build
cd ..

# Коммитим изменения
echo "💾 Committing changes..."
git add .
git commit -m "Auto-deploy: $(date)"

# Пушим в Git
echo "📤 Pushing to Git..."
git push origin main

echo "✅ Deployment initiated!"
echo "🌐 Frontend: https://supermock.ru"
echo "🔗 API: https://api.supermock.ru"
echo ""
echo "⏳ Waiting for deployment to complete..."
echo "You can monitor progress in GitHub Actions:"
echo "https://github.com/korobprog/SuperMockStart-frontend/actions" 