import type { RouteParamsWithQueryOverload, Config } from 'ziggy-js'

declare global {
  const route: (<T extends string = string>(
    name: T,
    params?: RouteParamsWithQueryOverload,
    absolute?: boolean,
    config?: Config
  ) => string) & {
    current(): string | null
    current(name: string, params?: RouteParamsWithQueryOverload): boolean
    check(name: string): boolean
    has(name: string): boolean
  }
}
