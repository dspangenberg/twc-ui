import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  path: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ path }) => {
  const [md, setMd] = useState<string>('')

  const fetchMarkdown = useCallback(async () => {
    try {
      const response = await fetch(route('md', { path }))
      const sourceText = await response.text()
      setMd(sourceText)
    } catch (error) {
      console.error('Error fetching source:', error)
      setMd('')
    }
  }, [path])

  useEffect(() => {
    void fetchMarkdown()
  }, [path])

  return (
    <div className="docs">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
    </div>
  )
}
