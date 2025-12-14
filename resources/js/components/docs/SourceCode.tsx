import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { type BuiltinLanguage, codeToHtml } from 'shiki'
import { ClipboardButton } from '@/components/docs/clipboard-button'
import { LogoSpinner } from '@/components/twc-ui/logo-spinner'
import { useAppearance } from '@/hooks/use-appearance'
import { cn } from '@/lib/utils'
import { Button } from '../twc-ui/button'
import type { DemoCodeComponentType } from './DemoCodePreview'

interface DemoCodePreviewProps {
  codePath?: string
  code?: string
  header?: React.ReactNode
  type?: DemoCodeComponentType
  title?: string
  isComponent?: boolean
  language?: BuiltinLanguage
  fileName?: string
  hideHeader?: boolean
}

export const SourceCode: React.FC<DemoCodePreviewProps> = ({
  codePath,
  language = 'tsx',
  type = 'demo',
  code: rawCode,
  hideHeader = false,
  isComponent = false,
  title,
  header,
  fileName: propFileName
}) => {
  const [html, setHtml] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const fileName =
    '@/' + type + 's/' + (propFileName || (codePath ? codePath.split('/').pop() : ''))

  const { appearance } = useAppearance()

  const [isLoading, setIsLoading] = useState(true)
  const [collapsible, _setCollapsible] = useState(isComponent)
  const [expand, setExpand] = useState(false)

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
      setIsLoading(false)
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
    <div className="w-full space-y-3">
      {title && <h3>{title}</h3>}
      <div className="max-w-full overflow-hidden rounded-md border bg-muted text-sm">
        {!hideHeader && (
          <div className="flex items-center ">
            {header ? (
              header
            ) : (
              <div className="flex-1 py-2 pl-4 font-medium font-mono">{fileName}</div>
            )}
            <div className="pr-1">
              <ClipboardButton code={code} />
            </div>
          </div>
        )}
        <div
          className={cn('w-full overflow-x-hidden rounded-md bg-muted p-1.5 pt-0', {
            'pt-1.5': hideHeader
          })}
        >
          {isLoading ? (
            <div className=" absolute right-0 left-0">
              <LogoSpinner className="mx-auto" />
            </div>
          ) : (
            <div
              className={cn(
                'text-sm relative [&>.shiki]:max-h-80 [&>.shiki]:w-full [&>.shiki]:overflow-scroll [&>.shiki]:text-balance [&>.shiki]:rounded-b-md [&>.shiki]:bg-muted [&>.shiki]:p-4',
                {
                  '[&>.shiki]:max-h-[700px]': expand || !collapsible
                }
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
          {collapsible && (
            <div className={cn('flex items-center justify-center pt-1.5', {})}>
              <Button
                variant="ghost"
                aria-label="Expand/Collapse"
                onClick={() => setExpand(e => !e)}
              >
                {expand ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
