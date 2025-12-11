/**
 * Image Helper Utility
 * Provides functions to generate Cloudflare Image Resizing URLs
 */

/**
 * Generates a Cloudflare Image Resizing URL with optimization parameters
 * @param {string} sourceUrl - The original image URL
 * @param {Object} options - Resizing options
 * @param {number} options.width - Image width in pixels
 * @param {number} options.height - Image height in pixels
 * @param {number} options.quality - Quality level (1-100, default 80)
 * @param {string} options.fit - Fit type (scale, cover, contain, crop, default 'crop')
 * @param {string} options.format - Image format (auto, webp, avif, etc)
 * @param {string} options.cloudflareUrl - Your Cloudflare domain (required for worker)
 * @returns {string} Optimized image URL
 */
export function generateImageUrl(sourceUrl, options = {}) {
  const {
    width,
    height,
    quality = 80,
    fit = 'crop',
    format = 'auto',
    cloudflareUrl = 'https://images.aldjan.com'
  } = options;

  const params = new URLSearchParams();
  params.set('src', sourceUrl);
  
  if (width) params.set('w', width);
  if (height) params.set('h', height);
  if (quality) params.set('q', quality);
  if (fit) params.set('fit', fit);
  if (format) params.set('f', format);

  return `${cloudflareUrl}/resize?${params.toString()}`;
}

/**
 * Generates responsive srcset for modern browsers
 * @param {string} sourceUrl - The original image URL
 * @param {Object} options - Base options for image resizing
 * @param {number[]} widths - Array of widths to generate (e.g., [300, 400, 600])
 * @returns {string} Srcset string
 */
export function generateSrcSet(sourceUrl, options = {}, widths = [300, 400, 600]) {
  return widths
    .map(w => {
      const url = generateImageUrl(sourceUrl, { ...options, width: w });
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Alternative: Direct Cloudflare Image Resizing via URL (if using Cloudflare as origin)
 * Use this if your images are served from a Cloudflare origin
 * @param {string} imagePath - Path to image on your Cloudflare origin
 * @param {Object} options - Resizing options
 * @returns {string} URL with cf-image-resizing parameters
 */
export function generateDirectImageUrl(imagePath, options = {}) {
  const {
    width,
    height,
    quality = 80,
    fit = 'crop',
    format = 'auto'
  } = options;

  const params = [];
  
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  params.push(`quality=${quality}`);
  if (fit && fit !== 'crop') params.push(`fit=${fit}`);
  if (format && format !== 'auto') params.push(`format=${format}`);

  const paramString = params.join(',');
  return `/cdn-cgi/image/${paramString}/${imagePath}`;
}
