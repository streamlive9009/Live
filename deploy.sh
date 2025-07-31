#!/bin/bash

echo "🚀 Starting LiveStream Platform Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

# Set up environment variables
echo "⚙️ Setting up environment variables..."
echo "Please make sure you have your Agora App ID ready!"

# Deploy to preview first
echo "🔍 Deploying to preview environment..."
vercel

# Ask for confirmation before production deployment
read -p "✅ Preview deployment successful? Deploy to production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Deploying to production..."
    vercel --prod
    echo "🎉 Production deployment complete!"
else
    echo "⏸️ Production deployment cancelled."
fi

echo "✨ Deployment process finished!"
