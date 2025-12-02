import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormLayoutGroup } from '@/components/twc-ui/form-layout-group'
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
      <Head title="Form Demo" />
      <Form form={form} className="mx-auto max-w-lg">
        <FormLayoutGroup>
          <div className="col-span-12">
            <TextField isRequired label="First name" {...form.register('first_name')} />
          </div>
          <div className="col-span-12">
            <TextField label="Last name" {...form.register('last_name')} />
          </div>
          <div className="col-span-12">
            <TextField label="E-Mail" {...form.register('email')} />
          </div>
          <div className="col-span-12">
            <Button title="Save" type="submit" />
          </div>
        </FormLayoutGroup>
      </Form>
    </DemoContainer>
  )
}
