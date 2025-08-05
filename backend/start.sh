#!/bin/sh

echo "Starting SuperMock Backend..."

# Check if Prisma client exists
if [ ! -d "node_modules/.prisma/client" ]; then
    echo "❌ Prisma client not found. Generating..."
    npx prisma generate
fi

# Check if the default.js file exists
if [ ! -f "node_modules/.prisma/client/default.js" ]; then
    echo "❌ Prisma client default.js not found. Regenerating..."
    npx prisma generate
fi

echo "✅ Prisma client check completed"

# Wait for database to be ready
echo "🔄 Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
    echo "⏳ Database not ready, retrying in 5 seconds..."
    sleep 5
done

echo "✅ Database is ready and schema is up to date"

# Start the application
exec node dist/index.js 