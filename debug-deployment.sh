#!/bin/bash

echo "🔧 LiveStream Platform Deployment Debugger"
echo "=========================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
        
        # Check if Node.js version is 18+
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
            echo -e "${YELLOW}💡 Update Node.js: https://nodejs.org/${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Node.js not found${NC}"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
    else
        echo -e "${RED}❌ npm not found${NC}"
        return 1
    fi
    
    # Check Vercel CLI
    if command -v vercel &> /dev/null; then
        VERCEL_VERSION=$(vercel --version)
        echo -e "${GREEN}✅ Vercel CLI: $VERCEL_VERSION${NC}"
    else
        echo -e "${RED}❌ Vercel CLI not found${NC}"
        echo -e "${YELLOW}💡 Install: npm install -g vercel${NC}"
        return 1
    fi
    
    return 0
}

# Function to test local build
test_local_build() {
    echo -e "${BLUE}🔨 Testing local build...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        echo -e "${YELLOW}💡 Make sure you're in the project root directory${NC}"
        return 1
    fi
    
    # Install dependencies
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        return 1
    fi
    
    # Run type check
    echo -e "${BLUE}🔍 Running type check...${NC}"
    npm run type-check 2>/dev/null || npx tsc --noEmit
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️ TypeScript errors found${NC}"
    fi
    
    # Test build
    echo -e "${BLUE}🏗️ Testing build...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Local build successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Local build failed${NC}"
        return 1
    fi
}

# Function to check Vercel authentication
check_vercel_auth() {
    echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
    
    if vercel whoami &> /dev/null; then
        USER=$(vercel whoami)
        echo -e "${GREEN}✅ Logged in as: $USER${NC}"
        return 0
    else
        echo -e "${RED}❌ Not logged in to Vercel${NC}"
        echo -e "${YELLOW}💡 Run: vercel login${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting deployment diagnostics...${NC}"
    echo ""
    
    if ! check_prerequisites; then
        echo -e "${RED}❌ Prerequisites check failed${NC}"
        exit 1
    fi
    
    echo ""
    if ! check_vercel_auth; then
        echo -e "${RED}❌ Authentication check failed${NC}"
        exit 1
    fi
    
    echo ""
    if ! test_local_build; then
        echo -e "${RED}❌ Local build check failed${NC}"
        echo -e "${YELLOW}💡 Fix local build issues before deploying${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment${NC}"
    echo -e "${BLUE}💡 Run: vercel --prod${NC}"
}

# Run main function
main
