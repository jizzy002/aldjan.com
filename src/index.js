/**
 * Cloudflare Image Optimization Worker
 * Simple proxy that fetches images and lets Cloudflare's edge handle optimization
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Get the image source URL
    const source = url.searchParams.get('src');
    
    if (!source) {
      return new Response('Missing src parameter', { status: 400 });
    }
    
    try {
      // Fetch the image from the source
      const imageResponse = await fetch(source, {
        cf: {
          cacheEverything: true,
          cacheTtl: 2592000, // 30 days
        }
      });
      
      if (!imageResponse.ok) {
        return new Response(`Failed to fetch image: ${imageResponse.status}`, { 
          status: imageResponse.status 
        });
      }
      
      // Return the image with aggressive caching
      const newResponse = new Response(imageResponse.body, {
        status: 200,
        headers: new Headers(imageResponse.headers)
      });
      
      newResponse.headers.set('Cache-Control', 'public, max-age=2592000, immutable');
      newResponse.headers.set('X-Content-Type-Options', 'nosniff');
      
      return newResponse;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
