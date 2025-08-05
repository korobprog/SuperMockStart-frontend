#!/bin/sh

echo "🔧 Quick Database Setup for SuperMock"

# Check if we can connect to the database
echo "📡 Testing database connection..."
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database. Please check:"
    echo "   - Database is running"
    echo "   - DATABASE_URL is correct"
    echo "   - Network connectivity"
    exit 1
fi

# Deploy migrations
echo "📦 Deploying database migrations..."
if npx prisma migrate deploy; then
    echo "✅ Migrations deployed successfully"
else
    echo "❌ Migration deployment failed"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Database setup completed successfully!"
echo "🚀 You can now start the application" 