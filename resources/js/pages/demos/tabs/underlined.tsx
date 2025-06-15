import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { DemoContainer } from '@/components/docs/DemoContainer'

export const Demo = () => {
  return (
    <DemoContainer>
      <Tabs variant="underlined" className="w-lg">
        <TabList aria-label="History of Ancient Rome" className="flex-1 bg-page-content border-b justify-start">
          <Tab id="base-data">Stammdaten</Tab>
          <Tab id="communication">Kommunikation</Tab>
          <Tab id="notes">Notes</Tab>
        </TabList>
        <TabPanel id="base-data">Stammdaten</TabPanel>
        <TabPanel id="communication">Kommunikation</TabPanel>
        <TabPanel id="notes">Notes</TabPanel>
      </Tabs>
    </DemoContainer>
  )
}

export default Demo
