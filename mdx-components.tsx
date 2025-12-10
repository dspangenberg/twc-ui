import type { MDXComponents } from 'mdx/types'
import { sharedComponents } from './resources/js/mdx-components'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedComponents,
    ...components,
  }
}
