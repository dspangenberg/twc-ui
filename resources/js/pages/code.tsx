import type React from 'react'
import Demo from './demo'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'

interface CodeProps {
  code: string
  documentation: string
  path: string
  title: string
}

const Code: React.FC<CodeProps> = ({ code, path, title, documentation }) => {
  return (
    <div className="mx-auto w-screen max-w-4xl gap-12">
      <div className="documentation-page">
        <h1>Dokumentation</h1>
      </div>

      <DemoCodePreview code={code} demo={<Demo />} title="Heading small" fileName={path}>
        {documentation}
      </DemoCodePreview>
    </div>
  )
}

export default Code
