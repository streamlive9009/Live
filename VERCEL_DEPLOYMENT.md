# 🚀 Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository with your code
- Agora App ID ready

## Step-by-Step Deployment

### 1. Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### 2. Login to Vercel
\`\`\`bash
vercel login
\`\`\`
- Choose your preferred login method (GitHub recommended)
- Complete authentication in browser

### 3. Configure Environment Variables

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - \`NEXT_PUBLIC_AGORA_APP_ID\` = your_agora_app_id
   - \`NEXT_PUBLIC_APP_URL\` = https://your-domain.vercel.app

#### Option B: Via CLI
\`\`\`bash
vercel env add NEXT_PUBLIC_AGORA_APP_ID
# Enter your Agora App ID when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Enter your domain URL when prompted
\`\`\`

### 4. Initial Deployment (Preview)
\`\`\`bash
vercel
\`\`\`
This will:
- Create a new project (if first time)
- Deploy to a preview URL
- Show you the preview link

### 5. Production Deployment
\`\`\`bash
vercel --prod
\`\`\`

## 🔧 Advanced Configuration

### Custom Domain Setup
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL certificate is automatically provisioned

### Performance Optimization
- ✅ **Automatic Edge Caching** - Static assets cached globally
- ✅ **Image Optimization** - Next.js Image component optimized
- ✅ **Font Optimization** - Google Fonts optimized automatically
- ✅ **Serverless Functions** - API routes auto-scaled

### Monitoring & Analytics
1. **Vercel Analytics** - Built-in performance monitoring
2. **Function Logs** - Real-time serverless function logs
3. **Deployment History** - Track all deployments

## 🚨 Troubleshooting

### Common Issues:

#### 1. Build Failures
\`\`\`bash
# Clear cache and redeploy
vercel --force
\`\`\`

#### 2. Environment Variables Not Working
- Check variable names start with \`NEXT_PUBLIC_\`
- Verify in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

#### 3. Domain Issues
- Verify DNS records are correct
- Wait for DNS propagation (up to 24 hours)
- Check SSL certificate status

#### 4. Agora Connection Issues
- Ensure HTTPS is enabled (required for WebRTC)
- Verify App ID is correct
- Check browser console for errors

## 📊 Deployment Checklist

- [ ] Vercel CLI installed
- [ ] Logged into Vercel account
- [ ] Environment variables configured
- [ ] Preview deployment successful
- [ ] Production deployment complete
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Agora streaming working
- [ ] Chat functionality working
- [ ] Mobile responsiveness verified

## 🎯 Post-Deployment Steps

1. **Test All Features:**
   - User registration
   - Live streaming (model panel)
   - Chat functionality
   - Mobile responsiveness

2. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor function execution times
   - Watch for errors in logs

3. **Set Up Monitoring:**
   - Configure error tracking
   - Set up uptime monitoring
   - Enable performance alerts

## 🔄 Continuous Deployment

### Automatic Deployments
- Connect GitHub repository to Vercel
- Every push to main branch auto-deploys to production
- Pull requests create preview deployments

### Manual Deployments
\`\`\`bash
# Deploy current directory
vercel --prod

# Deploy specific branch
vercel --prod --target production
\`\`\`

## 📈 Scaling Considerations

### Vercel Pro Features:
- **Increased Function Duration** - Up to 60 seconds
- **More Concurrent Executions** - Higher limits
- **Advanced Analytics** - Detailed performance metrics
- **Team Collaboration** - Multiple team members

### Performance Tips:
1. **Optimize Images** - Use Next.js Image component
2. **Minimize Bundle Size** - Remove unused dependencies
3. **Use Edge Functions** - For better global performance
4. **Enable Caching** - Proper cache headers set
