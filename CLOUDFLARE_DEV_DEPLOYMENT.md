# Deploying to dev.aldjan.com on Cloudflare Pages

## Step-by-Step Guide

### Option 1: Using Cloudflare Pages Projects (Recommended)

#### Step 1: Create Two Separate Projects

1. **First Project - Production (aldjan.com)**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → Connect to Git
   - Select your `aldjan.com` repository
   - Build command: `npm run build`
   - Build output: `dist`
   - Click "Save and Deploy"
   - Project name: `aldjan-portfolio`
   - Custom domain: `aldjan.com`

2. **Second Project - Development (dev.aldjan.com)**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → Connect to Git (same repo)
   - Build command: `npm run build`
   - Build output: `dist`
   - Click "Save and Deploy"
   - Project name: `aldjan-portfolio-dev`
   - Custom domain: `dev.aldjan.com`
   - Set to deploy from `dev` branch (in deployment settings)

#### Step 2: Configure Branch Deployments

For the **dev.aldjan.com** project:

1. Go to Pages → aldjan-portfolio-dev
2. Settings → Builds & deployments
3. Under "Branch deployments", select `dev` branch
4. Save changes

Now:
- **main** branch → `aldjan.com` (production)
- **dev** branch → `dev.aldjan.com` (development)

---

### Option 2: Single Project with Route-Based Deployment

If you want a single project with both domains:

#### Step 1: Create One Project
```
Project name: aldjan-portfolio
Build: npm run build
Output: dist
Branch: main
Custom domain: aldjan.com
```

#### Step 2: Add Route Rule in Cloudflare
1. Go to Cloudflare Dashboard → your domain
2. Rules → Page Rules (or WAF Rules)
3. Create rule:
   ```
   URL matches: dev.aldjan.com/*
   Then: Forward to dev branch (if using branch aliases)
   ```

---

### Option 3: Using Git Branches + Cloudflare Config (Best for Your Case)

This is the **recommended approach**:

#### Step 1: Setup GitHub Workflow for Multiple Branches

Update `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ dev, main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Cloudflare Pages (MAIN → production)
      if: github.ref == 'refs/heads/main'
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: aldjan-portfolio
        directory: dist
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Deploy to Cloudflare Pages (DEV → dev.aldjan.com)
      if: github.ref == 'refs/heads/dev'
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: aldjan-portfolio-dev
        directory: dist
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

#### Step 2: Create Two Cloudflare Projects

**Production Project:**
```
Name: aldjan-portfolio
Domain: aldjan.com
```

**Development Project:**
```
Name: aldjan-portfolio-dev
Domain: dev.aldjan.com
```

#### Step 3: Git Strategy

- **main branch** → pushes to `aldjan.com` ✓
- **dev branch** → pushes to `dev.aldjan.com` ✓
- Make changes in `dev`, test, then merge to `main`

---

## 🔄 Workflow: Development → Production

```
Feature Branch (feature/my-feature)
         ↓ (pull request)
    Dev Branch (dev)
         ↓ (GitHub Actions)
  Deploy to dev.aldjan.com
         ↓ (test & verify)
    Main Branch (main)
         ↓ (GitHub Actions)
  Deploy to aldjan.com
```

---

## 📋 Checklist for dev.aldjan.com

### Cloudflare Setup
- [ ] Create second Cloudflare Pages project
- [ ] Project name: `aldjan-portfolio-dev`
- [ ] Connect to same GitHub repository
- [ ] Build: `npm run build`
- [ ] Output: `dist`
- [ ] Add custom domain: `dev.aldjan.com`

### DNS Setup
- [ ] Go to your domain registrar
- [ ] Add CNAME for `dev`:
  ```
  dev  CNAME  aldjan-portfolio-dev.pages.dev
  ```
   OR add in Cloudflare:
  - Cloudflare Dashboard → your domain
  - DNS → Add record
  - Type: CNAME
  - Name: dev
  - Target: aldjan-portfolio-dev.pages.dev

### GitHub Setup
- [ ] Update `.github/workflows/deploy.yml` (see above)
- [ ] GitHub secrets already configured:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

### Deployment
- [ ] Push to `dev` branch: `git push origin dev`
- [ ] GitHub Actions builds and deploys
- [ ] Visit `https://dev.aldjan.com` to verify

