import { ReactNode } from 'react'
import DocLayout from '@/layouts/docs-layout'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { Link, usePage } from '@inertiajs/react'
import { useDocsNavigation, useBreadcrumb } from '@/hooks/use-docs-structure'

interface DocItem {
  title: string;
  type: 'directory' | 'file';
  path: string;
  route?: string;
  children?: DocItem[];
  frontmatter?: Record<string, any>;
}

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
  item: DocItem
  currentPath?: string
  depth?: number
}

const DocNavigationItem = ({
  item,
  currentPath,
  depth = 0
}: DocNavigationItemProps) => {
  const isActive = currentPath === item.route
  const hasChildren = item.children && item.children.length > 0

  if (item.type === 'directory') {
    return (
      <li className="mb-4">
        <div className={`font-semibold text-sm mb-2 ${
          depth === 0
            ? 'text-foreground text-base uppercase tracking-wide'
            : depth === 1
              ? 'text-gray-900 dark:text-gray-100 ml-3'
              : 'text-gray-800 dark:text-gray-200 ml-6'
        }`}
        >
          {item.title}
        </div>
        {hasChildren && (
          <ul className={`space-y-1 ${depth === 0 ? 'mb-4' : 'mb-2'}`}>
            {item.children!.map((child, index) => (
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

  // File item
  return (
    <li>
      <Link
        href={item.route || '#'}
        className={`block py-1 text-sm rounded transition-colors ${
          depth === 0
            ? 'px-0 font-medium'
            : depth === 1
              ? 'px-3 ml-3'
              : 'px-3 ml-6'
        } ${
          isActive
            ? 'text-blue-600 dark:text-blue-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        {item.title}
      </Link>
      {hasChildren && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child, index) => (
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

function DocsNavigation () {
  const {
    navigationItems,
    loading
  } = useDocsNavigation()
  const { url } = usePage()

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
      </div>
    )
  }

  return (
    <nav className="space-y-2">
      {navigationItems.map((item, index) => (
        <DocNavigationItem
          key={`${item.path}-${index}`}
          item={item}
          currentPath={url}
          depth={0}
        />
      ))}
    </nav>
  )
}

interface BreadcrumbProps {
  currentPath: string
}

import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = ({ currentPath }: BreadcrumbProps) => {
  const breadcrumbItems = useBreadcrumb(currentPath)

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Link
        href="/docs"
        className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
      >
        <Home className="h-4 w-4 mr-1" />
        Docs
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.title}
            </span>
          ) : (
            <Link
              href={item.route || '#'}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

const DocPageContent = ({
  children,
  frontmatter
}: DocPageProps) => {
  const { url } = usePage()

  // Den Pfad aus der URL extrahieren (ohne /docs/ Prefix)
  const currentPath = url.replace('/docs/', '')

  return (
    <>
      <div className="flex mt-12 gap-4 mx-auto w-screen max-w-7xl">
        <aside className="w-64 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4 hidden lg:flex">
          <DocsNavigation />
        </aside>
        <div className="doc gap-12 py-4 space-y-6 flex-1">
          {/* Breadcrumb Navigation */}
          <Breadcrumb currentPath={currentPath} />

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
