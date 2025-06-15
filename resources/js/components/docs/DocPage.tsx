import { ReactNode } from 'react'
import DocLayout from '@/layouts/docs-layout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { useDocs, DocsItem } from '@/hooks/use-docs'
import { Link, usePage } from '@inertiajs/react'

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

interface DocNavigationItemProps {
  item: DocsItem
  currentPath?: string
  depth?: number // Tiefe für Formatierung
}

const DocNavigationItem = ({
  item,
  currentPath,
  depth = 0
}: DocNavigationItemProps) => {
  const isActive = currentPath === item.route
  const isMainEntry = depth === 0

  if (item.type === 'directory') {
    return (
      <li className={isMainEntry ? '' : 'pb-3'}>
        <span className={`block font-bold ${
          isMainEntry
            ? 'text-foreground text-base mb-3' // Haupteinträge in Großbuchstaben
            : 'text-gray-900 dark:text-gray-100 text-sm ml-3'
        }`}
        >
          {item.title}
        </span>
        {item.children && item.children.length > 0 && (
          <ul className={`space-y-1 ${isMainEntry ? 'pb-2' : 'pt-2'}`}>
            {item.children.map((child, index) => (
              <DocNavigationItem
                key={`${child.path}-${index}`}
                item={child}
                currentPath={currentPath}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link
        href={item.route || '#'}
        className={`block px-3 py-0 text-sm rounded-md transition-colors ${
          isActive
            ? 'text-foreground'
            : isMainEntry
              ? 'text-foreground hover:underline font-medium'
              : 'text-muted-foreground hover:underline'
        }`}
      >
        {item.title}
      </Link>
      {item.children && item.children.length > 0 && (
        <ul className=" mt-1 space-y-1">
          {item.children.map((child, index) => (
            <DocNavigationItem
              key={`${child.path}-${index}`}
              item={child}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export const DocNavigation = () => {
  const {
    docsStructure,
    loading,
    error
  } = useDocs()
  const { url } = usePage()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 bg-muted rounded animate-pulse"></div>
        <div className="ml-4 space-y-2">
          <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Fehler beim Laden der Navigation: {error}
      </div>
    )
  }

  return (
    <nav>
      <ul className="space-y-5">
        {docsStructure.map((item, index) => (
          <DocNavigationItem
            key={`${item.path}-${index}`}
            item={item}
            currentPath={url}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  )
}

const DocPageContent = ({
  children,
  frontmatter
}: DocPageProps) => {
  return (
    <>
      <div className="flex mt-12 gap-4 mx-auto w-screen max-w-7xl">
        <aside className="w-48 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4 hidden lg:flex">
          <DocNavigation />
        </aside>
        <div className="doc gap-12 py-4 space-y-6 flex-1">
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
        <aside className="hidden lg:flex w-48 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4">
          <TableOfContents />
        </aside>
      </div>
    </>
  )
}
