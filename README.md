# Aldin Jandric's Photography Portfolio

A modern, responsive photography portfolio built with **React**, **Vite**, and **Cloudflare Pages**.

## Quick Start

### Prerequisites
- Node.js 16+ (with npm)
- Git

### Installation

1. Clone and install:
`npm install`

2. Start development server:
`npm run dev`

3. Build for production:
`npm run build`

## Features

- React 18 with hooks
- Vite 5.4 for fast builds
- Dark/Light Mode with localStorage
- Responsive Design
- Optimized Images with lazy loading
- Interactive Lightbox Gallery
- Contact Form with Formspree
- SEO Ready
- 52 kB gzipped bundle

## Project Structure

- src/ - React components and styles
- public/ - Static assets
- functions/ - Cloudflare Workers routing
- index.html - Vite entry point
- vite.config.js - Build config
- wrangler.toml - Cloudflare Pages config

## Deployment

Deploy to Cloudflare Pages:
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build locally

## License

Personal portfolio project. All photography copyright © Aldin Jandric.
'@ | Set-Content -Path README.md -Encoding UTF8