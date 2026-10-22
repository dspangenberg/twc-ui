import type { VisitOptions } from '@inertiajs/core'

declare global {
  const route: typeof import('ziggy-js').route
}

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: VisitOptions
  }
}
