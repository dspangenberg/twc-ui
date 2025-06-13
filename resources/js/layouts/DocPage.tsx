import { ReactNode } from 'react'
import DocLayout from '@/layouts/docs-layout'
import { TableOfContents } from '@/components/docs/TableOfContents'

interface DocPageProps {
  children: ReactNode
}

export const DocPage = ({ children }: DocPageProps) => {
  return (
    <DocLayout>
      <div className="flex">
        <div className="doc mx-auto w-screen max-w-4xl gap-12 py-4 space-y-6 flex-1">
          {children}
        </div>
        <aside className="w-64 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4">
          <h4 className="!text-sm">On this page</h4>
          <TableOfContents />
          <h4 className="!text-sm">Contribute</h4>

        </aside>
      </div>
    </DocLayout>
  )
}
