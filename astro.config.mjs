import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 1. Define your production deployment URL topology
  site: 'https://yourportfolio.com', 

  // 2. Enforce clean directory-based routing structures (/about/)
  trailingSlash: 'always',

  // 3. Output strategy: Force compilation to yield flat static HTML assets
  output: 'static'
});