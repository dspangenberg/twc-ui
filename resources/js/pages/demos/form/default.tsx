import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGroup } from '@/components/twc-ui/form-group'
import { TextField } from '@/components/twc-ui/textfield'

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
        <FormGroup>
          <div className="col-span-12">
            <TextField required label="First name" {...form.register('first_name')} />
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
        </FormGroup>
      </Form>
    </DemoContainer>
  )
}
