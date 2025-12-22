import { DemoContainer } from '@/components/docs/DemoContainer'
import { Button } from '@/components/twc-ui/button'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/components/twc-ui/dialog'
import { Label } from '@/components/twc-ui/field'
import { Input, TextField } from '@/components/twc-ui/text-field'

export default function DialogDemo() {
  return (
    <DemoContainer>
      <DialogTrigger>
        <Button variant="outline">Sign up...</Button>
        <DialogOverlay>
          <DialogContent className="sm:max-w-[425px]">
            {({ close }) => (
              <>
                <DialogHeader>
                  <DialogTitle>Sign up</DialogTitle>
                </DialogHeader>
                <DialogBody className="p-4">
                  <div className="grid gap-4">
                    <TextField label="FirstName" autoFocus />
                    <TextField label="Last name" />
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button onPress={close} type="submit">
                    Save changes
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </DemoContainer>
  )
}
