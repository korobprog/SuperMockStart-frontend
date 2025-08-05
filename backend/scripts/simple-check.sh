#!/bin/sh

echo "🔍 Simple Database Check"

# Check database connection
echo "📡 Testing database connection..."
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database"
    exit 1
fi

# Try to query each required table
echo "🔍 Checking required tables..."

# Check users table
if npx prisma db execute --stdin << EOF
SELECT 1 FROM users LIMIT 1;
EOF
> /dev/null 2>&1; then
    echo "✅ users table exists"
else
    echo "❌ users table missing"
fi

# Check interview_queue table
if npx prisma db execute --stdin << EOF
SELECT 1 FROM interview_queue LIMIT 1;
EOF
> /dev/null 2>&1; then
    echo "✅ interview_queue table exists"
else
    echo "❌ interview_queue table missing"
fi

# Check notifications table
if npx prisma db execute --stdin << EOF
SELECT 1 FROM notifications LIMIT 1;
EOF
> /dev/null 2>&1; then
    echo "✅ notifications table exists"
else
    echo "❌ notifications table missing"
fi

echo "🔍 Database check completed" 