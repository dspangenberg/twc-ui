import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import * as z from 'zod'

export interface DocItem {
  title: string
  type: 'directory' | 'file'
  path: string
  route?: string
  children?: DocItem[]
  frontmatter?: Record<string, any>
}

// Zod-Schema für DocItem definieren (rekursiv)
const DocItemSchema: z.ZodType<DocItem> = z.lazy(() =>
  z.object({
    title: z.string(),
    type: z.enum(['directory', 'file']),
    path: z.string(),
    route: z.string().optional(),
    children: z.array(DocItemSchema).optional(),
    frontmatter: z.record(z.string(), z.any()).optional() // Hier: ersten Parameter (Key-Typ) hinzufügen
  })
)

// Schema für das gesamte Array

interface DocsStructureContextType {
  structure: DocItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const DocsStructureContext = createContext<DocsStructureContextType | null>(null)
const sortDocsItems = (items: DocItem[]): DocItem[] => {
  const priorityOrder: Record<string, number> = {
    'getting-started': 1,
    introduction: 2,
    installation: 3,
    quickstart: 4,
    'quick-start': 4,
    components: 10,
    'twiceware-ui': 1,
    'twiceware-ui-forms': 2,
    'react-aria': 3,
    hooks: 15,
    api: 20,
    examples: 30,
    guides: 40,
    advanced: 50,
    reference: 60,
    legal: 70,
    changelog: 100,
    faq: 110
  }

  const sortedItems = [...items].sort((a, b) => {
    const aOrder = typeof a.frontmatter?.order === 'number' ? a.frontmatter.order : null
    const bOrder = typeof b.frontmatter?.order === 'number' ? b.frontmatter.order : null

    if (aOrder !== null && bOrder !== null) {
      return aOrder - bOrder
    }

    if (aOrder !== null && bOrder === null) {
      return -1
    }

    if (aOrder === null && bOrder !== null) {
      return 1
    }

    const aName = (a.path.split('/').pop() || '').toLowerCase()
    const bName = (b.path.split('/').pop() || '').toLowerCase()

    const aPriority = priorityOrder[aName] ?? 999
    const bPriority = priorityOrder[bName] ?? 999

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1
    }

    return a.title.localeCompare(b.title)
  })

  return sortedItems.map(item => ({
    ...item,
    children: item.children && item.children.length > 0 ? sortDocsItems(item.children) : undefined
  }))
}

interface DocsStructureProviderProps {
  children: ReactNode
}

export function DocsStructureProvider({ children }: DocsStructureProviderProps) {
  const [structure, setStructure] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDocsStructure = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/docs-structure.json?v=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`Failed to load docs structure: ${response.status}`)
      }

      const rawData = await response.json()
      // Direkte Verwendung ohne Zod-Validierung
      const sortedData = sortDocsItems(rawData as DocItem[])
      setStructure(sortedData)
    } catch (err) {
      console.error('Error loading docs structure:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDocsStructure()
  }, [loadDocsStructure])

  const contextValue = useMemo<DocsStructureContextType>(
    () => ({
      structure,
      loading,
      error,
      refetch: loadDocsStructure
    }),
    [structure, loading, error, loadDocsStructure]
  )

  const Provider = DocsStructureContext.Provider

  return <Provider value={contextValue}>{children}</Provider>
}

function useDocsStructureContext(): DocsStructureContextType {
  const context = useContext(DocsStructureContext)

  if (!context) {
    throw new Error('useDocsStructureContext must be used within a DocsStructureProvider')
  }

  return context
}

interface UseDocsStructureReturn {
  structure: DocItem[]
  loading: boolean
  error: string | null
  findByPath: (path: string) => DocItem | null
  getAllFiles: () => DocItem[]
  getNavigationItems: () => DocItem[]
  refetch: () => void
}

export function useDocsStructure(): UseDocsStructureReturn {
  const { structure, loading, error, refetch } = useDocsStructureContext()

  const findByPath = useCallback(
    (targetPath: string): DocItem | null => {
      function searchInItems(items: DocItem[]): DocItem | null {
        for (const item of items) {
          if (item.path === targetPath) {
            return item
          }
          if (item.children) {
            const found = searchInItems(item.children)
            if (found) return found
          }
        }
        return null
      }

      return searchInItems(structure)
    },
    [structure]
  )

  const getAllFiles = useCallback((): DocItem[] => {
    function collectFiles(items: DocItem[]): DocItem[] {
      const files: DocItem[] = []

      for (const item of items) {
        if (item.type === 'file') {
          files.push(item)
        }
        if (item.children) {
          files.push(...collectFiles(item.children))
        }
      }

      return files
    }

    return collectFiles(structure)
  }, [structure])

  const getNavigationItems = useCallback((): DocItem[] => {
    return structure
  }, [structure])

  return {
    structure,
    loading,
    error,
    findByPath,
    getAllFiles,
    getNavigationItems,
    refetch
  }
}

export function useDocByPath(path: string) {
  const { findByPath, loading, error } = useDocsStructure()

  const doc = useMemo(() => {
    if (loading || error) return null
    return findByPath(path)
  }, [path, findByPath, loading, error])

  return {
    doc,
    loading,
    error
  }
}

export function useDocsNavigation() {
  const { structure, loading, error } = useDocsStructure()

  const navigationItems = useMemo(() => {
    if (loading || error || !structure.length) return []
    return structure
  }, [structure, loading, error])

  return {
    navigationItems,
    loading,
    error
  }
}

export function useBreadcrumb(currentPath: string) {
  const { structure } = useDocsStructureContext()

  const breadcrumbItems = useMemo(() => {
    if (!structure.length) return []

    const normalizedPath = currentPath.replace(/^\/docs\//, '')

    function buildBreadcrumb(
      items: DocItem[],
      targetPath: string,
      path: DocItem[] = []
    ): DocItem[] | null {
      for (const item of items) {
        const currentPath = [...path, item]

        if (item.type === 'file' && item.route === `/docs/${targetPath}`) {
          return currentPath
        }

        if (item.type === 'directory' && targetPath.startsWith(item.path + '/')) {
          if (item.children) {
            const found = buildBreadcrumb(item.children, targetPath, currentPath)
            if (found) return found
          }
        }
      }
      return null
    }

    const result = buildBreadcrumb(structure, normalizedPath)
    if (!result) {
      console.log('No breadcrumb found for path:', normalizedPath)
      return []
    }

    return result.map(item => {
      return {
        title: item.title,
        href: item.route || '#'
      }
    })
  }, [currentPath, structure])

  return breadcrumbItems
}
