import { Button } from '@/components/twc-ui/button'

export const Demo = () => {
  return (
    <div className="flex gap-4 m-4 flex-wrap">
      <Button title="Default" />
      <Button variant="secondary" title="Secondary" />
      <Button variant="outline" title="Outline" />
      <Button variant="destructive" title="Destructive" />
      <Button variant="ghost" title="Ghost" />
      <Button variant="link" title="Link" />
    </div>
  )
}
