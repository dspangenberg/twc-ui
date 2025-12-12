import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { TextField } from '@/components/twc-ui/text-field'

interface Contact extends Record<string, any> {
  first_name: string
}

export default function Dashboard() {
  const form = useForm<Contact>(
    'contact-form',
    'post',
    route('contact.store'),
    {
      first_name: ''
    }
  )

  return (
    <DemoContainer>
      <Head title="TextField Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        <FormGrid>
          <div className="col-span-24">
            <TextField
              isRequired
              description="Enter your first name"
              placeholder="Danny"
              label="First name" {...form.register('first_name')} />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
