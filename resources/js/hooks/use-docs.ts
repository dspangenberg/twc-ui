import { useState, useEffect } from 'react'

export interface DocsFrontmatter {
  title?: string
  author?: string
  date?: string
  tags?: string[]
  description?: string
  published?: boolean
  order?: number
}

export interface DocsItem {
  title: string
  type: 'directory' | 'file'
  path: string
  route?: string
  originalName?: string
  frontmatter?: DocsFrontmatter
  children?: DocsItem[]
}

const sortDocsItems = (items: DocsItem[]): DocsItem[] => {
  // Definiere die gewünschte Reihenfolge
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
    'changelog': 100,
    'faq': 110
  }

  const sortedItems = [...items].sort((a, b) => {
    // Erst nach order aus Frontmatter sortieren (falls vorhanden)
    const aOrder = a.frontmatter?.order
    const bOrder = b.frontmatter?.order

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder
    }

    if (aOrder !== undefined) return -1
    if (bOrder !== undefined) return 1

    // Dann nach vordefinierter Priorität
    const aName = (a.originalName || a.path.split('/').pop() || '').toLowerCase()
    const bName = (b.originalName || b.path.split('/').pop() || '').toLowerCase()

    const aPriority = priorityOrder[aName] ?? 999
    const bPriority = priorityOrder[bName] ?? 999

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // Schließlich alphabetisch
    return a.title.localeCompare(b.title)
  })

  // Rekursiv für Kinder sortieren
  return sortedItems.map(item => ({
    ...item,
    children: item.children ? sortDocsItems(item.children) : undefined
  }))
}

export const useDocs = () => {
  const [docsStructure, setDocsStructure] = useState<DocsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocsStructure = async () => {
      try {
        const response = await fetch('/api/docs/structure')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Dokumentationsstruktur')
        }
        const data = await response.json()

        // Sortierung anwenden
        const sortedData = sortDocsItems(data)
        setDocsStructure(sortedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      } finally {
        setLoading(false)
      }
    }

    fetchDocsStructure()
  }, [])

  return {
    docsStructure,
    loading,
    error
  }
}
