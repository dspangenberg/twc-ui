import { useState, useEffect, useCallback, useMemo, createContext, useContext, ReactNode } from 'react'
import { z } from 'zod'

export interface DocItem {
  title: string;
  type: 'directory' | 'file';
  path: string;
  route?: string;
  children?: DocItem[];
  frontmatter?: Record<string, any>;
}

// Zod-Schema für Frontmatter definieren
const DocsFrontmatterSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  order: z.number().optional()
}).catchall(z.any())

// Zod-Schema für DocItem definieren (rekursiv)
const DocItemSchema: z.ZodType<DocItem> = z.lazy(() => z.object({
  title: z.string(),
  type: z.enum(['directory', 'file']),
  path: z.string(),
  route: z.string().optional(),
  children: z.array(DocItemSchema).optional(),
  frontmatter: z.record(z.any()).optional()
}))

// Schema für das gesamte Array
const DocsStructureSchema = z.array(DocItemSchema)

interface DocsStructureContextType {
  structure: DocItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Context erstellen
const DocsStructureContext = createContext<DocsStructureContextType | null>(null)

// Erweiterte Sortierungslogik
const sortDocsItems = (items: DocItem[]): DocItem[] => {
  const priorityOrder: Record<string, number> = {
    'getting-started': 1,
    'introduction': 2,
    'installation': 3,
    'quickstart': 4,
    'quick-start': 4,
    'components': 10,
    'api': 20,
    'examples': 30,
    'guides': 40,
    'advanced': 50,
    'reference': 60,
    'legal': 70,
    'changelog': 100,
    'faq': 110
  }

  const sortedItems = [...items].sort((a, b) => {
    const aOrder = a.frontmatter?.order
    const bOrder = b.frontmatter?.order

    if (typeof aOrder === 'number' && typeof bOrder === 'number') {
      return aOrder - bOrder
    }

    if (typeof aOrder === 'number') return -1
    if (typeof bOrder === 'number') return 1

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
    children: item.children && item.children.length > 0
      ? sortDocsItems(item.children)
      : undefined
  }))
}

// Provider Component
interface DocsStructureProviderProps {
  children: ReactNode
}

export function DocsStructureProvider ({ children }: DocsStructureProviderProps) {
  const [structure, setStructure] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDocsStructure = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/docs-structure.json')

      if (!response.ok) {
        throw new Error(`Failed to load docs structure: ${response.status}`)
      }

      const rawData = await response.json()

      // Validierung mit Zod
      const validatedData = DocsStructureSchema.parse(rawData)

      // Sortierung anwenden
      const sortedData = sortDocsItems(validatedData)
      setStructure(sortedData)
    } catch (err) {
      console.error('Error loading docs structure:', err)

      if (err instanceof z.ZodError) {
        const errorMessage = `Invalid docs structure format: ${
          err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        }`
        setError(errorMessage)
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDocsStructure()
  }, [loadDocsStructure])

  const contextValue = useMemo<DocsStructureContextType>(() => ({
    structure,
    loading,
    error,
    refetch: loadDocsStructure
  }), [structure, loading, error, loadDocsStructure])

  const Provider = DocsStructureContext.Provider

  return (
    <Provider value={contextValue}>
      {children}
    </Provider>
  )
}

// Hook um Context zu verwenden
function useDocsStructureContext (): DocsStructureContextType {
  const context = useContext(DocsStructureContext)

  if (!context) {
    throw new Error('useDocsStructureContext must be used within a DocsStructureProvider')
  }

  return context
}

interface UseDocsStructureReturn {
  structure: DocItem[];
  loading: boolean;
  error: string | null;
  findByPath: (path: string) => DocItem | null;
  getAllFiles: () => DocItem[];
  getNavigationItems: () => DocItem[];
  refetch: () => void;
}

export function useDocsStructure (): UseDocsStructureReturn {
  const {
    structure,
    loading,
    error,
    refetch
  } = useDocsStructureContext()

  // Memoized Hilfsfunktion: Dokument nach Pfad finden
  const findByPath = useCallback((targetPath: string): DocItem | null => {
    function searchInItems (items: DocItem[]): DocItem | null {
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
  }, [structure])

  // Memoized Hilfsfunktion: Alle Dateien sammeln
  const getAllFiles = useCallback((): DocItem[] => {
    function collectFiles (items: DocItem[]): DocItem[] {
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

  // Navigation-Items
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

// Bestehende Hooks bleiben gleich, nutzen aber den Context
export function useDocByPath (path: string) {
  const {
    findByPath,
    loading,
    error
  } = useDocsStructure()

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

export function useDocsNavigation () {
  const {
    structure,
    loading,
    error
  } = useDocsStructure()

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

export function useBreadcrumb (currentPath: string) {
  const { structure } = useDocsStructure()

  const breadcrumb = useMemo(() => {
    if (!structure.length) return []

    function buildBreadcrumb (items: DocItem[], targetPath: string, path: DocItem[] = []): DocItem[] | null {
      for (const item of items) {
        const currentPath = [...path, item]

        if (item.path === targetPath) {
          return currentPath
        }

        if (item.children) {
          const found = buildBreadcrumb(item.children, targetPath, currentPath)
          if (found) return found
        }
      }
      return null
    }

    const result = buildBreadcrumb(structure, currentPath)
    return result || []
  }, [currentPath, structure])

  return breadcrumb
}
