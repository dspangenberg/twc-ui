import type React from 'react'
import AppLogoIcon from '@/components/twc-ui/logo'

export interface TwicewareSolutionProps {
  hideCopyright?: boolean
  appName?: string
  appWebsite?: string
  copyrightYear?: number
  copyrightHolder?: string
  copyrightHolderWebsite?: string
}

export const TwicewareSolution: React.FC<TwicewareSolutionProps> = ({
  appName = 'App',
  appWebsite = '',
  copyrightYear = new Date().getFullYear(),
  copyrightHolder = '',
  copyrightHolderWebsite = '',
  hideCopyright = false
}) => {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <div className="text-foreground mx-auto flex w-full max-w-sm items-center justify-center text-sm">
        {appWebsite ? (
          <a
            href={appWebsite}
            className="text-foreground mx-1.5 flex items-center font-medium hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {appName}
          </a>
        ) : (
          <span className="text-foreground mx-1.5 font-medium">{appName}</span>
        )}
        is a
        <AppLogoIcon className="mx-1.5 size-5 rounded-md" />
        <a
          href="https://twiceware.de"
          className="text-foreground flex items-center font-medium hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          twiceware solution
        </a>
      </div>
      {!hideCopyright && (
        <div className="text-foreground/80 mx-auto mt-1 text-center text-xs">
          Copyright &copy; {copyrightYear}
          {currentYear !== copyrightYear && `-${currentYear}`}
          {copyrightHolder && (
            <>
              {' by '}
              {copyrightHolderWebsite ? (
                <a
                  href={copyrightHolderWebsite}
                  className="text-foreground/80 inline-flex items-center hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copyrightHolder}
                </a>
              ) : (
                <span className="text-foreground/80">{copyrightHolder}</span>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
