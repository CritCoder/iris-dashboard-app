#!/bin/bash

echo "🧹 Clearing all caches and restarting server..."

# Kill any existing Next.js processes
echo "Killing existing Next.js processes..."
pkill -f "next dev" || true

# Clear all cache directories
echo "Clearing cache directories..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc
rm -rf .turbo

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Clear browser cache files (if they exist)
rm -rf .cache
rm -rf dist

echo "✅ All caches cleared!"

# Start the development server
echo "Starting development server..."
npm run dev
