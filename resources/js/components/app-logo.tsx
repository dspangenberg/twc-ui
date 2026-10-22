import AppLogoIcon from './app-logo-icon'

export default function AppLogo() {
  return (
    <>
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded-md">
        <AppLogoIcon className="size-6 rounded-md" />
      </div>
      <div className="grid flex-1 text-left text-base">
        <span className="mb-0.5 truncate leading-tight font-semibold">twc-ui</span>
      </div>
    </>
  )
}
