# Cloudflare Pages Deployment Guide

## Overview

Your `aldjan.com` portfolio is now configured for **Cloudflare Pages** with Workers support.

---

## 🔧 Setup Instructions

### Step 1: Get Cloudflare Credentials

1. **Go to Cloudflare Dashboard**
   - Login at https://dash.cloudflare.com

2. **Get Account ID**
   - Right sidebar → "Accounts" → Copy your Account ID

3. **Create API Token**
   - Settings (bottom left) → API Tokens
   - Create Token → Use "Edit Cloudflare Workers" template
   - Copy the token

### Step 2: Add GitHub Secrets

1. **Go to GitHub Repository**
   - Settings → Secrets and variables → Actions

2. **Add two secrets:**
   - `CLOUDFLARE_ACCOUNT_ID` = Your Account ID
   - `CLOUDFLARE_API_TOKEN` = Your API Token

### Step 3: Create Cloudflare Pages Project

1. **In Cloudflare Dashboard**
   - Pages (left sidebar) → Create a project → Connect to Git

2. **Select Repository**
   - Select `aldjan.com` repository
   - Authorize Cloudflare with GitHub

3. **Configure Build**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Click "Save and Deploy"

4. **Configure Custom Domain**
   - Pages → aldjan-portfolio project
   - Custom domain → Add custom domain
   - Enter `aldjan.com`
   - Approve the CNAME validation

---

## 📁 Project Files

### New Cloudflare Files
```
wrangler.toml                    # Cloudflare Workers configuration
functions/index.ts              # Worker request handler
functions/_middleware.ts        # Middleware configuration
```

### Updated Files
```
.github/workflows/deploy.yml    # Now deploys to Cloudflare Pages
package.json                    # Added wrangler dependency
```

---

## 🚀 Deployment Process

### Automatic (Recommended)
```
1. Push to main branch
   ↓
2. GitHub Actions triggers
   ↓
3. npm install & npm run build
   ↓
4. Deploy to Cloudflare Pages
   ↓
5. Available at https://aldjan.com
```

### Manual Deployment
```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run pages:build
```

---

## 🔒 Worker Features

The `functions/index.ts` Worker handles:

✅ **Static Asset Routing**
- `/assets/*` → Served directly
- Images, CSS, JS served from cache

✅ **SPA Fallback**
- All routes → `index.html`
- React Router handles client-side navigation

✅ **Security Headers** (can be added)
- CORS headers
- Security headers
- Cache control

✅ **API Routing** (optional)
- Can add custom API routes in `functions/`
- Example: `functions/api/contact.ts`

---

## 📊 Build Output

Your build is optimized for Cloudflare:

| File | Size | Cached |
|------|------|--------|
| dist/index.html | 1.03 kB | Yes |
| dist/assets/favicon | 15.41 kB | Yes |
| dist/assets/index.css | 2.81 kB | Yes |
| dist/assets/index.js | 19.69 kB | Yes |
| dist/assets/react-vendor | 139.45 kB | Yes |

All files are automatically cached by Cloudflare's CDN.

---

## 🌍 Cloudflare CDN Benefits

✅ **Global CDN** - 200+ data centers worldwide  
✅ **Automatic Caching** - Assets cached globally  
✅ **DDoS Protection** - Built-in security  
✅ **Automatic HTTPS** - SSL/TLS certificates  
✅ **Page Rules** - Custom caching rules  
✅ **Analytics** - Built-in performance metrics  

---

## 🔧 Adding Custom Workers

### Example: Contact Form Handler

Create `functions/api/contact.ts`:
```typescript
export const onRequest: PagesFunction = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const data = await context.request.json();
  
  // Forward to Formspree or your backend
  const response = await fetch('https://formspree.io/f/mgvgzlbl', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Accept': 'application/json' }
  });

  return response;
};
```

Then update your contact form to POST to `/api/contact`.

---

## 📋 GitHub Secrets Setup

Your workflow needs these secrets to deploy:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Your API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Account ID |

**To Add:**
1. GitHub → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the secrets above

---

## 🚀 Go Live Steps

### 1. Configure Credentials
```bash
# Set GitHub secrets (see above)
# CLOUDFLARE_API_TOKEN
# CLOUDFLARE_ACCOUNT_ID
```

### 2. Create Cloudflare Project
- Dashboard → Pages → Connect to Git
- Select aldjan.com repository
- Build: `npm run build`
- Output: `dist`

### 3. Deploy
```bash
git add .
git commit -m "Configure for Cloudflare Pages"
git push origin main
```

### 4. Monitor
- GitHub → Actions tab
- Cloudflare → Pages tab
- Should be live in ~2 minutes

### 5. Verify
- Visit https://aldjan.com
- Check Cloudflare Analytics
- Monitor performance

---

## 📊 Monitoring & Analytics

### Cloudflare Dashboard
- **Pages** → Your project → Analytics
- View requests, caching, errors
- Performance metrics

### GitHub Actions
- **Actions** tab → Deployment workflow
- Build logs and deploy status
- Rollback if needed

---

## 🔄 Updating Your Site

### Standard Update Process
```bash
# Make changes
git add .
git commit -m "Update portfolio"
git push origin main

# Cloudflare Pages automatically:
# 1. Builds your site
# 2. Deploys to CDN
# 3. Goes live instantly
```

### Rollback if Needed
- Cloudflare → Pages → Deployments
- Click "Rollback" on previous version
- Instant rollback to previous deployment

---

## 🆚 Cloudflare vs GitHub Pages

| Feature | Cloudflare Pages | GitHub Pages |
|---------|------------------|--------------|
| **CDN** | Global (200+ DC) | GitHub's CDN |
| **Workers** | Yes | No |
| **Analytics** | Built-in | No |
| **DDoS Protection** | Yes | Yes |
| **Custom Domain** | Yes | Yes |
| **HTTPS** | Automatic | Automatic |
| **Cache Control** | Advanced | Limited |

---

## 🔐 Security

✅ HTTPS enforced  
✅ DDoS protection built-in  
✅ No API tokens in repository  
✅ Secrets stored in GitHub  
✅ Form submissions via Formspree  

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Docs](https://docs.github.com/actions)

---

## 🎯 Next Steps

1. ✅ Get Cloudflare Account ID and API Token
2. ✅ Add secrets to GitHub
3. ✅ Create Cloudflare Pages project
4. ✅ Push code to main branch
5. ✅ Monitor deployment in Actions tab
6. ✅ Verify at aldjan.com

---

**Status**: Ready for Cloudflare Pages Deployment ✅
