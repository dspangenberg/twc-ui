import type React from 'react'
import DocsLayout from '@/layouts/docs-layout'
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer'

const Code: React.FC<CodeProps> = ({}) => {
  return (
    <DocsLayout>
      <div className="doc mx-auto w-screen max-w-4xl gap-12 py-4 space-y-6">
        <div>
          <h1>Introduction</h1>
        </div>

        <MarkdownRenderer path="introduction.md" />

      </div>
    </DocsLayout>
  )
}

export default Code
