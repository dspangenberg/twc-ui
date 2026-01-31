import { Rocket02Icon } from '@hugeicons/react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/twc-ui/button'

const renderButton = (props: React.ComponentProps<typeof Button>) => {
  return render(<Button {...props} />)
}

describe('Button', () => {
  it('renders a Button with title', () => {
    renderButton({ title: 'Test Button' })
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('renders a Button with children', () => {
    renderButton({ children: 'Click me' })
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('displays title as children when both are provided', () => {
    renderButton({ title: 'Title Text', children: 'Children Text' })
    expect(screen.getByText('Title Text')).toBeInTheDocument()
    expect(screen.queryByText('Children Text')).not.toBeInTheDocument()
  })

  it('can be disabled', () => {
    renderButton({ title: 'Disabled Button', disabled: true })
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('executes onPress handler', async () => {
    const user = userEvent.setup()
    const handlePress = vi.fn()

    renderButton({ title: 'Clickable', onPress: handlePress })

    await user.click(screen.getByRole('button'))

    expect(handlePress).toHaveBeenCalledTimes(1)
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      renderButton({ title: 'Default' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('renders secondary variant', () => {
      renderButton({ title: 'Secondary', variant: 'secondary' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary/90')
    })

    it('renders outline variant', () => {
      renderButton({ title: 'Outline', variant: 'outline' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-input')
    })

    it('renders destructive variant', () => {
      renderButton({ title: 'Destructive', variant: 'destructive' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('renders ghost variant', () => {
      renderButton({ title: 'Ghost', variant: 'ghost' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('data-[hovered]:bg-accent/80')
    })

    it('renders link variant', () => {
      renderButton({ title: 'Link', variant: 'link' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary')
    })
  })

  describe('Sizes', () => {
    it('renders default size', () => {
      renderButton({ title: 'Default Size' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('renders sm size', () => {
      renderButton({ title: 'Small', size: 'sm' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8')
    })

    it('renders lg size', () => {
      renderButton({ title: 'Large', size: 'lg' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('renders icon size', () => {
      renderButton({ title: 'Icon', size: 'icon' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-9')
    })
  })

  describe('Icon Functionality', () => {
    it('renders Button with Icon', () => {
      renderButton({ title: 'With Icon', icon: Rocket02Icon })
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('applies iconClassName', () => {
      renderButton({
        title: 'Custom Icon',
        icon: Rocket02Icon,
        iconClassName: 'text-red-500'
      })
      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
    })

    it('hides text when size is icon', () => {
      renderButton({ title: 'Hidden Text', icon: Rocket02Icon, size: 'icon' })
      const button = screen.getByRole('button')
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Hidden Text')
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('displays loading spinner when isLoading is true', () => {
      renderButton({ title: 'Loading', isLoading: true })
      const button = screen.getByRole('button')
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('hides icon when isLoading is true', () => {
      renderButton({ title: 'Loading with Icon', icon: Rocket02Icon, isLoading: true })
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('svg')
      // Should only have the loading icon, not the original icon
      expect(icons).toHaveLength(1)
      expect(icons[0]).toHaveClass('animate-spin')
    })

    it('is disabled when isLoading is true', () => {
      renderButton({ title: 'Loading Disabled', isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Toolbar Behavior', () => {
    it('toolbar variant hides title', () => {
      renderButton({ title: 'Toolbar Button', variant: 'toolbar', icon: Rocket02Icon })

      const button = screen.getByRole('button')

      // Text should not be visible with toolbar variant
      expect(screen.queryByText('Toolbar Button')).not.toBeInTheDocument()
      // But available as aria-label
      expect(button).toHaveAttribute('aria-label', 'Toolbar Button')
    })

    it('toolbar-default variant shows title and sets size to auto', () => {
      renderButton({ title: 'Toolbar Default', variant: 'toolbar-default', icon: Rocket02Icon })

      const button = screen.getByRole('button')

      expect(screen.getByText('Toolbar Default')).toBeInTheDocument()
      expect(button).toHaveClass('h-9', 'w-auto')
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderButton({ title: 'Accessible Button' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Accessible Button')
    })

    it('is keyboard navigable with Enter', async () => {
      const user = userEvent.setup()
      const handlePress = vi.fn()

      renderButton({ title: 'Keyboard Test', onPress: handlePress })

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')

      expect(handlePress).toHaveBeenCalledTimes(1)
    })

    it('is keyboard navigable with Space', async () => {
      const user = userEvent.setup()
      const handlePress = vi.fn()

      renderButton({ title: 'Space Test', onPress: handlePress })

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')

      expect(handlePress).toHaveBeenCalledTimes(1)
    })
  })

  describe('Form Integration', () => {
    it('can set form attribute', () => {
      renderButton({ title: 'Form Button', form: 'test-form' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'test-form')
    })

    it('can set type attribute', () => {
      renderButton({ title: 'Submit Button', type: 'submit' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      renderButton({ title: 'Custom Style', className: 'custom-class' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('retains base styles with custom className', () => {
      renderButton({ title: 'Custom Style', className: 'custom-class' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'inline-flex')
    })
  })

  // Simplified tests for Tooltip functionality (as these are complex to test)
  describe('Tooltip Functionality', () => {
    it('uses tooltip prop for aria-label', () => {
      renderButton({ title: 'Custom Tooltip', tooltip: 'Custom Tooltip', size: 'icon' })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom Tooltip')
    })
  })
})
