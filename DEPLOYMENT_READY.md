# aldjan.com Portfolio - Deployment Ready

A modern, optimized React portfolio site ready for GitHub Pages deployment.

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Local Development
```bash
npm install
npm run dev
```
Site runs at `http://localhost:3000`

### Build & Deploy
```bash
npm run build
npm run deploy
```

## 🚀 Deployment Options

### GitHub Actions (Recommended - Automatic)

The repository includes a pre-configured GitHub Actions workflow that:
- Automatically builds on push to `main` or `dev` branches
- Deploys to GitHub Pages with your custom domain
- Maintains your CNAME configuration

**Setup:**
1. Push to GitHub
2. GitHub Actions automatically builds and deploys
3. Site is live at `https://aldjan.com`

**File:** `.github/workflows/deploy.yml`

### Manual Deployment

If you prefer manual control:
```bash
npm run build
# Then push dist/ folder to gh-pages branch
```

## 📁 Project Structure

```
aldjan.com/
├── src/
│   ├── components/        # React components
│   │   ├── App.jsx
│   │   ├── Header.jsx
│   │   ├── Gallery.jsx
│   │   ├── Lightbox.jsx
│   │   ├── Footer.jsx
│   │   └── ThemeToggle.jsx
│   ├── styles/
│   │   └── global.css     # Global styles & animations
│   ├── data.js            # Gallery data & image helpers
│   └── main.jsx
├── public/                # Static files (robots.txt, sitemap.xml)
├── .github/workflows/     # GitHub Actions configuration
├── index.html             # HTML with SEO meta tags
├── vite.config.js         # Vite build configuration
├── package.json           # Dependencies & scripts
└── CNAME                  # Custom domain configuration
```

## 🎨 Features

- **Dark/Light Mode** - With localStorage persistence
- **Responsive Gallery** - 3 columns (desktop) → 2 (tablet) → 1 (mobile)
- **Lightbox Modal** - Image viewer with keyboard navigation
- **Contact Form** - Formspree integration with animations
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Mobile Optimized** - Touch-friendly interface
- **Performance Optimized** - ~52 kB gzipped total

## 🖼️ Image Optimization

- **Responsive srcsets** - Images load appropriate size per device
- **Quality compression** - 40% thumbs, 70% lightbox
- **Lazy loading** - Images load on-demand
- **Placeholder blur** - Tiny placeholder for perceived speed
- **Formats** - JPEG with compression parameters

## 🔧 Configuration Files

### vite.config.js
- React fast refresh enabled
- Terser minification
- Code splitting optimized
- CSS minification
- Public directory configured

### index.html
- SEO meta tags
- Open Graph tags (social sharing)
- Twitter Card tags
- DNS prefetch for performance
- Favicon configured

### CNAME
- Domain: `aldjan.com`
- Automatically handled by GitHub Pages

### robots.txt & sitemap.xml
- SEO configuration
- Search engine crawling rules
- Sitemap for indexing

## 📊 Build Output

| File | Size | Gzipped |
|------|------|---------|
| React Vendor | 139.45 kB | 44.76 kB |
| App JS | 19.69 kB | 6.08 kB |
| CSS | 2.81 kB | 1.02 kB |
| HTML | 1.03 kB | 0.48 kB |
| **Total** | ~163 kB | **~52 kB** |

## 🌐 DNS Setup

Your domain registrar should have:

**Option 1: CNAME (Recommended for GitHub Pages)**
```
www  CNAME  jizzy002.github.io
```

**Option 2: A Records (for apex domain)**
```
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

## ✅ Pre-Deployment Checklist

- [x] All images optimized
- [x] SEO meta tags added
- [x] Robots.txt configured
- [x] Sitemap.xml created
- [x] GitHub Actions workflow set up
- [x] CNAME file configured
- [x] Build output optimized
- [x] Mobile responsive verified
- [x] Contact form working
- [x] Dark/light mode functional
- [x] DNS pointing to GitHub Pages

## 🐛 Troubleshooting

### Site not loading after deployment
1. Check GitHub Pages settings (Settings → Pages)
2. Verify CNAME file exists in dist/ (auto-copied from public/)
3. Clear browser cache
4. Check DNS propagation (dnschecker.org)

### Images not showing
1. Verify imgur CDN is accessible
2. Check network tab in DevTools
3. Ensure image quality parameters are valid

### Build errors
```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📝 Maintenance

### Updating Content
1. Modify data in `src/data.js` (gallery items)
2. Update text in components
3. Push changes
4. GitHub Actions auto-deploys

### Adding New Pages
1. Create new component in `src/components/`
2. Add routing or navigation in `App.jsx`
3. Update `sitemap.xml`
4. Deploy

### Performance Monitoring
- Monitor Core Web Vitals at Google PageSpeed Insights
- Check GitHub Pages deployment status in Actions tab
- Use browser DevTools to analyze performance

## 🔐 Security

- No sensitive data in repository
- HTTPS enforced by GitHub Pages
- Form submission via Formspree (third-party)
- All external resources from CDNs
- No environment variables needed

## 📚 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [GitHub Pages Documentation](https://pages.github.com)
- [Formspree Documentation](https://formspree.io)

## 🎯 Next Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin dev
   ```

2. **Merge to Main**
   - Create a pull request from `dev` to `main`
   - Verify build succeeds
   - Merge when ready

3. **Monitor Deployment**
   - Check GitHub Actions tab for workflow status
   - Verify site loads at `https://aldjan.com`
   - Check console for any errors

4. **Post-Deployment**
   - Submit sitemap to Google Search Console
   - Verify in Google Analytics (if added)
   - Test on multiple devices

---

**Ready to deploy!** 🚀

For detailed deployment instructions, see `DEPLOYMENT.md`
