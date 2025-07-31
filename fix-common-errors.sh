#!/bin/bash

echo "🔧 Auto-Fix Common Deployment Errors"
echo "===================================="

# Fix 1: Update dependencies
echo "📦 Updating dependencies..."
npm update

# Fix 2: Clear cache
echo "🧹 Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache

# Fix 3: Reinstall dependencies
echo "🔄 Reinstalling dependencies..."
npm ci

# Fix 4: Check for TypeScript errors
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Fix 5: Test build
echo "🏗️ Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ All fixes applied successfully!"
    echo "🚀 Ready to deploy with: vercel --prod"
else
    echo "❌ Some issues remain. Check the output above."
fi
