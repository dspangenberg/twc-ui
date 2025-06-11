import type React from 'react'
import { Demo } from '../demos/button/default'
import { DemoCodePreview } from '@/components/docs/DemoCodePreview'
import DocsLayout from '@/layouts/docs-layout'
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer'
import { InstallationCommand } from '@/components/docs/install-command'
import { InstallationSection } from '@/components/docs/installation-section'
import { WithIconDemo } from '../demos/button/with-icon'
import { LoadingStateDemo } from '@/pages/demos/button/loading-state'

const Button: React.FC = ({}) => {
  return (
    <DocsLayout>
      <div className="doc mx-auto w-screen max-w-4xl gap-12 py-4 space-y-6">
        <div>
          <h1>(Base-) Button</h1>
          <p className="font-bold">Displays a button.</p>
        </div>


        <DemoCodePreview codePath="button/default.tsx" demo={<Demo />} fileName="demo.tsx" />

        <div className="space-y-0">
          <h2>Installation</h2>
          <InstallationSection
            dependencies={['react-aria-components', '@hugeicons/react', 'tailwind-variants']}
            components={['base-button', 'tooltip', 'button']}
            copyAndPaste={
              <div>hi</div>
            }
          >
            <InstallationCommand command="execute" params="shadcn@latest add ~website/r/twc-ui/button" />
          </InstallationSection>

        </div>

        <div>
          <h2>Examples</h2>

          <div>

            <DemoCodePreview codePath="button/with-icon.tsx" demo={<WithIconDemo />} title="With Icon"
                             fileName="demo.tsx"
            />

            <DemoCodePreview codePath="button/loading-state.tsx" demo={<LoadingStateDemo />} title="With loading state"
                             fileName="demo.tsx"
            />

          </div>
        </div>

        <MarkdownRenderer path="button.md" />

      </div>
    </DocsLayout>
  )
}

export default Button
