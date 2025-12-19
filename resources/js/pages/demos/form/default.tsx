import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Checkbox } from '@/components/twc-ui/checkbox'
import { FormComboBox } from '@/components/twc-ui/combo-box'
import { FormDatePicker } from '@/components/twc-ui/date-picker'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormNumberField } from '@/components/twc-ui/number-field'
import { FormTextAreaField, FormTextField } from '@/components/twc-ui/text-field'

interface Props {
  contact: App.Data.ContactData
  countries: App.Data.CountryData[]
}

export default function FormDemo({ contact, countries }: Props) {
  const form = useForm<App.Data.ContactData>(
    'contact-form',
    'post',
    route('contact.store'),
    contact
  )

  return (
    <DemoContainer>
      <Head title="Form Demo" />
      <Form form={form} className="mx-auto my-12 max-w-lg p-12">
        <FormGrid>
          <div className="col-span-12">
            <FormTextField
              autoFocus
              isRequired
              label="First name"
              {...form.register('first_name')}
            />
            <div className="pt-0.5">
              <Checkbox label="VIP" {...form.registerCheckbox('is_vip')} />
            </div>
          </div>
          <div className="col-span-12">
            <FormTextField isRequired label="Last name" {...form.register('last_name')} />
          </div>
          <div className="col-span-12">
            <FormTextField isRequired label="E-Mail" {...form.register('email')} />
          </div>
          <div className="col-span-12">
            <FormComboBox label="Country" {...form.register('country_id')} items={countries} />
          </div>

          <div className="col-span-12">
            <FormNumberField
              isRequired
              label="Hourly rate"
              {...form.register('hourly')}
              description="How much is the fish?"
            />
          </div>
          <div className="col-span-12">
            <FormDatePicker isRequired maxYears={50} label="DOB" {...form.register('dob')} />
          </div>
          <div className="col-span-24">
            <FormTextAreaField autoSize label="Note" {...form.register('note')} />
          </div>
          <div className="col-span-12">
            <Button title="Save" type="submit" />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
