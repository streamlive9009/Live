# 🚨 Vercel Deployment Error Solutions

## Most Common Errors & Solutions

### 1. 🔴 **Build Failed - TypeScript Errors**

**Error Message:**
\`\`\`
Error: Build failed
Type error: Cannot find module '@/components/ui/button'
\`\`\`

**Solutions:**
\`\`\`bash
# 1. Check TypeScript locally
npm run type-check

# 2. Fix import paths
# Make sure all imports use correct paths
import { Button } from "@/components/ui/button"

# 3. Check tsconfig.json paths
# Ensure baseUrl and paths are configured correctly
\`\`\`

### 2. 🔴 **Module Not Found Error**

**Error Message:**
\`\`\`
Error: Cannot resolve module 'agora-rtc-sdk-ng'
\`\`\`

**Solutions:**
\`\`\`bash
# 1. Install missing dependency
npm install agora-rtc-sdk-ng

# 2. Check package.json
# Ensure all imports are in dependencies, not devDependencies

# 3. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### 3. 🔴 **Environment Variables Error**

**Error Message:**
\`\`\`
ReferenceError: process is not defined
\`\`\`

**Solutions:**
1. **Set in Vercel Dashboard:**
   - Go to vercel.com/dashboard
   - Select project → Settings → Environment Variables
   - Add: \`NEXT_PUBLIC_AGORA_APP_ID\` = \`1ebc9800868a4d51beaf76e6fddc47e4\`

2. **Redeploy after setting variables:**
   \`\`\`bash
   vercel --prod
   \`\`\`

### 4. 🔴 **Function Timeout Error**

**Error Message:**
\`\`\`
Error: Function execution timed out after 10s
\`\`\`

**Solutions:**
\`\`\`typescript
// Add timeout handling to API routes
export async function POST(request: NextRequest) {
  try {
    // Set timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    
    // Your API logic here
    
    clearTimeout(timeoutId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Request timeout" }, { status: 408 })
  }
}
\`\`\`

### 5. 🔴 **Font Loading Issues**

**Error Message:**
\`\`\`
Failed to load font: Inter
\`\`\`

**Solutions:**
- ✅ **Already optimized** in our deployment
- Next.js automatically optimizes Google Fonts
- Check browser console for specific errors

### 6. 🔴 **Agora SDK Errors**

**Error Message:**
\`\`\`
AgoraRTCError: INVALID_PARAMS
\`\`\`

**Solutions:**
1. **Check App ID:**
   \`\`\`typescript
   // Verify in lib/agora-config.ts
   export const AGORA_CONFIG = {
     appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "1ebc9800868a4d51beaf76e6fddc47e4"
   }
   \`\`\`

2. **Ensure HTTPS:**
   - Vercel automatically provides HTTPS
   - Agora requires secure context

### 7. 🔴 **Memory/Size Limits**

**Error Message:**
\`\`\`
Error: Function payload is too large
\`\`\`

**Solutions:**
\`\`\`json
// Add to vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
\`\`\`

## 🔧 Debug Commands

### Local Testing:
\`\`\`bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Test in development
npm run dev
\`\`\`

### Vercel Debugging:
\`\`\`bash
# Force redeploy (clears cache)
vercel --force

# Deploy with debug info
vercel --debug

# Check deployment logs
vercel logs [deployment-url]
\`\`\`

## 📞 Getting Help

### Check Deployment Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on failed deployment
4. View "Function Logs" tab

### Common Log Locations:
- **Build Logs:** Shows compilation errors
- **Function Logs:** Shows runtime errors
- **Edge Logs:** Shows routing issues

## 🎯 Quick Fixes Checklist

- [ ] Run \`npm run build\` locally first
- [ ] Check all imports are correct
- [ ] Verify environment variables are set
- [ ] Ensure dependencies are in package.json
- [ ] Check TypeScript compilation
- [ ] Test API routes locally
- [ ] Verify Agora App ID is correct
- [ ] Clear cache with \`vercel --force\`

## 🆘 Emergency Rollback

If deployment is completely broken:
\`\`\`bash
# Rollback to previous deployment
vercel rollback [previous-deployment-url]
\`\`\`
