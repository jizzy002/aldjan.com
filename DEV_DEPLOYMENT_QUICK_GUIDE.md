# Quick Guide: Deploy to dev.aldjan.com

## 🎯 TL;DR (30 seconds)

### On Cloudflare:
1. Dashboard → Pages → Create project
2. Connect same GitHub repo again
3. Project name: `aldjan-portfolio-dev`
4. Build: `npm run build` | Output: `dist`
5. Custom domain: `dev.aldjan.com`

### At Your Domain Registrar:
Add DNS record:
```
dev  CNAME  aldjan-portfolio-dev.pages.dev
```

### Done! 
- Push to `dev` branch → auto-deploys to dev.aldjan.com ✅

---

## 📊 The Setup

```
Your GitHub Repo
├── main branch ──→ GitHub Actions ──→ Cloudflare Pages (aldjan-portfolio) ──→ aldjan.com
└── dev branch  ──→ GitHub Actions ──→ Cloudflare Pages (aldjan-portfolio-dev) ──→ dev.aldjan.com
```

---

## ✅ Step-by-Step

### 1️⃣ Create Second Cloudflare Pages Project

```
Go to: https://dash.cloudflare.com
  ↓
Pages (left menu)
  ↓
Create a project
  ↓
Connect to Git → Select aldjan.com repo
  ↓
Build settings:
  • Command: npm run build
  • Output: dist
  ↓
Save and Deploy
```

### 2️⃣ Configure Project

After project created:
```
Pages → aldjan-portfolio-dev
  ↓
Settings → Builds & deployments
  ↓
Look for "Project name", verify it says: aldjan-portfolio-dev
```

### 3️⃣ Add Custom Domain

```
Pages → aldjan-portfolio-dev
  ↓
Custom domains
  ↓
Add custom domain
  ↓
Enter: dev.aldjan.com
  ↓
Click "Activate domain"
  ↓
Follow DNS instructions
```

### 4️⃣ Configure DNS

**At Cloudflare (if you use Cloudflare for DNS):**
```
DNS → Add record
  ↓
Type: CNAME
Name: dev
Content: aldjan-portfolio-dev.pages.dev
```

**At Your Domain Registrar (if external DNS):**
```
Add DNS Record:
Name: dev
Type: CNAME
Value: aldjan-portfolio-dev.pages.dev
```

### 5️⃣ Push to Dev Branch

```bash
git push origin dev
```

GitHub Actions automatically:
- Detects push to `dev` branch
- Runs build
- Deploys to `aldjan-portfolio-dev` project
- Goes live at `dev.aldjan.com`

---

## 🧪 Test It

1. Make change in code
2. Push to `dev` branch: `git push origin dev`
3. Watch GitHub → Actions tab
4. Wait ~2 minutes
5. Visit `https://dev.aldjan.com`
6. See your changes! ✅

---

## 📋 What GitHub Actions Does Now

```
When you: git push origin main
         ↓
GitHub Actions runs the deploy.yml workflow
         ↓
Checks branch: IS IT main? YES
         ↓
Deploy to project: aldjan-portfolio
         ↓
Live at: aldjan.com


When you: git push origin dev
         ↓
GitHub Actions runs the deploy.yml workflow
         ↓
Checks branch: IS IT dev? YES
         ↓
Deploy to project: aldjan-portfolio-dev
         ↓
Live at: dev.aldjan.com
```

---

## 🔄 Development Workflow

```
1. Create feature branch from dev
   git checkout -b feature/my-feature dev

2. Make changes locally
   npm run dev  (test at localhost:3000)

3. Commit and push
   git add .
   git commit -m "My feature"
   git push origin feature/my-feature

4. Create Pull Request to dev
   Go to GitHub → New PR → feature/my-feature → dev

5. Merge to dev
   After review/testing → Merge button

6. Dev branch auto-deploys
   GitHub Actions → dev.aldjan.com updates

7. When ready for production
   Create PR: dev → main
   After review → Merge
   main auto-deploys to aldjan.com
```

---

## 🎯 Your Current Status

✅ **Already Done:**
- vite build configured
- GitHub Actions workflow updated
- Functions/Workers ready

🔄 **You Need to Do:**
1. Create second Cloudflare Pages project
2. Add DNS record for `dev` subdomain
3. Push to `dev` branch

---

## 🚀 Next 5 Minutes

### 1. Create Project (2 min)
```
Cloudflare Dashboard → Pages → New Project
Set name: aldjan-portfolio-dev
```

### 2. Add Domain (2 min)
```
Add custom domain: dev.aldjan.com
Note CNAME target
```

### 3. Add DNS (1 min)
```
Your registrar → Add DNS
Name: dev
Value: aldjan-portfolio-dev.pages.dev
```

Done! 🎉

---

## 💡 Pro Tips

✅ **DNS takes 5-10 minutes to propagate**
- Deploy is instant
- Domain will work after DNS updates

✅ **Both sites use same code**
- Only branch changes which project gets deployed
- No need to maintain separate codebases

✅ **Test before merging to main**
- Use dev.aldjan.com for testing
- Keep aldjan.com stable
- Safer for users

✅ **Rollback is one-click**
- Cloudflare → Pages → Deployments
- Click "Rollback" to previous version

---

## ❓ Common Questions

**Q: Can I deploy to multiple domains?**  
A: Yes! Create more Cloudflare Pages projects and update GitHub Actions

**Q: Will dev.aldjan.com interfere with aldjan.com?**  
A: No, they're completely separate Cloudflare projects

**Q: Do I need separate GitHub branches?**  
A: No, but recommended. You can also use different GitHub branches pointing to same project

**Q: Can I merge dev → main automatically?**  
A: You can set up GitHub Actions to auto-merge, but manual review is safer

---

## 📞 Quick Checklist

Before you start:
- [ ] Have Cloudflare dashboard open
- [ ] Have GitHub repo access
- [ ] Have domain registrar access
- [ ] Have API token & Account ID handy

During setup:
- [ ] Create aldjan-portfolio-dev project
- [ ] Add custom domain: dev.aldjan.com
- [ ] Update DNS at registrar
- [ ] Wait 5-10 min for DNS

After setup:
- [ ] Push to dev branch
- [ ] Watch GitHub Actions
- [ ] Verify dev.aldjan.com works
- [ ] Test your site

---

**You're almost there!** Just need to create the second Cloudflare Pages project. 🚀
