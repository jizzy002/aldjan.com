/**
 * Cloudflare Pages Worker
 * Handles routing and SPA fallback for React application
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle static assets
    if (
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/api/') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js') ||
      pathname.endsWith('.json')
    ) {
      return env.ASSETS.fetch(request);
    }

    // For all other routes, serve index.html (SPA fallback)
    if (request.method !== 'GET') {
      return new Response('Not Found', { status: 404 });
    }

    // Return index.html for all routes (React Router will handle it)
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL('/index.html', request.url), { method: 'GET' })
    );

    return indexResponse;
  },
};
