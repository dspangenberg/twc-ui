import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { TextField } from '@/components/twc-ui/text-field'

interface Props {
  contact: App.Data.ContactData
}

export default function Dashboard({ contact }: Props) {
  const form = useForm<App.Data.ContactData>(
    'contact-form',
    'post',
    route('contact.store'),
    contact
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
