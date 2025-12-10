{
  "builds": [
    {
      "src": ".",
      "use": "@cloudflare/pages-plugin-next",
      "config": {}
    }
  ],
  "routes": [
    {
      "pattern": "^/assets/.*",
      "zone_name": "aldjan.com"
    }
  ],
  "buildOutputDirectory": "dist"
}
