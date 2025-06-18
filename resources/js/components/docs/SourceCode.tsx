import { cn } from '@/lib/utils'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { type BuiltinLanguage, codeToHtml } from 'shiki'
import { ClipboardButton } from '@/components/docs/clipboard-button'
import { useAppearance } from '@/hooks/use-appearance'
import { DemoCodeComponentType } from './DemoCodePreview'

interface DemoCodePreviewProps {
  codePath?: string
  code?: string
  header?: React.ReactNode
  type?: DemoCodeComponentType
  title?: string
  isComponent?: boolean
  language?: BuiltinLanguage
  fileName?: string
}

export const SourceCode: React.FC<DemoCodePreviewProps> = ({
  codePath,
  language = 'tsx',
  type = 'demo',
  code: rawCode,
  title,
  header,
  fileName: propFileName
}) => {
  const [html, setHtml] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const fileName = propFileName || (codePath ? codePath.split('/').pop() : '')

  const {
    appearance
  } = useAppearance()

  const fetchSource = useCallback(async () => {
    if (rawCode) {
      setCode(rawCode)
    }
    if (codePath) {

      let routeName: string

      switch (type) {
        case 'component':
          routeName = 'component-source'
          break
        case 'hook':
          routeName = 'hook-source'
          break
        default:
          routeName = 'source'
      }

      console.log(routeName)

      try {
        const response = await fetch(route(routeName, { path: codePath }))
        const sourceText = await response.text()
        setCode(sourceText)
      } catch (error) {
        console.error('Error fetching source:', error)
        setCode('')
      }
    }
  }, [rawCode, codePath, type])

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
    <div className="space-y-3 w-full">
      {title && <h3>{title}</h3>}
      <div className="rounded-md border bg-muted text-sm max-w-full overflow-hidden">
        <div className="flex items-center ">
          {header ? header : (
            <div className="py-2 pl-4 font-medium flex-1 font-mono">{fileName}</div>
          )}
          <ClipboardButton code={code} />
        </div>
        <div className="rounded-md bg-muted overflow-x-hidden w-full p-1.5 pt-0">
          <pre
            className={cn(
              'text-sm [&>.shiki]:w-full [&>.shiki]:text-balance [&>.shiki]:max-h-80 [&>.shiki]:overflow-scroll [&>.shiki]:rounded-b-md [&>.shiki]:bg-muted [&>.shiki]:p-4'
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
