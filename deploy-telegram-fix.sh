#!/bin/bash

echo "🚀 Deploying Telegram Auth Fix..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build

# Return to root
cd ..

# Deploy using dokploy compose
echo "🐳 Deploying with Docker Compose..."
docker-compose -f docker-compose.dokploy.yml down
docker-compose -f docker-compose.dokploy.yml up -d --build

echo "✅ Deployment completed!"
echo ""
echo "🔧 Changes applied:"
echo "  ✓ Fixed localhost hardcoding in Telegram bot"
echo "  ✓ Added NODE_ENV=production for proper environment detection"
echo "  ✓ Added interactive buttons instead of text links"
echo "  ✓ Now uses FRONTEND_URL environment variable properly"
echo ""
echo "🌐 URLs:"
echo "  - Frontend: https://supermock.ru"
echo "  - API: https://api.supermock.ru"
echo ""
echo "🤖 Telegram bot should now:"
echo "  - Work in production mode"
echo "  - Use https://supermock.ru instead of localhost"
echo "  - Show proper authorization buttons"