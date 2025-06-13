// components/docs/TableOfContents.tsx
import React, { useEffect, useState } from 'react'

interface TocItem {
  id: string
  title: string
  level: number
}

export const TableOfContents: React.FC<{ mdxContent?: string }> = ({ mdxContent }) => {
  const [toc, setToc] = useState<TocItem[]>([])

  useEffect(() => {
    // Extrahiere Headings aus dem DOM
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const tocItems: TocItem[] = Array.from(headings).map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      title: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }))

    setToc(tocItems)
  }, [mdxContent])

  return (
    <nav className="toc">
      <ul className="text-sm">
        {toc.map((item) => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
