#!/bin/sh

echo "🔍 Database Diagnostic Script"

# Check database connection
echo "📡 Testing database connection..."
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database"
    exit 1
fi

# Check if tables exist
echo "📋 Checking existing tables..."
npx prisma db execute --stdin << EOF
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF

# Check migration status
echo "📦 Checking migration status..."
npx prisma migrate status

# Check if specific tables exist
echo "🔍 Checking required tables..."
table_status=$(npx prisma db execute --stdin << EOF
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN '✅' ELSE '❌' END as users,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_queue') THEN '✅' ELSE '❌' END as interview_queue,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN '✅' ELSE '❌' END as notifications;
EOF
)
echo "$table_status"

echo "🔍 Database diagnostic completed" 