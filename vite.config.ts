import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true
    }),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          [remarkToc, {
            heading: 'contents|toc|table[ -]of[ -]contents?', // Erkennt verschiedene TOC-Überschriften
            maxDepth: 4, // Maximale Tiefe der Headings im TOC
            tight: true, // Kompakte Liste ohne <p> Tags
            ordered: false // Ungeordnete Liste verwenden
          }]
        ],
        rehypePlugins: [
          rehypeSlug // Muss als rehypePlugin definiert werden
        ],
        providerImportSource: '@mdx-js/react'
      })
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss()
  ],
  esbuild: {
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy')
    }
  }
})
