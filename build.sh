#!/bin/bash

echo "🚀 Building Personal Financial Tracker for Vercel..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed"
  exit 1
fi
cd ..

echo "✅ Frontend built successfully"
echo "✅ Backend code is ready in /api"
echo ""
echo "📋 Deployment checklist:"
echo "  1. Update .env with your production values"
echo "  2. Push to GitHub/GitLab/Bitbucket"
echo "  3. Deploy to Vercel"
echo "  4. Set environment variables in Vercel dashboard"
echo ""
echo "🎉 Ready for deployment!"
