import { ReactNode } from 'react'
import DocLayout from '@/layouts/docs-layout'
import { TableOfContents } from '@/components/docs/TableOfContents'

interface Frontmatter {
  title?: string;
  author?: string;
  date?: string;
  tags?: string[];
  description?: string;
  published?: boolean;
}

interface DocPageProps {
  children: ReactNode
  frontmatter?: Frontmatter | null
}

export const DocPage = ({
  children,
  frontmatter
}: DocPageProps) => {
  return (
    <DocLayout>
      <DocPageContent frontmatter={frontmatter}>
        {children}
      </DocPageContent>
    </DocLayout>
  )
}

const DocPageContent = ({
  children,
  frontmatter
}: DocPageProps) => {

  return (
    <>
      <div className="flex mt-12">
        <div className="doc mx-auto w-screen max-w-4xl gap-12 py-4 space-y-6 flex-1">
          {frontmatter && (
            <header className="mb-8 pb-6">
              <h1 className="text-4xl font-bold mb-4">{frontmatter?.title}</h1>

              {frontmatter.description && (
                <p className="text-base text-muted-foreground mb-4">
                  {frontmatter.description}
                </p>
              )}

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex gap-2">
                  {frontmatter.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                  #{tag}
                </span>
                  ))}
                </div>
              )}
            </header>
          )}

          {children}
        </div>
        <aside className="w-64 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4">
          <h6 className="text-sm font-medium">On this page</h6>
          <TableOfContents />
        </aside>
      </div>
    </>
  )
}
