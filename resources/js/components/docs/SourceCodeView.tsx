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

export const SourceCodeView: React.FC<DemoCodePreviewProps> = ({
  codePath,
  language = 'tsx',
  type = 'demo',
  code: rawCode,
  hideHeader = true,
  isComponent = false,
  title,
  header,
  fileName: propFileName
}) => {
  const [html, setHtml] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const fileName =
    type === 'lib'
      ? `@/${type}/${propFileName || (codePath ? codePath.split('/').pop() : '')}`
      : `@/${type}s/${propFileName || (codePath ? codePath.split('/').pop() : '')}`
  const { appearance } = useAppearance()

  const [isLoading, setIsLoading] = useState(false)
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
        case 'lib':
          routeName = 'lib-source'
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
        theme: appearance === 'light' ? 'github-light' : 'github-dark',
        defaultColor: false,
        cssVariablePrefix: '--shiki-'
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
    <div className="w-full">
      <div className={cn('p w-full overflow-x-hidden rounded-b-md border border-t-0 bg-muted')}>
        {isLoading ? (
          <div className="absolute right-0 left-0">
            <LogoSpinner className="mx-auto" />
          </div>
        ) : (
          <div
            className={cn('relative overflow-hidden rounded-b-md bg-accent/20 text-sm', {
              'max-h-175': expand || !collapsible
            })}
          >
            <div
              className="[&>.shiki]:max-h-80 [&>.shiki]:w-full [&>.shiki]:overflow-scroll [&>.shiki]:bg-neutral-50! [&>.shiki]:p-4 [&>.shiki]:dark:bg-neutral-900!"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <div className="absolute top-1 right-1">
              <ClipboardButton code={code} />
            </div>
          </div>
        )}
        {collapsible && (
          <div className={cn('flex items-center justify-center pt-1.5', {})}>
            <Button variant="ghost" aria-label="Expand/Collapse" onClick={() => setExpand(e => !e)}>
              {expand ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
