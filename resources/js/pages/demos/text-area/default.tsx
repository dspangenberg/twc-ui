import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { TextArea } from '@/components/twc-ui/text-area'

interface Contact extends Record<string, any> {
  bio: string
}

export default function Dashboard() {
  const form = useForm<Contact>('contact-form', 'post', route('contact.store'), {
    bio: ''
  })

  return (
    <DemoContainer>
      <Head title="TextArea Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        <FormGrid>
          <div className="col-span-24">
            <TextArea
              isRequired
              description="Enter your bio"
              placeholder="Tell something about yourself..."
              rows={3}
              label="Bio"
              {...form.register('bio')}
            />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
