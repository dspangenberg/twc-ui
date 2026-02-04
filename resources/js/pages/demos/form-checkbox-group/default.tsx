import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormCheckboxGroup } from '@/components/twc-ui/form-checkbox-group'
import { FormGrid } from '@/components/twc-ui/form-grid'

interface Contact extends Record<string, any> {
  filetypes: number[]
}

export default function Demo() {
  const form = useForm<Contact>('contact-form', 'post', route('contact.store'), {
    filetypes: [1, 2]
  })

  const fileTypes = [
    { name: 'Images', id: 1 },
    { name: 'Videos', id: 2 },
    { name: 'Documents', id: 3 },
    { name: 'Audios', id: 4 },
    { name: 'Other', id: 5 }
  ]

  return (
    <DemoContainer>
      <Head title="TextField Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        {JSON.stringify(form.data.filetypes)}
        <FormGrid>
          <div className="col-span-24">
            <FormCheckboxGroup
              label="Filetypes"
              {...form.register('filetypes')}
              items={fileTypes}
            />
          </div>
        </FormGrid>
      </Form>
    </DemoContainer>
  )
}
