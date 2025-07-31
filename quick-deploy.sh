#!/bin/bash

echo "🚀 Quick Deploy Script for LiveStream Platform"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Vercel CLI installed successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Please log in to Vercel...${NC}"
    vercel login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to log in to Vercel${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Already logged in to Vercel${NC}"
fi

# Check for environment variables
echo -e "${BLUE}⚙️ Checking environment variables...${NC}"
if [ -z "$NEXT_PUBLIC_AGORA_APP_ID" ] && [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️ Warning: NEXT_PUBLIC_AGORA_APP_ID not found${NC}"
    echo -e "${YELLOW}Please set up your environment variables in Vercel dashboard after deployment${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

# Build the project locally first
echo -e "${BLUE}🔨 Building project locally...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Local build successful!${NC}"

# Deploy to preview first
echo -e "${BLUE}🔍 Deploying to preview environment...${NC}"
vercel
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Preview deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Preview deployment successful!${NC}"
echo -e "${YELLOW}🔗 Check the preview URL above to test your application${NC}"

# Ask for production deployment
echo ""
read -p "🌟 Deploy to production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Deploying to production...${NC}"
    vercel --prod
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 Production deployment successful!${NC}"
        echo -e "${GREEN}✨ Your LiveStream Platform is now live!${NC}"
        echo ""
        echo -e "${BLUE}📋 Next Steps:${NC}"
        echo "1. Set up your custom domain in Vercel dashboard (optional)"
        echo "2. Configure environment variables if not done already"
        echo "3. Test all features on your live site"
        echo "4. Set up monitoring and analytics"
    else
        echo -e "${RED}❌ Production deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏸️ Production deployment skipped${NC}"
    echo -e "${BLUE}💡 You can deploy to production later with: vercel --prod${NC}"
fi

echo ""
echo -e "${GREEN}🎊 Deployment process complete!${NC}"
