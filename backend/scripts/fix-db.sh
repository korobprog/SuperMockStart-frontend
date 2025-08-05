#!/bin/sh

echo "🔧 Manual Database Fix for SuperMock"

# Check if we can connect to the database
echo "📡 Testing database connection..."
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database"
    exit 1
fi

# Force push the schema
echo "📝 Force pushing database schema..."
npx prisma db push --accept-data-loss --force-reset

# Deploy migrations
echo "📦 Deploying database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Verify tables exist
echo "🔍 Verifying database tables..."
if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'interview_queue', 'notifications');" | grep -q "3"; then
    echo "✅ All required tables exist"
else
    echo "❌ Required tables are missing"
    exit 1
fi

echo "✅ Database fix completed successfully!" 