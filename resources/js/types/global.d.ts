import type { RouteParamsWithQueryOverload, Config } from 'ziggy-js'

declare global {
  const route: (<T extends string = string>(
    name?: T,
    params?: RouteParamsWithQueryOverload,
    absolute?: boolean,
    config?: Config
  ) => string) & {
    current (): string | null
    current (name: string, params?: RouteParamsWithQueryOverload): boolean
    check (name: string): boolean
    has (name: string): boolean
  }
}

import type { PageProps as InertiaPageProps, VisitOptions } from '@inertiajs/core'
import { AxiosInstance } from 'axios'
import { route as ziggyRoute } from 'ziggy-js'
import { PageProps as AppPageProps } from './'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: VisitOptions;
  }
}
