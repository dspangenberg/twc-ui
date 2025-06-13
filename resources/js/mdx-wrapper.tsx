import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { sharedComponents } from '@/mdx-components'

interface MdxWrapperProps {
  Component: React.ComponentType
}

export const MdxWrapper = ({ Component }: MdxWrapperProps) => {
  return (
    <MDXProvider components={sharedComponents}>
      <Component />
    </MDXProvider>
  )
}
