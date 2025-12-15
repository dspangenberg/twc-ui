import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { NumberField } from '@/components/twc-ui/number-field'
import { TextField } from '@/components/twc-ui/text-field'

interface Contact extends Record<string, any> {
  first_name: string
  last_name: string
  email: string
  hourly: number
}

export default function Dashboard() {
  const form = useForm<Contact>('contact-form', 'post', route('contact.store'), {
    first_name: '',
    last_name: '',
    email: '',
    hourly: 0
  })

  return (
    <DemoContainer>
      <Head title="FormGrid Demo" />
      <Form form={form} className="mx-auto max-w-lg p-12">
        <FormGrid title="Name and contact details">
          <div className="col-span-12">
            <TextField autoFocus isRequired label="First name" />
          </div>
          <div className="col-span-12">
            <TextField isRequired label="Last name" />
          </div>
          <div className="col-span-24">
            <TextField isRequired label="E-Mail" />
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
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