---

## 🧪 Testing on dev.aldjan.com

Once deployed to `dev.aldjan.com`:

✅ Test new features safely  
✅ Get feedback from stakeholders  
✅ Verify before merging to main  
✅ Keep production stable  

Process:
1. Create feature branch from `dev`
2. Make changes and test locally
3. Push to GitHub → PR to `dev`
4. Merge to `dev` → auto-deploys to `dev.aldjan.com`
5. Test in browser at `dev.aldjan.com`
6. When ready: merge `dev` → `main` → deploys to `aldjan.com`

---

## 🚀 Quick Setup Commands

### For first time setup:

```bash
# Verify you're on dev branch
git branch

# Make sure everything is committed
git status

# Create dev branch if it doesn't exist
git checkout -b dev

# Push dev branch to GitHub
git push origin dev

# Now create Cloudflare Pages projects through dashboard
# Then update GitHub Actions workflow
```

### For ongoing development:

```bash
# Work on feature branch
git checkout -b feature/my-feature dev

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR to dev
git push origin feature/my-feature

# After review/testing, merge to dev
git checkout dev
git merge feature/my-feature
git push origin dev

# Later, when ready for production
git checkout main
git merge dev
git push origin main
```

---

## 🔐 DNS Configuration Examples

### At Cloudflare (if you use Cloudflare DNS)
```
Subdomain | Type | Content
---------|------|--------
dev      | CNAME| aldjan-portfolio-dev.pages.dev
www      | CNAME| aldjan-portfolio.pages.dev
@        | A    | (point to Cloudflare)
```

### At Your Domain Registrar
```
Subdomain | Type | Content
---------|------|--------
dev      | CNAME| aldjan-portfolio-dev.pages.dev
aldjan.com| CNAME| aldjan-portfolio.pages.dev
```

---

## 🎯 Final Architecture

```
GitHub Repository (aldjan.com)
├── main branch
│   ├── GitHub Actions triggers
│   └── Deploy to Cloudflare → aldjan.com ✓
│
└── dev branch
    ├── GitHub Actions triggers
    └── Deploy to Cloudflare → dev.aldjan.com ✓
```

---

## 📊 Environment Comparison

| Aspect | Production | Development |
|--------|-----------|-------------|
| **Domain** | aldjan.com | dev.aldjan.com |
| **Branch** | main | dev |
| **Deploy** | Automatic | Automatic |
| **Users** | Public | Testing/Preview |
| **Cloudflare Project** | aldjan-portfolio | aldjan-portfolio-dev |
| **Cache TTL** | Long | Short (optional) |

---

## ⚙️ Optional: Different Build Settings

You can have different builds for dev:

Update `vite.config.js`:
```javascript
export default defineConfig({
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production'
  },
  // ... rest of config
})
```

Then use in code:
```javascript
if (__DEV__) {
  console.log('Development mode');
  // Show dev tools, etc
}
```

---

## 🆘 Troubleshooting

### Domain shows "Not Found"
- Wait 5-10 minutes for DNS propagation
- Check Cloudflare DNS settings
- Verify CNAME record points to correct Pages domain

### Deployments aren't triggering
- Check GitHub Actions workflow in `.github/workflows/deploy.yml`
- Verify secrets are set: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Check Actions tab for error logs

### dev.aldjan.com redirects to aldjan.com
- Check Cloudflare Page Rules
- Verify DNS CNAME is correct
- Clear browser cache

---

## 📞 Next Steps

1. ✅ Create second Cloudflare Pages project (`aldjan-portfolio-dev`)
2. ✅ Add DNS CNAME for `dev` subdomain
3. ✅ Update GitHub Actions workflow (see above)
4. ✅ Create `dev` branch in GitHub if needed
5. ✅ Push changes
6. ✅ Visit `dev.aldjan.com` to verify

---

**Status**: Ready to deploy to dev.aldjan.com ✅
