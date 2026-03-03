import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormTextField } from '@/components/twc-ui/form-text-field'

interface Contact extends Record<string, any> {
  first_name: string
}

export default function Demo() {
  const form = useForm<Contact>('contact-form', 'post', route('contact.store'), {
    first_name: ''
  })

  return (
    <DemoContainer>
      <Head title="TextField Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        <FormGrid>
          <div className="col-span-24">
            <FormTextField
              isRequired
              autoFocus
              description="Enter your first name"
              placeholder="Joe"
              label="First name"
              {...form.register('first_name')}
            />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
