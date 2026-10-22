import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import ReactDOMServer from 'react-dom/server'
import type { Config, RouteName } from 'ziggy-js'
import { route } from '../../vendor/tightenco/ziggy'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createServer(page =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: title => `${title} - ${appName}`,
    resolve: (name: string) =>
      resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob<{ default: React.ComponentType }>('./pages/**/*.tsx')
      ) as any,
    setup: ({ App, props }) => {
      const ziggy = page.props.ziggy as Config & { location: string }
      ;(global as any).route = (name: RouteName, params?: any, absolute?: boolean) =>
        route(name as any, params as any, absolute, {
          ...ziggy,
          location: new URL(ziggy.location)
        })

      return <App {...props} />
    }
  })
)
