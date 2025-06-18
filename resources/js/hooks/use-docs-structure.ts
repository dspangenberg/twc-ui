import { useState, useEffect, useCallback, useMemo } from 'react'
import { z } from 'zod'

// Zod-Schema für Frontmatter definieren
const DocsFrontmatterSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  order: z.number().optional()
}).catchall(z.any()) // Erlaubt zusätzliche Eigenschaften

// Zod-Schema für DocItem definieren (rekursiv)
const DocItemSchema: z.ZodType<DocItem> = z.lazy(() => z.object({
  title: z.string(),
  type: z.enum(['directory', 'file']),
  path: z.string(),
  route: z.string().optional(),
  children: z.array(DocItemSchema).optional(),
  frontmatter: z.record(z.any()).optional() // Flexiblere Frontmatter-Validierung
}))

// Schema für das gesamte Array
const DocsStructureSchema = z.array(DocItemSchema)

export interface DocItem {
  title: string;
  type: 'directory' | 'file';
  path: string;
  route?: string;
  children?: DocItem[];
  frontmatter?: Record<string, any>;
}

interface UseDocsStructureReturn {
  structure: DocItem[];
  loading: boolean;
  error: string | null;
  findByPath: (path: string) => DocItem | null;
  getAllFiles: () => DocItem[];
  getNavigationItems: () => DocItem[];
}

// Erweiterte Sortierungslogik mit Frontmatter-Unterstützung
const sortDocsItems = (items: DocItem[]): DocItem[] => {
  // Definiere die gewünschte Reihenfolge für Hauptkategorien
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
    // 1. Erst nach order aus Frontmatter sortieren (falls vorhanden)
    const aOrder = a.frontmatter?.order
    const bOrder = b.frontmatter?.order

    if (typeof aOrder === 'number' && typeof bOrder === 'number') {
      return aOrder - bOrder
    }

    if (typeof aOrder === 'number') return -1
    if (typeof bOrder === 'number') return 1

    // 2. Dann nach vordefinierter Priorität für Hauptkategorien
    const aName = (a.path.split('/').pop() || '').toLowerCase()
    const bName = (b.path.split('/').pop() || '').toLowerCase()

    const aPriority = priorityOrder[aName] ?? 999
    const bPriority = priorityOrder[bName] ?? 999

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // 3. Verzeichnisse vor Dateien
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1
    }

    // 4. Schließlich alphabetisch
    return a.title.localeCompare(b.title)
  })

  // Rekursiv für Kinder sortieren
  return sortedItems.map(item => ({
    ...item,
    children: item.children && item.children.length > 0
      ? sortDocsItems(item.children)
      : undefined
  }))
}

export function useDocsStructure (): UseDocsStructureReturn {
  const [structure, setStructure] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocsStructure () {
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
          // Spezielle Behandlung für Zod-Validierungsfehler
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
    }

    loadDocsStructure()
  }, [])

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

  // Navigation-Items - behält die komplette Struktur mit Kindern bei
  const getNavigationItems = useCallback((): DocItem[] => {
    return structure
  }, [structure])

  return {
    structure,
    loading,
    error,
    findByPath,
    getAllFiles,
    getNavigationItems
  }
}

// Zusätzliche Hooks bleiben unverändert...
export function useDocByPath (path: string) {
  const {
    structure,
    loading,
    error,
    findByPath
  } = useDocsStructure()

  const doc = useMemo(() => {
    if (loading || error || !structure.length) return null
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
