#!/bin/sh

echo "🔄 Force Resetting SuperMock Database..."

# Check database connection
echo "📡 Testing database connection..."
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database"
    exit 1
fi

# Force reset the database
echo "🗑️  Force resetting database..."
if npx prisma migrate reset --force; then
    echo "✅ Database reset successful"
else
    echo "❌ Database reset failed"
    exit 1
fi

# Deploy all migrations
echo "📦 Deploying all migrations..."
if npx prisma migrate deploy; then
    echo "✅ All migrations deployed successfully"
else
    echo "❌ Migration deployment failed"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Verify all required tables exist
echo "🔍 Verifying all tables exist..."
required_tables="users interview_queue notifications interview_sessions interviews feedbacks selected_professions user_form_data"

for table in $required_tables; do
    table_exists=$(npx prisma db execute --stdin << EOF
SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$table';
EOF
    )
    if echo "$table_exists" | grep -q "1"; then
        echo "✅ Table '$table' exists"
    else
        echo "❌ Table '$table' is missing"
        exit 1
    fi
done

echo "✅ Database reset completed successfully!"
echo "🚀 All tables are ready for use" 