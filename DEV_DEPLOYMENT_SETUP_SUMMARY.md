# 🚀 Deploy to dev.aldjan.com - Summary

## What You Need to Do (Super Simple)

### 1. Create Another Cloudflare Pages Project (3 minutes)

```
https://dash.cloudflare.com
  ↓
Pages
  ↓
Create a project
  ↓
Connect to Git → Select aldjan.com repo
  ↓
Build command: npm run build
Build output: dist
  ↓
Save and Deploy
  ↓
Project created as: aldjan-portfolio-dev
```

### 2. Add DNS Record (2 minutes)

**If using Cloudflare DNS:**
```
Your domain → DNS
  ↓
Add record
  ↓
Type: CNAME
Name: dev
Content: aldjan-portfolio-dev.pages.dev
```

**If using external DNS (GoDaddy, Namecheap, etc):**
```
Add DNS record:
Subdomain: dev
Type: CNAME
Value: aldjan-portfolio-dev.pages.dev
```

### 3. That's It! (0 minutes)

Push to dev branch → it auto-deploys to dev.aldjan.com

```bash
git push origin dev
```

---

## How It Works Now

```
MAIN BRANCH                    DEV BRANCH
    ↓                              ↓
 Push to main              Push to dev
    ↓                              ↓
GitHub Actions             GitHub Actions
    ↓                              ↓
Deploy to                  Deploy to
aldjan-portfolio           aldjan-portfolio-dev
    ↓                              ↓
aldjan.com ✅              dev.aldjan.com ✅
```

---

## The Files I Updated

✅ `.github/workflows/deploy.yml` - Now has TWO deploy steps:
- main branch → aldjan-portfolio project
- dev branch → aldjan-portfolio-dev project

✅ Created guide documents:
- `CLOUDFLARE_DEV_DEPLOYMENT.md` - Full detailed guide
- `DEV_DEPLOYMENT_QUICK_GUIDE.md` - Quick reference

---

## Workflow Example

```
1. Feature work on branch
   git checkout -b feature/my-feature dev
   # ... make changes ...
   git push origin feature/my-feature

2. Merge to dev branch
   git checkout dev
   git merge feature/my-feature
   git push origin dev
   
   ↓ AUTOMATIC
   
   GitHub Actions builds
   Deploys to dev.aldjan.com
   Test your changes!

3. Merge to main when ready
   git checkout main
   git merge dev
   git push origin main
   
   ↓ AUTOMATIC
   
   GitHub Actions builds
   Deploys to aldjan.com
   Go live!
```

---

## What Files to Reference

For **QUICK SETUP** → Read: `DEV_DEPLOYMENT_QUICK_GUIDE.md`  
For **DETAILED INFO** → Read: `CLOUDFLARE_DEV_DEPLOYMENT.md`

---

## DNS Note

DNS takes **5-10 minutes** to propagate globally, but Cloudflare Pages deployment is instant.

So:
- Deploy happens immediately ✅
- Domain starts working after DNS propagates (5-10 min)

---

## 🎯 Timeline

- **Now**: Create second Cloudflare Pages project (3 min)
- **Now**: Add DNS record (2 min)
- **5 min later**: dev.aldjan.com might be live
- **10 min later**: dev.aldjan.com definitely live

---

## Ready?

1. Go to https://dash.cloudflare.com
2. Create second Pages project
3. Connect to same repo
4. Add DNS record
5. Done!

Then every push to `dev` branch auto-deploys to `dev.aldjan.com` 🚀
