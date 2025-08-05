#!/bin/sh

echo "Setting up database..."

# Wait for database to be ready
echo "Waiting for database connection..."
until npx prisma db push --accept-data-loss; do
    echo "Database not ready, retrying in 5 seconds..."
    sleep 5
done

echo "Database schema is up to date"

# Run migrations if needed
echo "Running database migrations..."
npx prisma migrate deploy

echo "Database setup completed" 