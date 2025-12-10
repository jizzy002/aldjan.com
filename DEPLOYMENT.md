# Deployment Guide for aldjan.com

## Overview
This portfolio site is configured for deployment to GitHub Pages using your custom domain.

## Prerequisites
- Node.js and npm installed
- Git configured
- GitHub repository access

## Local Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Accessible at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Generates optimized files in the `dist/` directory.

## GitHub Pages Deployment

### Option 1: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ dev, main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: aldjan.com
```

2. Ensure GitHub Pages settings:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages, /(root)

### Option 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to gh-pages branch:
```bash
git add dist -f
git commit -m "Deploy to GitHub Pages"
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

Or use a deployment tool:
```bash
npm install --save-dev gh-pages
# Then add to package.json: "deploy": "npm run build && gh-pages -d dist"
npm run deploy
```

## Configuration Files

### vite.config.js
- Base path set to `/` for custom domain
- React plugin enabled
- Terser minification configured
- Code splitting optimized

### package.json
- Homepage set to `https://aldjan.com`
- Deploy script configured
- All dependencies locked

### CNAME
- Contains domain: `aldjan.com`
- Automatically handled by GitHub Pages

## DNS Configuration

Your domain registrar should have CNAME records pointing to GitHub Pages:
- Subdomain `www` → `jizzy002.github.io`
- Or use A records pointing to GitHub's servers:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

## Optimization Features

- ✅ Image optimization with responsive srcsets
- ✅ Aggressive compression (40% quality thumbs, 70% quality lightbox)
- ✅ Lazy loading for images
- ✅ CSS minification (2.81 kB)
- ✅ JS code splitting (React vendor chunk)
- ✅ Gzip compression enabled
- ✅ DNS prefetch for external resources

## File Size Summary

| File | Size | Gzipped |
|------|------|---------|
| React Vendor | 139.45 kB | 44.76 kB |
| App JS | 19.69 kB | 6.08 kB |
| CSS | 2.81 kB | 1.02 kB |
| HTML | 1.03 kB | 0.48 kB |
| **Total** | ~163 kB | ~52 kB |

## Environment Variables

None required for public deployment. Formspree endpoint is hardcoded as it's public-facing.

## Troubleshooting

### Site not showing after deployment
- Check GitHub Pages is enabled in repository settings
- Verify CNAME file exists in root
- Clear browser cache (Ctrl+Shift+Delete)
- Check DNS propagation at dnschecker.org

### Images not loading
- Verify imgur URLs are accessible
- Check image quality parameters in `src/data.js`
- Ensure preconnect headers in `index.html`

### Build errors
- Delete `node_modules` and `dist`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Future Improvements

- Add sitemap.xml for SEO
- Add robots.txt for crawlers
- Implement analytics (Google Analytics or Plausible)
- Add RSS feed for blog content (if added)
- PWA support with service workers

## Support

For issues or questions, check:
- Vite documentation: https://vitejs.dev
- React documentation: https://react.dev
- GitHub Pages: https://pages.github.com
