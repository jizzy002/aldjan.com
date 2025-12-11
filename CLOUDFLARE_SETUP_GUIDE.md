# Cloudflare Image Resizing Setup Guide

## Quick Start Checklist

- [ ] Ensure domain is hosted on Cloudflare (nameservers pointing to CF)
- [ ] Log in to Cloudflare dashboard
- [ ] Navigate to **Speed → Optimization**
- [ ] Enable **Image Resizing** toggle
- [ ] Optional: Enable **Polish** for additional compression
- [ ] Verify images are loading and resizing on your domain
- [ ] Monitor performance in **Analytics → Performance**

## Step-by-Step Setup

### 1. Cloudflare Domain Configuration

Your domain must be using Cloudflare as your DNS provider:

1. Go to your Cloudflare dashboard
2. Select your domain (aldjan.com)
3. Go to **DNS → Records**
4. Verify your domain's nameservers are pointing to Cloudflare
   - Nameservers should be something like: `ns1.cloudflare.com`

### 2. Enable Image Resizing

1. In Cloudflare dashboard, go to **Speed → Optimization**
2. Look for **Image Resizing** under the "Images" section
3. Click the toggle to enable it
4. This is available on all Cloudflare plans

### 3. Optional: Enable Polish

For additional optimization:

1. In **Speed → Optimization**, find **Polish**
2. Choose compression level:
   - **Off** (default)
   - **Lossless** (preserves quality, moderate compression)
   - **Lossy** (more aggressive compression, slight quality reduction)
3. Recommendation: **Lossless** for photography portfolio

### 4. Verify Implementation

1. Visit your website: `https://aldjan.com`
2. Right-click an image → **Inspect** (or Ctrl+Shift+C)
3. Check the image URL in Network tab
4. You should see URLs like:
   ```
   /cdn-cgi/image/width=400,height=300,quality=60/https://i.imgur.com/...
   ```

### 5. Optional: Deploy Cloudflare Worker

If you want custom image processing, deploy the included worker:

```bash
# 1. Install Wrangler (if not already installed)
npm install -g @cloudflare/wrangler

# 2. Log in with your Cloudflare credentials
wrangler login

# 3. Update wrangler.toml with your credentials
# Find YOUR_CLOUDFLARE_ACCOUNT_ID and YOUR_CLOUDFLARE_ZONE_ID
# (available in Cloudflare dashboard > Overview)

# 4. Deploy the worker
wrangler deploy
```

The worker provides an optional image proxy layer with custom logic for image processing.

## Monitoring Performance

### Cloudflare Analytics Dashboard

1. Go to **Analytics & Logs → Performance**
2. Monitor:
   - **Average Size Saved** - bandwidth reduction from optimization
   - **Requests** - how many images served
   - **Cache Status** - how many were cached vs. origin

### Browser DevTools

1. Open **DevTools → Network Tab**
2. Filter for images
3. Compare sizes and load times
4. Look for `cf-cache-status` header (HIT = cached by Cloudflare)

## Troubleshooting

### Issue: Images showing as broken

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear Cloudflare cache:
   - Dashboard → **Caching → Cache Purge → Purge Everything**
3. Wait 5-10 minutes for DNS propagation if recently enabled

### Issue: Quality is too low

**Solution:**
Adjust quality parameters in image URLs. In `index.html`, change the `quality` values:
- Current: `quality=50-70` (thumbnails), `quality=85` (lightbox)
- Try: `quality=75-85` for thumbnails, `quality=90` for lightbox
- Trade-off: Higher quality = larger file sizes

### Issue: External images not loading

**Solution:**
1. Verify the image source allows cross-origin access
2. Check browser console for CORS errors
3. Some image services may need allowlisting in Cloudflare

### Issue: Caching is too aggressive

**Solution:**
1. Go to **Caching → Cache Rules**
2. Create a rule to bypass cache for specific paths if needed
3. For galleries, caching usually improves performance

## Configuration Files

### `wrangler.toml`
Configuration for Cloudflare Workers deployment. Update with:
- `account_id` - Your Cloudflare account ID
- `zone_id` - Your domain's zone ID

Find these in Cloudflare dashboard > Overview

### `src/index.js`
Main Cloudflare Worker script (optional). Handles image proxying and resizing logic.

### `src/image-helper.js`
JavaScript utility functions for generating optimized image URLs dynamically.

## Best Practices

1. **Use responsive srcsets** - Always include multiple sizes for different devices
2. **Lazy load below-fold images** - Use `loading="lazy"` attribute
3. **Set explicit alt text** - Important for accessibility and SEO
4. **Monitor bandwidth** - Check Cloudflare analytics weekly
5. **Test on slow networks** - Use Chrome DevTools throttling (Slow 4G)
6. **Cache aggressively** - Long-lived cache headers for images
7. **Use appropriate quality** - 50-70 for thumbnails, 80-90 for full-size

## Next Steps

1. **Enable Polish** for additional compression
2. **Set up cache rules** for optimal TTL (Time To Live)
3. **Monitor analytics** for performance improvements
4. **Consider WebP format** with format parameter: `format=webp`
5. **Deploy Worker** if you need custom image processing

## Support & Resources

- [Cloudflare Image Resizing Docs](https://developers.cloudflare.com/images/image-resizing/)
- [Polish Documentation](https://developers.cloudflare.com/speed/optimization/polish/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare Support: Dashboard → Help → Submit a ticket

## Cost Considerations

- **Image Resizing**: Included in all Cloudflare plans
- **Polish**: Included in Professional and Business plans ($20+/month)
- **Cloudflare Workers**: Free tier available (100,000 requests/day)
- **CDN Bandwidth**: Included in all plans, unlimited

The current setup uses only built-in Image Resizing, which is free on all plans!
