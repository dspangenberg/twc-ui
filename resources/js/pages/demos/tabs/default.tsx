import { Button } from '@/components/twc-ui/button'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'

export const Demo = () => {
  return (

    <Tabs variant="classic">
      <TabList aria-label="History of Ancient Rome" className="flex-1 bg-page-content border-b justify-start">
        <Tab id="FoR">Stammdaten</Tab>
        <Tab id="MaR">Komunikation</Tab>
        <Tab id="Emp">Empire</Tab>
      </TabList>
      <TabPanel id="FoR">Stammdaten</TabPanel>
      <TabPanel id="MaR">Komunikation</TabPanel>
      <TabPanel id="Emp">Empire</TabPanel>
    </Tabs>
  )
}
