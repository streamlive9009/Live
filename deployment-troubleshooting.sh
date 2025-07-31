#!/bin/bash

echo "🔧 LiveStream Platform Deployment Troubleshooting"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    echo "💡 Solution: cd to your project directory first"
    exit 1
fi

# Check if Vercel CLI is installed and logged in
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not installed"
    echo "💡 Solution: npm install -g vercel"
    exit 1
fi

if ! vercel whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Vercel"
    echo "💡 Solution: vercel login"
    exit 1
fi

echo "✅ All prerequisites met!"
echo "🚀 Running production deployment..."

# Run the deployment with error handling
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "1. ✅ Set environment variables in Vercel dashboard"
    echo "2. ✅ Test live streaming functionality"
    echo "3. ✅ Test chat functionality"
    echo "4. ✅ Verify mobile responsiveness"
else
    echo "❌ Deployment failed!"
    echo ""
    echo "🔧 Common solutions:"
    echo "1. Check build errors: npm run build"
    echo "2. Clear cache: vercel --force"
    echo "3. Check environment variables"
    echo "4. Verify all dependencies are installed"
fi
