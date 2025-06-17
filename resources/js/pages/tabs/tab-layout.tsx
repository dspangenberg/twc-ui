import type React from 'react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Tab, TabList, Tabs, TabPanel } from '@/components/twc-ui/tabs'

interface TabLayoutProps {
  children: React.ReactNode
}

const TabLayout: React.FC<TabLayoutProps> = ({
  children
}) => {

  let name = route().current()

  return (
    <DemoContainer className="flex-col">
      <Tabs className="mx-auto" defaultSelectedKey={name}>
        <TabList aria-label="Example Tabs">
          <Tab id="tab-one" href={route('tab-one', {}, false)}>Tab 1</Tab>
          <Tab id="tab-two" href={route('tab-two', {}, false)}>Tab 2</Tab>
          <Tab id="tab-three" href={route('tab-three', {}, false)}>Tab 3</Tab>
        </TabList>

        <div className="mt-6 w-full">
          {children}
        </div>

      </Tabs>
    </DemoContainer>
  )
}

export default TabLayout
