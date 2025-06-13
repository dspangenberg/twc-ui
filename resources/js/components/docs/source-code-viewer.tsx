import { cn } from '@/lib/utils'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { type BuiltinLanguage, codeToHtml } from 'shiki'
import { ClipboardButton } from '@/components/docs/clipboard-button'
import { useAppearance } from '@/hooks/use-appearance'

interface DemoCodePreviewProps {
  codePath?: string
  code?: string
  header?: React.ReactNode
  title?: string
  isComponent?: boolean
  language?: BuiltinLanguage
  fileName?: string
}

export const SourceCodeViewer: React.FC<DemoCodePreviewProps> = ({
  codePath,
  isComponent = false,
  language = 'typescript',
  code: rawCode,
  title,
  header,
  fileName
}) => {
  const [html, setHtml] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const {
    appearance
  } = useAppearance()

  const fetchSource = useCallback(async () => {
    if (rawCode) {
      setCode(rawCode)
    }
    if (codePath) {
      try {
        const response = await fetch(route(isComponent ? 'component-source' : 'source', { path: codePath }))
        const sourceText = await response.text()
        setCode(sourceText)
      } catch (error) {
        console.error('Error fetching source:', error)
        setCode('')
      }
    }
  }, [rawCode, codePath, isComponent])

  const generateHtml = useCallback(async () => {
    if (!code) return
    setHtml('')
    try {
      const generatedHtml = await codeToHtml(code, {
        lang: language,
        theme: appearance === 'light' ? 'github-light' : 'github-dark'
      })

      setHtml(generatedHtml)
    } catch (error) {
      console.error('Error generating HTML:', error)
      setHtml('')
    }
  }, [code, language, appearance])

  useEffect(() => {
    void fetchSource()
  }, [fetchSource])

  useEffect(() => {
    void generateHtml()
  }, [generateHtml])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-3">
      {title && <h3>{title}</h3>}
      <div className="w-full rounded-md border bg-muted text-sm">
        <div className="flex items-center ">
          {!!header ? header : (
            <div className="py-2 pl-4 font-medium flex-1 font-mono">{fileName}</div>
          )}
          <ClipboardButton code={code} />
        </div>
        <div className="rounded-md bg-muted">
          <div
            className={cn(
              'text-sm [&>.shiki]:max-h-80 [&>.shiki]:overflow-auto [&>.shiki]:rounded-b-md [&>.shiki]:bg-muted [&>.shiki]:p-4'
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
