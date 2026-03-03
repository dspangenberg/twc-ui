import { DemoContainer } from '@/components/docs/DemoContainer'
import { Alert } from '@/components/twc-ui/alert'
import { Button } from '@/components/twc-ui/button'

export default function Demo() {
  return (
    <DemoContainer className="mx-auto max-w-2xl">
      <div className="space-y-4">
        <h3 className="mb-4 font-medium text-lg">Account Settings</h3>

        <div className="space-y-2">
          <label htmlFor="email" className="font-medium text-sm">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border px-3 py-2"
            placeholder="user@example.com"
          />
        </div>

        <Alert title="Email Verification">
          Please verify your email address to ensure account security and receive important
          notifications.
        </Alert>

        <div className="space-y-2">
          <label htmlFor="password" className="font-medium text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter your password"
          />
        </div>

        <Alert variant="info" title="Password Requirements">
          <ul className="ml-4 list-inside list-disc">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Includes at least one number</li>
          </ul>
        </Alert>

        <div className="flex gap-2 pt-4">
          <Button title="Save Changes" />
          <Button variant="outline" title="Cancel" />
        </div>
      </div>
    </DemoContainer>
  )
}
