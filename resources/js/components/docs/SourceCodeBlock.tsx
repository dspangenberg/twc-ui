import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockItem
} from '@/components/ui/code-block'

interface Props {
  target: string
  type: string
  path: string
}

export const SourceCodeBlock: React.FC<Props> = ({ target, type, path }) => {
  const [code, setCode] = useState<string>('')

  if (!target) {
    target = path
  }

  const fileName = target.split('/').pop()
  const codePath = fileName

  const language = (fileName?.endsWith('.tsx') ? 'tsx' : 'ts') as 'tsx' | 'ts'

  const fetchSource = useCallback(async () => {
    if (codePath) {
      let routeName: string

      switch (type) {
        case 'registry:ui':
          routeName = 'component-source'
          break
        case 'registry:hook':
          routeName = 'hook-source'
          break
        case 'registry:lib':
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
  }, [codePath, type])

  useEffect(() => {
    fetchSource()
  }, [fetchSource])

  const codeData = [
    {
      language,
      filename: path.replace('resources/js/', '') || '',
      code
    }
  ]

  return (
    <CodeBlock data={codeData} defaultValue={language}>
      <CodeBlockHeader>
        <CodeBlockFilename
          className="font-medium font-mono text-foreground text-sm"
          value={language}
        >
          {codeData[0].filename}
        </CodeBlockFilename>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockBody className="max-h-80">
        {item => (
          <CodeBlockItem key={item.language} value={item.language}>
            <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  )
}
