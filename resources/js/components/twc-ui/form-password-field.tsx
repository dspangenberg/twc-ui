import {
  MultiplicationSignIcon,
  Tick01Icon,
  ViewIcon,
  ViewOffSlashIcon
} from '@hugeicons/core-free-icons'
import React, { useMemo, useState } from 'react'
import { Focusable, useLocale } from 'react-aria-components'
import { useFormContext } from '@/components/twc-ui/form'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FieldDescription, Label } from './field'
import { FormFieldError } from './form-errors'
import { Icon } from './icon'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'
import { Tooltip, TooltipTrigger } from './tooltip'

interface FormPasswordFieldProps {
  name: string
  value?: string | null
  onChange?: (value: string | null) => void
  onBlur?: () => void
  description?: string
  label?: string
  isRequired?: boolean
  autoFocus?: boolean
  showHint?: boolean
  showStrength?: boolean
  placeholder?: string
  autoComplete?: string
}

const FormPasswordField = ({
  autoFocus = false,
  description,
  isRequired,
  showHint = false,
  showStrength = false,
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete = 'current-password'
}: FormPasswordFieldProps) => {
  const [revealed, setRevealed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { locale } = useLocale()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const form = useFormContext()
  const error = form?.errors?.[name as string]

  const inputType = revealed ? 'text' : 'password'
  const icon = revealed ? ViewIcon : ViewOffSlashIcon

  const translations = {
    de: {
      title: 'Kennwort-Anforderungen:',
      requirements: {
        length: 'mindestens zwölf Zeichen',
        number: 'mindestens eine Ziffer',
        lowercase: 'mindestens einen Kleinbuchstaben',
        uppercase: 'mindestens einen Großbuchstaben',
        special: 'mindestens ein Sonderzeichen'
      },
      strength: {
        empty: 'Kennwort eingeben',
        weak: 'Schwaches Kennwort',
        medium: 'Mittelschweres Kennwort',
        strong: 'Starkes Kennwort'
      },
      sr: {
        met: ' - Anforderung erfüllt',
        notMet: ' - Anforderung nicht erfüllt'
      },
      toggle: {
        show: 'Kennwort anzeigen',
        hide: 'Kennwort ausblenden'
      }
    },
    en: {
      title: 'Password requirements:',
      requirements: {
        length: 'at least twelve characters',
        number: 'at least one number',
        lowercase: 'at least one lowercase letter',
        uppercase: 'at least one uppercase letter',
        special: 'at least one special character'
      },
      strength: {
        empty: 'Enter password',
        weak: 'Weak password',
        medium: 'Medium password',
        strong: 'Strong password'
      },
      sr: {
        met: ' - Requirement met',
        notMet: ' - Requirement not met'
      },
      toggle: {
        show: 'Show password',
        hide: 'Hide password'
      }
    }
  }

  const t = translations[locale?.startsWith('de') ? 'de' : 'en']
  const toggleLabel = revealed ? t.toggle.hide : t.toggle.show

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{12,}/, text: t.requirements.length },
      { regex: /[0-9]/, text: t.requirements.number },
      { regex: /[a-z]/, text: t.requirements.lowercase },
      { regex: /[A-Z]/, text: t.requirements.uppercase },
      { regex: /[!@#$%^&*,)(+=._-]/, text: t.requirements.special }
    ]

    return requirements.map(req => ({
      met: req.regex.test(pass),
      text: req.text
    }))
  }

  const strength = useMemo(() => checkStrength(value ?? ''), [value])

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const allRequirementsMet = useMemo(() => {
    return strength.every(req => req.met)
  }, [strength])

  const strengthText = useMemo(() => {
    if (strengthScore === 0) return t.strength.empty
    if (strengthScore <= 2) return t.strength.weak
    if (strengthScore === 3) return t.strength.medium
    return t.strength.strong
  }, [strengthScore])

  const strengthColor = useMemo(() => {
    if (strengthScore === 0) return 'bg-border'
    if (strengthScore <= 1) return 'bg-red-500'
    if (strengthScore <= 2) return 'bg-orange-500'
    if (strengthScore === 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }, [strengthScore])

  return (
    <>
      {label && <Label isRequired={isRequired} value={label} />}
      <div className="relative">
        {showHint && isFocused && !allRequirementsMet && (
          <div className="fade-in-0 zoom-in-95 slide-in-from-bottom-2 absolute bottom-full left-1/2 z-50 mb-2 w-[120%] max-w-md -translate-x-1/2 animate-in rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
            <p className="mb-2 font-semibold text-sm">{t.title}</p>
            <ul className="space-y-1 text-sm">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <Icon icon={Tick01Icon} className="size-4 text-emerald-500" />
                  ) : (
                    <Icon
                      icon={MultiplicationSignIcon}
                      className="size-4 text-muted-foreground/80"
                    />
                  )}
                  <span
                    className={`text-sm ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                  >
                    {req.text}
                    <span className="sr-only">{req.met ? t.sr.met : t.sr.notMet}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <InputGroup data-invalid={error ? '' : undefined}>
          {showStrength && (
            <InputGroupAddon align="inline-start">
              <TooltipTrigger>
                <Focusable>
                  <span
                    className={cn(strengthColor, 'size-2 cursor-help rounded-full')}
                    tabIndex={-1}
                  />
                </Focusable>
                <Tooltip>{strengthText}</Tooltip>
              </TooltipTrigger>
            </InputGroupAddon>
          )}
          <InputGroupInput
            ref={inputRef}
            type={inputType}
            name={name}
            autoFocus={autoFocus}
            value={value ?? ''}
            onChange={e => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              setRevealed(false)
              onBlur?.()
            }}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            autoComplete={autoComplete}
            passwordRules="minlength: 12; maxLength: 24; required: lower; required: upper; required: digit; required: [!@#$%^&*+=.-];"
          />

          <InputGroupAddon align="inline-end">
            <Button
              variant="ghost"
              size="icon-sm"
              icon={icon}
              aria-label={toggleLabel}
              aria-pressed={revealed}
              title={toggleLabel}
              onClick={() => {
                setRevealed(!revealed)
                inputRef.current?.focus()
              }}
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <FormFieldError />
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  )
}

export { FormPasswordField }
