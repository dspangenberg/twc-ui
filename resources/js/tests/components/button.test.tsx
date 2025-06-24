import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/twc-ui/button'
import { Rocket02Icon } from '@hugeicons/core-free-icons'
import userEvent from '@testing-library/user-event'

// Helper function to wrap components that might have tooltips
const renderButton = (props: any) => {
  return render(<Button {...props} />)
}

describe('Button', () => {
  it('rendert einen Button mit title', () => {
    renderButton({ title: 'Test Button' })
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('rendert einen Button mit children', () => {
    renderButton({ children: 'Click me' })
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('zeigt title als children an wenn beides vorhanden ist', () => {
    renderButton({ title: 'Title Text', children: 'Children Text' })
    expect(screen.getByText('Title Text')).toBeInTheDocument()
    expect(screen.queryByText('Children Text')).not.toBeInTheDocument()
  })

  it('kann disabled werden', () => {
    renderButton({ title: 'Disabled Button', disabled: true })
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('kann onPress-Handler ausführen', async () => {
    const user = userEvent.setup()
    const handlePress = vi.fn()

    await act(async () => {
      renderButton({ title: 'Clickable', onPress: handlePress })
    })

    await act(async () => {
      await user.click(screen.getByRole('button'))
    })

    expect(handlePress).toHaveBeenCalledTimes(1)
  })

  describe('Varianten', () => {
    it('rendert default variant', () => {
      renderButton({ title: 'Default' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('rendert secondary variant', () => {
      renderButton({ title: 'Secondary', variant: 'secondary' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary/90')
    })

    it('rendert outline variant', () => {
      renderButton({ title: 'Outline', variant: 'outline' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-input')
    })

    it('rendert destructive variant', () => {
      renderButton({ title: 'Destructive', variant: 'destructive' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('rendert ghost variant', () => {
      renderButton({ title: 'Ghost', variant: 'ghost' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('data-[hovered]:bg-accent')
    })

    it('rendert link variant', () => {
      renderButton({ title: 'Link', variant: 'link' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary')
    })
  })

  describe('Größen', () => {
    it('rendert default size', () => {
      renderButton({ title: 'Default Size' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('rendert sm size', () => {
      renderButton({ title: 'Small', size: 'sm' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8')
    })

    it('rendert lg size', () => {
      renderButton({ title: 'Large', size: 'lg' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('rendert icon size', () => {
      renderButton({ title: 'Icon', size: 'icon' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-9')
    })
  })

  describe('Icon-Funktionalität', () => {
    it('rendert Button mit Icon', () => {
      renderButton({ title: 'With Icon', icon: Rocket02Icon })
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('wendet iconClassName an', () => {
      renderButton({
        title: 'Custom Icon',
        icon: Rocket02Icon,
        iconClassName: 'text-red-500'
      })
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
    })

    it('versteckt Text bei icon size', () => {
      renderButton({ title: 'Hidden Text', icon: Rocket02Icon, size: 'icon' })
      const button = screen.getByRole('button')
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Hidden Text')
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('zeigt Loading-Spinner wenn isLoading true ist', () => {
      renderButton({ title: 'Loading', isLoading: true })
      const button = screen.getByRole('button')
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('versteckt Icon wenn isLoading true ist', () => {
      renderButton({ title: 'Loading with Icon', icon: Rocket02Icon, isLoading: true })
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('svg')
      // Sollte nur das Loading-Icon haben, nicht das originale Icon
      expect(icons).toHaveLength(1)
      expect(icons[0]).toHaveClass('animate-spin')
    })

    it('ist disabled wenn isLoading true ist', () => {
      renderButton({ title: 'Loading Disabled', isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Toolbar-Verhalten', () => {
    it('toolbar variant versteckt Title', async () => {
      await act(async () => {
        renderButton({ title: 'Toolbar Button', variant: 'toolbar', icon: Rocket02Icon })
      })

      const button = screen.getByRole('button')

      // Text sollte nicht sichtbar sein bei toolbar variant
      expect(screen.queryByText('Toolbar Button')).not.toBeInTheDocument()
      // Aber als aria-label verfügbar
      expect(button).toHaveAttribute('aria-label', 'Toolbar Button')
    })

    it('toolbar-default variant zeigt Title und setzt size auf auto', async () => {
      await act(async () => {
        renderButton({ title: 'Toolbar Default', variant: 'toolbar-default', icon: Rocket02Icon })
      })

      const button = screen.getByRole('button')

      expect(screen.getByText('Toolbar Default')).toBeInTheDocument()
      expect(button).toHaveClass('h-9', 'w-auto')
    })
  })

  describe('Accessibility', () => {
    it('hat korrekte ARIA-Attribute', () => {
      renderButton({ title: 'Accessible Button' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Accessible Button')
    })

    it('ist keyboard-navigierbar mit Enter', async () => {
      const user = userEvent.setup()
      const handlePress = vi.fn()

      await act(async () => {
        renderButton({ title: 'Keyboard Test', onPress: handlePress })
      })

      const button = screen.getByRole('button')

      await act(async () => {
        button.focus()
      })

      expect(button).toHaveFocus()

      await act(async () => {
        await user.keyboard('{Enter}')
      })

      await waitFor(() => {
        expect(handlePress).toHaveBeenCalled()
      })
    })

    it('ist keyboard-navigierbar mit Space', async () => {
      const user = userEvent.setup()
      const handlePress = vi.fn()

      await act(async () => {
        renderButton({ title: 'Space Test', onPress: handlePress })
      })

      const button = screen.getByRole('button')

      await act(async () => {
        button.focus()
        await user.keyboard(' ')
      })

      await waitFor(() => {
        expect(handlePress).toHaveBeenCalled()
      })
    })
  })

  describe('Form-Integration', () => {
    it('kann form-Attribut setzen', () => {
      renderButton({ title: 'Form Button', form: 'test-form' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'test-form')
    })

    it('kann type-Attribut setzen', () => {
      renderButton({ title: 'Submit Button', type: 'submit' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Custom Styling', () => {
    it('wendet custom className an', () => {
      renderButton({ title: 'Custom Style', className: 'custom-class' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('behält basis-Styles bei custom className', () => {
      renderButton({ title: 'Custom Style', className: 'custom-class' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'inline-flex')
    })
  })

  // Vereinfachte Tests für Tooltip-Funktionalität (da diese komplex zu testen sind)
  describe('Tooltip-Funktionalität', () => {
    it('verwendet tooltip prop für aria-label', async () => {
      await act(async () => {
        renderButton({ title: 'Custom Tooltip', tooltip: 'Custom Tooltip', size: 'icon' })
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom Tooltip')
    })
  })
})
