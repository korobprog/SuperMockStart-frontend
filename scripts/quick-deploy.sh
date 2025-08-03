#!/bin/bash

echo "⚡ Quick deploy - pushing changes only..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Проверяем, есть ли изменения
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to deploy"
    exit 0
fi

# Коммитим изменения
echo "💾 Committing changes..."
git add .
git commit -m "Quick deploy: $(date)"

# Пушим в Git
echo "📤 Pushing to Git..."
git push origin main

echo "✅ Quick deployment initiated!"
echo "🌐 Frontend: https://supermock.ru"
echo "🔗 API: https://api.supermock.ru"
echo ""
echo "⏳ Dokploy will automatically rebuild and deploy..." 