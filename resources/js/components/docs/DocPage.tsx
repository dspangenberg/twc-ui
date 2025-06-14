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

interface MenuItemsProps {
  title: string
  route: string
  activeRoute?: string
  children?: MenuItemsProps[]
}

interface MenuProps {
  title: string
  activeRoute?: string
  children?: MenuItemsProps[]
}

export const DocMenu: MenuProps[] = [{
  title: 'Getting Started',
  activeRoute: '/docs/introduction',
  children: [
    {
      title: 'Introduction',
      route: '/docs/introduction'
    }
  ]
},
  {
    title: 'Components',
    children: [
      {
        title: 'Button',
        route: '/docs/components/button',
        children: [{
          title: '(Base-) Button',
          route: '/docs/components/button'
        }]
      },
      {
        title: 'Navigaton',
        route: '/docs/components/navigation',
        children: [{
          title: 'Tabs',
          route: '/docs/components/tabs'
        }]
      }
    ]
  }
]

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

interface DocNavigationProps {
  items: MenuProps[]
}

export const DocNavigation = () => {
  return (
    <ul className="space-y-2">
      {DocMenu.map((item, index) => (
        <li key={index}>
          <span className="font-bold">
            {item.title}
          </span>
          {item.children && (
            <ul className="ml-4 space-y-2">
              {item.children.map((child, index) => (
                <li key={index}>
                  <a href={child.route}>{child.title}</a>
                  {child.children && (
                    <ul className="ml-4">
                      {child.children.map((grandChild, index) => (
                        <li key={index}>
                          <a href={grandChild.route}>{grandChild.title}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
  )
}

const DocPageContent = ({
  children,
  frontmatter
}: DocPageProps) => {

  return (
    <>
      <div className="flex mt-12 gap-4 mx-auto w-screen max-w-7xl ">
        <aside className="w-48 p-4 sticky top-0 h-screen overflow-y-auto flex-none space-y-4 hidden lg:flex ">
          <DocNavigation />
        </aside>
        <div className="doc  gap-12 py-4 space-y-6 flex-1">
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
