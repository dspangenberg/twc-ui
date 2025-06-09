import type React from 'react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface MarkdownViewerProps {
  filePath: string
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(filePath)

        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Datei: ${response.status}`)
        }

        const text = await response.text()
        setContent(text)
        setError(null)
      } catch (err) {
        setError(
          `Fehler beim Laden der Markdown-Datei: ${err instanceof Error ? err.message : String(err)}`
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkdown()
  }, [filePath])

  if (isLoading) {
    return <div>Lade Dokumentation...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="markdown-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
