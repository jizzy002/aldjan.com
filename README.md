# Aldin Jandric's Photography Portfolio

## Setup Instructions

This project uses Tailwind CSS for styling. Follow these steps to build and deploy:

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Initial Setup

1. Install dependencies:
```bash
npm install
```

2. Build the CSS for production:
```bash
npm run build:css
```

This will generate `assets/css/output.css` which is automatically included in `index.html`.

### Development

If you want to watch for changes and rebuild automatically:
```bash
npm run watch:css
```

### Build Output

- **Input CSS**: `assets/css/input.css` (Tailwind directives)
- **Output CSS**: `assets/css/output.css` (Compiled and minified, ready for production)

The `output.css` file is what's served to browsers. It's minified and only includes the styles actually used in your HTML.

### Deployment

1. Ensure you've run `npm run build:css` to generate `assets/css/output.css`
2. Commit `output.css` to your repository
3. Deploy as usual - all CSS is self-contained in the output file

### Why This Setup?

- ✅ Removes CDN warning in production
- ✅ CSS is minified (~50% smaller than CDN)
- ✅ Faster page loads (no external dependency)
- ✅ Full control over Tailwind configuration
- ✅ Dead code elimination - only used styles are included

## Project Structure

```
aldjan.com/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── input.css       # Tailwind input (with custom styles)
│   │   ├── output.css      # Compiled CSS (included in HTML)
│   │   ├── main.css
│   │   └── ...
│   ├── js/
│   └── sass/
├── images/
│   ├── fulls/              # Full-size gallery images
│   └── thumbs/             # Thumbnail gallery images
├── package.json            # Dependencies and build scripts
├── tailwind.config.js      # Tailwind configuration
└── README.md
```
