import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

// Hilfsfunktion außerhalb der Komponente definieren
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export const TableOfContents = () => {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [_activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Alle Überschriften sammeln
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const items: TocItem[] = []

    headings.forEach(heading => {
      // Nur Überschriften im doc-Content-Bereich berücksichtigen
      const docContent = document.querySelector('.doc')
      if (docContent && docContent.contains(heading)) {
        const id = heading.id || generateId(heading.textContent || '')
        if (!heading.id) {
          heading.id = id
        }

        items.push({
          id,
          text: heading.textContent || '',
          level: Number.parseInt(heading.tagName.charAt(1))
        })
      }
    })

    setTocItems(items)

    // Intersection Observer für aktive Überschrift
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0
      }
    )

    headings.forEach(heading => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => {
      headings.forEach(heading => {
        if (heading.id) {
          observer.unobserve(heading)
        }
      })
    }
  }, [])

  // TOC ausblenden wenn 0 oder 1 Überschriften vorhanden sind
  if (tocItems.length <= 1) {
    return null
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <nav className="space-y-2">
      <h4 className="!text-sm mb-3 font-semibold text-gray-900 dark:text-gray-100">On this page</h4>
      <ul>
        {tocItems.map(item => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className="block w-full rounded px-2 py-1 text-left text-sm transition-colors"
              style={{
                paddingLeft: `${(item.level - 1) * 0.75 + 0.5}rem`
              }}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
