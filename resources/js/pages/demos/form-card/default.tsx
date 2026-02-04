import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormCard } from '@/components/twc-ui/form-card'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormTextField } from '@/components/twc-ui/form-text-field'

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
    <DemoContainer className="bg-accent/60">
      <Head title="Form Demo" />
      <FormCard footer={<Button title="Save" type="submit" />} className="mx-auto h-auto max-w-lg">
        <Form form={form}>
          <FormGrid>
            <div className="col-span-12">
              <FormTextField autoFocus isRequired label="First name" />
            </div>
            <div className="col-span-12">
              <FormTextField isRequired label="Last name" />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </DemoContainer>
  )
}
