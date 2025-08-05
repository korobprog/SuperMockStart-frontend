#!/bin/sh

echo "🚀 Initializing SuperMock Database..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db push --accept-data-loss > /dev/null 2>&1; do
    echo "⏳ Database not ready, retrying in 3 seconds..."
    sleep 3
done

echo "✅ Database connection established"

# Check if database is empty
echo "🔍 Checking if database is empty..."
table_count=$(npx prisma db execute --url "$DATABASE_URL" --stdin << EOF
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
EOF
)
table_count=$(echo "$table_count" | tail -n 1 | tr -d ' ')

if [ "$table_count" = "0" ]; then
    echo "📝 Database is empty, pushing schema..."
    if npx prisma db push --accept-data-loss; then
        echo "✅ Schema pushed successfully"
    else
        echo "❌ Schema push failed"
        exit 1
    fi
else
    echo "📦 Database has existing tables, pushing schema..."
    if npx prisma db push --accept-data-loss; then
        echo "✅ Schema pushed successfully"
    else
        echo "❌ Schema push failed"
        exit 1
    fi
fi

# Verify all required tables exist
echo "🔍 Verifying required tables..."
required_tables="users interview_queue notifications interview_sessions interviews feedbacks selected_professions user_form_data"

for table in $required_tables; do
    table_exists=$(npx prisma db execute --url "$DATABASE_URL" --stdin << EOF
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

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Database initialization completed successfully!" 