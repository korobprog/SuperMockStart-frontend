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

# Wait for database to be ready and set up schema
echo "🔄 Setting up database schema..."

# Try to push the schema first (for fresh databases)
echo "📝 Pushing database schema..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database schema pushed successfully"
else
    echo "⚠️  Schema push failed, trying migrations..."
    # If push fails, try to run migrations
    if npx prisma migrate deploy; then
        echo "✅ Database migrations deployed successfully"
    else
        echo "❌ Database setup failed. Exiting..."
        exit 1
    fi
fi

echo "✅ Database is ready and schema is up to date"

# Start the application
exec node dist/index.js 