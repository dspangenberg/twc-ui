import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'
import { DemoContainer } from '@/components/docs/DemoContainer'

export const Demo = () => {
  return (
    <DemoContainer>
      <Tabs className="text-sm">
        <TabList aria-label="History of Ancient Rome">
          <Tab id="FoR">Stammdaten</Tab>
          <Tab id="MaR">Komunikation</Tab>
          <Tab id="Emp">Empire</Tab>
        </TabList>
        <TabPanel id="FoR">Stammdaten</TabPanel>
        <TabPanel id="MaR">Komunikation</TabPanel>
        <TabPanel id="Emp">Empire</TabPanel>
      </Tabs>
    </DemoContainer>
  )
}

export default Demo
