import type React from 'react'
import { Demo } from './demo'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer'
import DocsLayout from '@/layouts/docs-layout'

interface CodeProps {
  code: string
  documentation: string
  path: string
  title: string
}

const Code: React.FC<CodeProps> = ({ code, path, title, documentation }) => {
  return (
    <DocsLayout>
      <div className='doc mx-auto w-screen max-w-4xl gap-12 py-4'>
        <h1>(Base-) Button</h1>
        <p>Displays a button or a component that looks like a button.</p>

        <DemoCodePreview codePath="demo.tsx" demo={<Demo />} fileName="demo.tsx" />

        <MarkdownRenderer path="doc.md" />
      </div>
    </DocsLayout>
  )
}

export default Code
