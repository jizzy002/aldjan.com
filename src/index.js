/**
 * Cloudflare Image Resizing Worker
 * Proxies image requests through Cloudflare's Image Resizing service
 * Handles responsive image sizes and quality optimization
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Extract query parameters for image resizing
    const width = url.searchParams.get('w') || url.searchParams.get('width');
    const height = url.searchParams.get('h') || url.searchParams.get('height');
    const quality = url.searchParams.get('q') || url.searchParams.get('quality') || '80';
    const format = url.searchParams.get('f') || url.searchParams.get('format');
    const fit = url.searchParams.get('fit') || 'crop';
    
    // Get the image source URL
    const source = url.searchParams.get('src');
    
    if (!source) {
      return new Response('Missing src parameter', { status: 400 });
    }
    
    try {
      // Fetch the image from the source
      const imageRequest = new Request(source);
      const imageResponse = await fetch(imageRequest);
      
      if (!imageResponse.ok) {
        return new Response('Failed to fetch image', { status: imageResponse.status });
      }
      
      // Build Cloudflare Image Resizing options
      const cfImageOptions = {
        quality: parseInt(quality),
        fit: fit,
      };
      
      if (width) cfImageOptions.width = parseInt(width);
      if (height) cfImageOptions.height = parseInt(height);
      if (format) cfImageOptions.format = format;
      
      // Clone response and apply Cloudflare Image Resizing
      const response = new Response(imageResponse.body, imageResponse);
      response.headers.set('cf-image-resizing', JSON.stringify(cfImageOptions));
      
      // Cache for 30 days
      response.headers.set('Cache-Control', 'public, max-age=2592000');
      
      return response;
    } catch (error) {
      return new Response(`Error processing image: ${error.message}`, { status: 500 });
    }
  }
};
