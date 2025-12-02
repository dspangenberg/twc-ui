import { Home13Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, usePage } from '@inertiajs/react'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { useBreadcrumb, useDocsNavigation } from '@/hooks/use-docs-structure'
import DocLayout from '@/layouts/docs-layout'

interface DocItem {
  title: string
  type: 'directory' | 'file'
  path: string
  route?: string
  soon?: boolean
  children?: DocItem[]
  frontmatter?: Record<string, any>
}

interface Frontmatter {
  title?: string
  author?: string
  soon?: string
  wip?: boolean
  date?: string
  tags?: string[]
  order: number
  description?: string
  published?: boolean
}

interface DocPageProps {
  children: ReactNode
  frontmatter?: Frontmatter | null
}

export const DocPage = ({ children, frontmatter }: DocPageProps) => {
  return (
    <DocLayout>
      <DocPageContent frontmatter={frontmatter}>{children}</DocPageContent>
    </DocLayout>
  )
}

interface DocNavigationItemProps {
  item: DocItem
  currentRoute?: string
  depth?: number
}

const DocNavigationItem = ({ item, currentRoute, depth = 0 }: DocNavigationItemProps) => {
  // WICHTIG: Vergleiche mit der ROUTE, nicht dem Pfad
  const isActive = currentRoute === item.route
  const hasChildren = item.children && item.children.length > 0
  const showSoon = item.frontmatter?.soon === true
  const showWip = item.frontmatter?.wip === true

  if (item.type === 'directory') {
    return (
      <li className="mb-4">
        {item.route ? (
          <>
          <div className="flex items-center justify-between gap-2">
            {showSoon ? (
              <span
                className={`mb-2 block font-semibold text-sm ${
                  depth === 0
                    ? 'text-base text-foreground uppercase tracking-wide'
                    : depth === 1
                      ? 'ml-0 text-gray-900 dark:text-gray-100'
                      : 'ml-0 text-gray-800 dark:text-gray-200'
                }`}
              >
                {item.title}
              </span>
            ) : (
              <Link
                href={item.route}
                className={`mb-2 block font-semibold text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  depth === 0
                    ? 'text-base text-foreground uppercase tracking-wide'
                    : depth === 1
                      ? 'ml-0 text-gray-900 dark:text-gray-100'
                      : 'ml-0 text-gray-800 dark:text-gray-200'
                } ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                {item.title}
              </Link>
            )}
            {showSoon && (
              <span className="rounded-md bg-yellow-400 px-2 py-0.5 text-xs font-medium text-yellow-900">Soon</span>
            )}
          </div>
          </>
        ) : (
          <div
            className={`mb-2 font-semibold text-sm ${
              depth === 0
                ? 'text-base text-foreground uppercase tracking-wide'
                : depth === 1
                  ? 'ml-0 text-gray-900 dark:text-gray-100'
                  : 'ml-0 text-gray-800 dark:text-gray-200'
            }`}
          >
            {item.title}
          </div>
        )}
        {hasChildren && (
          <ul className={`list-none list-image-none ${depth === 0 ? 'mb-4' : 'mb-2'}`}>
            {item.children!.map((child, index) => (
              <DocNavigationItem
                key={`${child.path}-${index}`}
                item={child}
                currentRoute={currentRoute}
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
      <div className="flex items-center justify-between gap-2">
        {showSoon ? (
          <span
            className={`block rounded py-1 text-sm ${
              depth === 0 ? 'px-0 font-medium' : depth === 1 ? 'ml-0 px-3' : 'ml-0 px-3'
            } text-gray-600 dark:text-gray-400`}
          >
            {item.title}
          </span>
        ) : (
          <Link
            href={item.route || '#'}
            className={`block rounded py-1 text-sm transition-colors ${
              depth === 0 ? 'px-0 font-medium' : depth === 1 ? 'ml-0 px-3' : 'ml-0 px-3'
            } ${
              isActive
                ? 'font-medium text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            {item.title}
          </Link>
        )}
        {showSoon && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">Soon</span>
        )}
      </div>
      {hasChildren && (
        <ul className="mt-1 list-none space-y-1">
          {item.children!.map((child, index) => (
            <DocNavigationItem
              key={`${child.path}-${index}`}
              item={child}
              currentRoute={currentRoute}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function DocsNavigation() {
  const { navigationItems, loading } = useDocsNavigation()
  const { url } = usePage()

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 h-4 rounded bg-gray-200" />
        <div className="mb-2 h-4 rounded bg-gray-200" />
        <div className="mb-2 h-4 rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <nav className="space-y-2">
      <ul className="list-none list-image-none space-y-1">
        {navigationItems.map((item, index) => (
          <DocNavigationItem
            key={`${item.path}-${index}`}
            item={item}
            currentRoute={url}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  )
}

interface BreadcrumbProps {
  currentPath: string
}

const Breadcrumb = ({ currentPath }: BreadcrumbProps) => {
  const breadcrumbItems = useBreadcrumb(currentPath)

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav className="mb-6 flex items-center space-x-1 text-gray-500 text-sm">
      <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
        <HugeiconsIcon icon={Home13Icon} className="size-5" />
      </Link>
      <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
      <Link
        href="/docs/"
        className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
      >
        Docs
      </Link>
      {breadcrumbItems.map((item, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          {item.href === '#' ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
          ) : (
            <Link href={item.href} className="hover:text-gray-700 dark:hover:text-gray-300">
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

const DocPageContent = ({ children, frontmatter }: DocPageProps) => {
  const { url } = usePage()

  return (
    <>
      <div className="mx-auto mt-12 flex w-screen max-w-7xl gap-4">
        <aside className="sticky top-0 hidden h-screen w-64 flex-none space-y-4 overflow-y-auto p-4 lg:flex">
          <DocsNavigation />
        </aside>
        <div className="doc flex-1 gap-12 space-y-6 py-4">
          {/* Breadcrumb Navigation */}
          <Breadcrumb currentPath={url} />

          {frontmatter && (
            <header className="mb-8 pb-6">
              <h1 className="mb-4 font-bold text-4xl">{frontmatter?.title}</h1>

              {frontmatter.description && (
                <p className="mb-4 text-base text-muted-foreground">{frontmatter.description}</p>
              )}

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex gap-2">
                  {frontmatter.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm"
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
        <aside className="sticky top-0 hidden h-screen w-48 flex-none space-y-4 overflow-y-auto p-4 lg:flex">
          <TableOfContents />
        </aside>
      </div>
    </>
  )
}
