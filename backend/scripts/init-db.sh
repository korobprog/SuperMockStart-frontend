#!/bin/sh

echo "🚀 Initializing SuperMock Database..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db push --accept-data-loss > /dev/null 2>&1; do
    echo "⏳ Database not ready, retrying in 3 seconds..."
    sleep 3
done

echo "✅ Database connection established"

# Push the schema
echo "📝 Pushing database schema..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Schema pushed successfully"
else
    echo "⚠️  Schema push failed, trying migrations..."
    if npx prisma migrate deploy; then
        echo "✅ Migrations deployed successfully"
    else
        echo "❌ Database initialization failed"
        exit 1
    fi
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Database initialization completed successfully!" 