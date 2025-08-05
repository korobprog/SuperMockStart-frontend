#!/bin/sh

echo "🚀 Starting SuperMock Backend..."

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

# Test database connection first
echo "📡 Testing database connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Testing database connection..."
    if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
        echo "✅ Database connection successful"
        break
    else
        echo "⏳ Database not ready, retrying in 3 seconds..."
        sleep 3
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Failed to connect to database after $max_attempts attempts"
    exit 1
fi

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

# Verify tables exist
echo "🔍 Verifying database tables..."
table_check=$(npx prisma db execute --stdin << EOF
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'interview_queue', 'notifications');
EOF
)

if echo "$table_check" | grep -q "3"; then
    echo "✅ All required tables exist"
else
    echo "❌ Required tables are missing. Database setup failed."
    echo "Found tables: $table_check"
    exit 1
fi

echo "✅ Database is ready and schema is up to date"

# Start the application
echo "🚀 Starting application..."
exec node dist/index.js 