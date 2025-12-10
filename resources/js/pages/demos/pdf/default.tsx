import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { ComboBox } from '@/components/twc-ui/combo-box'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { NumberField } from '@/components/twc-ui/number-field'
import { TextField } from '@/components/twc-ui/text-field'
import { Checkbox } from '@/components/twc-ui/checkbox'
import { DatePicker } from '@/components/twc-ui/date-picker'


interface Props {
  contact: App.Data.ContactData
  countries: App.Data.CountryData[]
}

export default function Dashboard({ contact, countries }: Props) {
  const form = useForm<App.Data.ContactData>(
    'contact-form',
    'post',
    route('contact.store'),
    contact
  )

  return (
    <DemoContainer>
      <Head title="FormGrid Demo" />
      <Form form={form} className="mx-auto my-24 max-w-lg p-12">
        <FormGrid title="Name and contact details">
          <div className="col-span-12">
            <TextField autoFocus isRequired label="First name"  />
          </div>
          <div className="col-span-12">
            <TextField isRequired label="Last name" />
          </div>
          <div className="col-span-24">
            <TextField isRequired label="E-Mail"  />
          </div>

        </FormGrid>
        <FormGrid title="Misc">
          <div className="col-span-12">
            <NumberField
              isRequired
              label="Hourly rate"
              {...form.register('hourly')}
              description="How much is the fish?"
            />
          </div>
          <div className="col-span-12">
            <DatePicker
              isRequired
              label="DOB"
              {...form.register('dob')}
            />
          </div>
          <div className="col-span-24">
            <TextField textArea autoSize label="Note" {...form.register('note')} />
          </div>
          <div className="col-span-12">
            <Button title="Save" type="submit" />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
