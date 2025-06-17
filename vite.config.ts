import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { run } from 'vite-plugin-run'

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
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }], // expliziter Name
          [remarkToc, {
            heading: 'contents|toc|table[ -]of[ -]contents?', // Erkennt verschiedene TOC-Überschriften
            minDepth: 2,
            maxDepth: 5, // Maximale Tiefe der Headings im TOC
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
    tailwindcss(),
    run([
      {
        name: 'typescript transform',
        run: ['php', 'artisan', 'typescript:transform'],
        pattern: ['app/**/*Data.php', 'app/**/Enums/**/*.php']
      },
      {
        name: 'build routes',
        run: ['php', 'artisan', 'routes:generate'],
        condition: file => file.includes('/routes/')
      }
    ])
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
