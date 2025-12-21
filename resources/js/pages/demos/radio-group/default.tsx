import React from 'react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Radio, RadioGroup } from '@/components/twc-ui/radio-group'

export const Demo = () => {
  const [value, setValue] = React.useState<string>('')

  return (
    <DemoContainer className="gap-4">
      <RadioGroup
        isRequired
        name="favorite-sport"
        label="Favorite sport"
        value={value}
        onChange={value => setValue(value)}
      >
        <Radio value="soccer">Soccer</Radio>
        <Radio value="baseball">Baseball</Radio>
        <Radio value="basketball">Basketball</Radio>
      </RadioGroup>
    </DemoContainer>
  )
}

export default Demo
