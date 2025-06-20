import { MDXProvider } from '@mdx-js/react'
import type React from 'react'
import { sharedComponents } from '@/mdx-components'

interface Frontmatter {
  title?: string
  author?: string
  date?: string
  tags?: string[]
  description?: string
  published?: boolean
}

interface MdxWrapperProps {
  Component: React.ComponentType<{ frontmatter?: Frontmatter }>
  frontmatter?: Frontmatter
}

export const MdxWrapper = ({ Component, frontmatter }: MdxWrapperProps) => {
  return (
    <MDXProvider components={sharedComponents}>
      <Component frontmatter={frontmatter} />
    </MDXProvider>
  )
}

// Export des Frontmatter-Types
export type { Frontmatter }
