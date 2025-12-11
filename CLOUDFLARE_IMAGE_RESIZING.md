# Cloudflare Image Resizing Implementation

This document describes the Cloudflare Image Resizing implementation for the aldjan.com portfolio.

## Overview

Cloudflare Image Resizing allows on-the-fly image optimization without storing multiple versions. Images are automatically resized, compressed, and formatted based on the request parameters, providing:

- **Responsive images** with different sizes for different devices
- **Automatic quality optimization** based on device and network conditions
- **Format conversion** (WebP, AVIF) for faster loading
- **Global edge caching** for instant delivery worldwide
- **Zero storage overhead** since images are resized on-demand

## Current Implementation

### URL Format

Images use Cloudflare's standard image resizing format:

```
/cdn-cgi/image/{options}/{source-url}
```

**Options format:** `width=<px>,height=<px>,quality=<1-100>,fit=<type>`

**Example:**
```
/cdn-cgi/image/width=400,height=300,quality=60/https://i.imgur.com/6hdtAdU.jpeg
```

### HTML Usage

All gallery images have been updated to use Cloudflare Image Resizing with responsive srcsets:

```html
<img 
  src="/cdn-cgi/image/width=400,height=300,quality=60/https://i.imgur.com/6hdtAdU.jpeg" 
  srcset="
    /cdn-cgi/image/width=300,height=225,quality=50/https://i.imgur.com/6hdtAdU.jpeg 300w,
    /cdn-cgi/image/width=400,height=300,quality=60/https://i.imgur.com/6hdtAdU.jpeg 400w,
    /cdn-cgi/image/width=600,height=450,quality=70/https://i.imgur.com/6hdtAdU.jpeg 600w"
  alt="Image description"
/>
```

The lightbox full-size images use:
```
/cdn-cgi/image/width=1200,quality=85/{source-url}
```

## Configuration

### Wrangler Setup (For Future Workers)

A `wrangler.toml` file has been created for deploying Cloudflare Workers if you want an optional image proxy layer:

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Configure Credentials:**
   ```bash
   wrangler login
   ```

3. **Update `wrangler.toml`** with your Cloudflare Account ID and Zone ID

4. **Deploy the Worker (optional):**
   ```bash
   wrangler deploy
   ```

### Enable on Your Domain

To use Cloudflare Image Resizing on your domain:

1. **Ensure your domain is on Cloudflare** (nameservers pointing to Cloudflare)
2. **Go to Speed → Optimization** in your Cloudflare dashboard
3. **Enable "Image Resizing"** under Polish features
4. **Set Polish quality** to your preference (Lossy or Lossless)

## Responsive Image Sizes

Current breakpoints used in the gallery:

| Viewport | Image Width | Quality | Use Case |
|----------|-------------|---------|----------|
| 300px | 300px | 50% | Mobile (small) |
| 400px | 400px | 60% | Mobile/Tablet |
| 600px+ | 600px | 70% | Tablet/Desktop |
| Lightbox | 1200px | 85% | Full-size viewing |

These can be adjusted in `index.html` by modifying the `width` and `quality` parameters in the URLs.

## Image Helper Utility

The `src/image-helper.js` file provides JavaScript utilities for generating optimized image URLs:

```javascript
import { generateImageUrl, generateSrcSet } from './image-helper.js';

// Generate a single optimized image URL
const url = generateImageUrl('https://example.com/image.jpg', {
  width: 400,
  height: 300,
  quality: 60,
  fit: 'crop'
});

// Generate responsive srcset
const srcset = generateSrcSet('https://example.com/image.jpg', {
  quality: 70,
  fit: 'crop'
}, [300, 400, 600]);
```

## Performance Benefits

### Bandwidth Reduction
- **Quality optimization:** 50-70% reduction in file size
- **Responsive images:** Devices load only the size they need
- **Format conversion:** WebP/AVIF can be 25-35% smaller than JPEG

### Load Time Improvements
- **Edge caching:** Images cached globally on Cloudflare's CDN
- **Automatic format selection:** Modern browsers get AVIF, older browsers get JPEG
- **Lazy loading:** Images marked with `loading="lazy"` load on-demand

### Example Savings (Per Gallery)
- 12 images × ~150KB each (original JPEG)
- With Cloudflare optimization: ~40KB per thumbnail, ~150KB for lightbox
- **Total reduction: ~80-85% bandwidth savings**

## Troubleshooting

### Images Not Resizing
- Verify your domain is using Cloudflare nameservers
- Check that Image Resizing is enabled in Cloudflare dashboard
- Clear browser cache and Cloudflare cache

### CORS Issues with External Images
- Ensure the image source allows cross-origin requests
- For Imgur, this is typically allowed
- Test with browser DevTools Network tab

### Quality Too Low/High
- Adjust the `quality` parameter (1-100 scale)
- Lower quality = smaller file size, less detail
- Recommended: 50-60 for thumbnails, 80-85 for full-size

## Future Enhancements

1. **WebP/AVIF Format:**
   ```
   /cdn-cgi/image/width=400,format=webp/https://...
   ```

2. **Advanced Compression:**
   Enable "Polish" with "Lossless" compression in Cloudflare dashboard

3. **Cloudflare Workers API:**
   Deploy the included worker for custom image processing logic

4. **Analytics:**
   Monitor image serving metrics in Cloudflare Analytics dashboard

## References

- [Cloudflare Image Resizing Documentation](https://developers.cloudflare.com/images/image-resizing/)
- [Image Resizing API Reference](https://developers.cloudflare.com/images/image-resizing/format-options/)
- [Polish and Image Optimization](https://developers.cloudflare.com/speed/optimization/polish/)
