import type React from 'react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Tab, TabList, Tabs } from '@/components/twc-ui/tabs'

interface TabLayoutProps {
  children: React.ReactNode
}

export const LinkDemo: React.FC<TabLayoutProps> = ({
  children
}) => {
  return (
    <DemoContainer>
      <Tabs variant="classic" className="w-lg">
        <TabList aria-label="History of Ancient Rome" className="flex-1 bg-page-content border-b justify-start">
          <Tab id="tab-one" href={route('tab-one')}>Tab 1</Tab>
          <Tab id="tab-two" href={route('tab-one')}>Tab 2</Tab>
          <Tab id="tab-three" href={route('tab-one')}>Tab 3</Tab>
        </TabList>
      </Tabs>
      <div>
        {children}
      </div>
    </DemoContainer>
  )
}

export default LinkDemo
