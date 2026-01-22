import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { FormPasswordField } from '@/components/twc-ui/form-password-field'

interface Contact extends Record<string, any> {
  current_password: string
  password: string
  password_confirmation: string
}

export default function Demo() {
  const form = useForm<Contact>('contact-form', 'put', route('password-store'), {
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  return (
    <DemoContainer className="h-60">
      <Head title="FormPasswordField Demo" />
      <Form form={form} className="mx-auto mt-12 max-w-lg">
        <FormGrid>
          <div className="col-span-12">
            <FormPasswordField
              autoFocus
              isRequired
              showStrength={false}
              description="Enter your current password"
              label="Current password"
              {...form.register('current_password')}
            />
          </div>
          <div className="col-span-12" />

          <div className="col-span-12">
            <FormPasswordField
              isRequired
              showHint
              description="Enter a secure password"
              label="New password"
              {...form.register('password')}
            />
          </div>
          <div className="col-span-12">
            <FormPasswordField
              isRequired
              showStrength={false}
              description="Repeat your new password"
              label="Confirmed password"
              {...form.register('password_confirmation')}
            />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
