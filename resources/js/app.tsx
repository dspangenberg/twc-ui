import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { initializeTheme } from './hooks/use-appearance'
import '@fontsource/clear-sans/100.css'
import '@fontsource/clear-sans/300.css'
import '@fontsource/clear-sans/400.css'
import '@fontsource/clear-sans/500.css'
import '@fontsource/clear-sans/700.css'
import '@fontsource-variable/jetbrains-mono'
import React from 'react'
import { DocPage } from '@/components/docs/DocPage'
import { MdxWrapper } from '@/mdx-wrapper'
import { Providers } from './providers'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: async name => {
    if (name.startsWith('docs')) {
      const module = await resolvePageComponent(`./${name}.mdx`, import.meta.glob('./docs/**/*.mdx'))
      const MdxComponent = (module as any).default as React.ComponentType
      const frontmatter = (module as any).frontmatter || (MdxComponent as any).frontmatter || null

      return {
        default: () => (
          <DocPage frontmatter={frontmatter}>
            <MdxWrapper Component={MdxComponent} frontmatter={frontmatter} />
          </DocPage>
        )
      }

    } else {
      return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'))
    }
  },
  setup ({
    el,
    App,
    props
  }) {
    const appElement = (
      <Providers>
        <App {...props} />
      </Providers>
    )

    createRoot(el).render(appElement)
  },
  progress: {
    color: '#4B5563'
  }
})

// This will set light / dark mode on load...
initializeTheme()
