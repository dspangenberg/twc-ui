import { Head } from '@inertiajs/react'
import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import { ComboBox } from '@/components/twc-ui/combo-box'
import { Form, useForm } from '@/components/twc-ui/form'
import { FormGrid } from '@/components/twc-ui/form-grid'
import { NumberField } from '@/components/twc-ui/number-field'
import { TextField } from '@/components/twc-ui/text-field'
import { Checkbox } from '@/components/twc-ui/checkbox'
import { DatePicker } from '@/components/twc-ui/date-picker'
import { Dialog, DialogTrigger } from '@/components/twc-ui/dialog'

interface Contact extends Record<string, any> {
  first_name: string
  last_name: string
  email: string
}

export default function Dashboard () {
  const form = useForm<Contact>(
    'contact-form',
    'post',
    route('contact.store'),
    {
      first_name: 'Danny',
      last_name: 'Mustermann',
      email: 'danny@example.com',
    }
  )

  return (
    <DemoContainer>
      <Head title="FormGrid Demo" />
      <DialogTrigger>
        <Button variant="default">Edit contact</Button>

        <Dialog
          showDescription
          description="Make changes to your profile here. Click save when you're done."
          footer={dialogRenderProps => (
            <div className="mx-0 flex w-full gap-2">
              <div className="flex flex-1 justify-start" />
              <div className="flex flex-none gap-2">
                <Button variant="outline" onClick={dialogRenderProps.close}>
                  Abbrechen
                </Button>
                <Button variant="default" >
                  Speichern
                </Button>
              </div>
            </div>
          )}
        >
          <Form form={form}>
          <FormGrid>
            <div className="col-span-12">
              <TextField autoFocus isRequired label="First name" {...form.register('first_name')} />
            </div>
            <div className="col-span-12">
              <TextField isRequired label="Last name" {...form.register('last_name')} />
            </div>
            <div className="col-span-24">
              <TextField isRequired label="E-Mail"  {...form.register('email')}/>
            </div>

          </FormGrid>
          </Form>
        </Dialog>
      </DialogTrigger>
    </DemoContainer>
  )
}
