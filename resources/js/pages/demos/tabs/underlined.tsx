import { DemoContainer } from '@/components/docs/DemoContainer'
import { Tab, TabList, TabPanel, Tabs } from '@/components/twc-ui/tabs'

export const Demo = () => {
  return (
    <DemoContainer>
      <Tabs variant="underlined" className="w-lg">
        <TabList aria-label="History of Ancient Rome">
          <Tab id="Founding">Founding of Rome</Tab>
          <Tab id="Monarchy">Monarchy and Republic</Tab>
          <Tab id="Empire">Empire</Tab>
        </TabList>
        <TabPanel id="Founding">Arma virumque cano, Troiae qui primus ab oris.</TabPanel>
        <TabPanel id="Monarchy">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Empire">Alea jacta est.</TabPanel>
      </Tabs>
    </DemoContainer>
  )
}

export default Demo
