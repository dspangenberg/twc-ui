import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/twc-ui/alert'

// Mock the icons that are actually imported in the alert component
vi.mock('@hugeicons/core-free-icons', () => ({
  Alert02Icon: ({ className }: { className?: string }) => (
    <div data-testid="alert-02-icon" className={className}>
      MockAlert02Icon
    </div>
  ),
  AlertCircleIcon: ({ className }: { className?: string }) => (
    <div data-testid="alert-circle-icon" className={className}>
      MockAlertCircleIcon
    </div>
  ),
  AlertSquareIcon: ({ className }: { className?: string }) => (
    <div data-testid="alert-square-icon" className={className}>
      MockAlertSquareIcon
    </div>
  ),
  InformationCircleIcon: ({ className }: { className?: string }) => (
    <div data-testid="information-circle-icon" className={className}>
      MockInformationCircleIcon
    </div>
  )
}))

// Mock the Icon component
vi.mock('@/components/twc-ui/icon', () => ({
  Icon: ({ icon, className }: { icon: any; className?: string }) => (
    <div data-testid="icon" className={className}>
      MockIcon-{icon.name || 'custom'}
    </div>
  )
}))

describe('Alert Component', () => {
  describe('Basic Rendering', () => {
    it('renders alert with default variant', () => {
      render(
        <Alert>
          <AlertDescription>Test message</AlertDescription>
        </Alert>
      )

      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toBeInTheDocument()
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass('bg-card', 'text-card-foreground')
    })

    it('renders alert with destructive variant', () => {
      render(
        <Alert variant="destructive">
          <AlertDescription>Warning message</AlertDescription>
        </Alert>
      )

      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass(
        'm-0',
        'border-destructive/20',
        'bg-destructive/5',
        'text-destructive'
      )
    })

    it('renders alert with info variant', () => {
      render(
        <Alert variant="info">
          <AlertDescription>Info message</AlertDescription>
        </Alert>
      )

      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass('border-info/20', 'bg-info/5', 'text-info')
    })

    it('renders alert with warning variant', () => {
      render(
        <Alert variant="warning">
          <AlertDescription>Warning message</AlertDescription>
        </Alert>
      )

      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass('border-warning', 'bg-warning', 'text-warning-foreground')
    })

    it('renders alert with success variant', () => {
      render(
        <Alert variant="success">
          <AlertDescription>Success message</AlertDescription>
        </Alert>
      )

      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass('border-success/20', 'bg-success/5', 'text-success')
    })
  })

  describe('Icon Support', () => {
    it('renders AlertCircleIcon for default variant when no icon provided', () => {
      render(
        <Alert>
          <AlertDescription>Default message</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('size-5', 'shrink-0', 'text-background')
      expect(icon).toHaveTextContent('MockIcon-AlertCircleIcon')
    })

    it('renders Alert02Icon for destructive variant when no icon provided', () => {
      render(
        <Alert variant="destructive">
          <AlertDescription>Warning message</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-destructive')
      expect(icon).toHaveTextContent('MockIcon-Alert02Icon')
    })

    it('renders InformationCircleIcon for info variant when no icon provided', () => {
      render(
        <Alert variant="info">
          <AlertDescription>Info message</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-info')
      expect(icon).toHaveTextContent('MockIcon-InformationCircleIcon')
    })

    it('renders AlertSquareIcon for warning variant when no icon provided', () => {
      render(
        <Alert variant="warning">
          <AlertDescription>Warning message</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-warning-foreground')
      expect(icon).toHaveTextContent('MockIcon-AlertSquareIcon')
    })

    it('renders AlertCircleIcon for success variant when no icon provided', () => {
      render(
        <Alert variant="success">
          <AlertDescription>Success message</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-success')
      expect(icon).toHaveTextContent('MockIcon-AlertCircleIcon')
    })

    it('renders custom icon when provided', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom</div>
      render(
        <Alert icon={CustomIcon}>
          <AlertDescription>Custom icon alert</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('MockIcon-CustomIcon')
    })

    it('does not render icon when icon is false', () => {
      render(
        <Alert icon={false}>
          <AlertDescription>No icon alert</AlertDescription>
        </Alert>
      )

      const icon = screen.queryByTestId('alert-circle-icon')
      expect(icon).not.toBeInTheDocument()
      const customIcon = screen.queryByTestId('custom-icon')
      expect(customIcon).not.toBeInTheDocument()
    })

    it('does not render icon when icon is null', () => {
      render(
        <Alert icon={null}>
          <AlertDescription>No icon alert</AlertDescription>
        </Alert>
      )

      const icon = screen.queryByTestId('alert-circle-icon')
      expect(icon).not.toBeInTheDocument()
    })
  })

  describe('Title Support', () => {
    it('renders title when provided', () => {
      render(
        <Alert title="Alert Title">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const title = screen.getByText('Alert Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'alert-title')
    })

    it('does not render title when not provided', () => {
      render(
        <Alert>
          <AlertDescription>No title alert</AlertDescription>
        </Alert>
      )

      const titleContainer = document.querySelector('[data-slot="alert-title"]')
      expect(titleContainer).not.toBeInTheDocument()
    })

    it('does not render title when empty string', () => {
      render(
        <Alert title="">
          <AlertDescription>Empty title alert</AlertDescription>
        </Alert>
      )

      const titleContainer = document.querySelector('[data-slot="alert-title"]')
      expect(titleContainer).not.toBeInTheDocument()
    })

    it('applies correct title styles', () => {
      render(
        <Alert title="Test Title">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const titleElement = screen.getByText('Test Title')
      expect(titleElement).toHaveClass('font-medium', 'tracking-tight')
    })
  })

  describe('Description Support', () => {
    it('renders description content', () => {
      render(
        <Alert>
          <AlertDescription>Description content</AlertDescription>
        </Alert>
      )

      const description = screen.getByText('Description content')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'alert-description')
    })

    it('applies correct description styles for default variant', () => {
      render(
        <Alert>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const descriptionElement = screen.getByText('Description')
      expect(descriptionElement).toHaveClass(
        'w-full',
        'text-muted-foreground',
        'text-sm',
        'leading-normal'
      )
    })

    it('applies correct description styles for destructive variant', () => {
      render(
        <Alert variant="destructive">
          <AlertDescription>Destructive description</AlertDescription>
        </Alert>
      )

      const descriptionElement = screen.getByText('Destructive description').parentElement
      expect(descriptionElement).toHaveClass('text-destructive')
    })

    it('applies correct description styles for info variant', () => {
      render(
        <Alert variant="info">
          <AlertDescription>Info description</AlertDescription>
        </Alert>
      )

      const descriptionElement = screen.getByText('Info description').parentElement
      expect(descriptionElement).toHaveClass('text-info-foreground')
    })

    it('applies correct description styles for warning variant', () => {
      render(
        <Alert variant="warning">
          <AlertDescription>Warning description</AlertDescription>
        </Alert>
      )

      const descriptionElement = screen.getByText('Warning description').parentElement
      expect(descriptionElement).toHaveClass('text-warning-foreground')
    })

    it('applies correct description styles for success variant', () => {
      render(
        <Alert variant="success">
          <AlertDescription>Success description</AlertDescription>
        </Alert>
      )

      const descriptionElement = screen.getByText('Success description').parentElement
      expect(descriptionElement).toHaveClass('text-success')
    })
  })

  describe('Actions Support', () => {
    it('renders actions when provided', () => {
      render(
        <Alert
          actions={
            <button type="button" data-testid="action-button">
              Action
            </button>
          }
        >
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const actions = screen.getByTestId('action-button')
      expect(actions).toBeInTheDocument()
      expect(actions.parentElement).toHaveClass('flex-none', 'justify-end')
    })

    it('renders multiple actions', () => {
      render(
        <Alert
          actions={
            <>
              <button type="button" data-testid="action-1">
                Action 1
              </button>
              <button type="button" data-testid="action-2">
                Action 2
              </button>
            </>
          }
        >
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const action1 = screen.getByTestId('action-1')
      const action2 = screen.getByTestId('action-2')
      expect(action1).toBeInTheDocument()
      expect(action2).toBeInTheDocument()
    })

    it('does not render actions when not provided', () => {
      render(
        <Alert>
          <AlertDescription>No actions alert</AlertDescription>
        </Alert>
      )

      const actionsContainer = screen.queryByTestId('action-button')
      expect(actionsContainer).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct role attribute', () => {
      render(
        <Alert>
          <AlertDescription>Accessible alert</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('role', 'alert')
    })

    it('preserves additional accessibility props', () => {
      render(
        <Alert aria-labelledby="custom-label" data-testid="custom-alert">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-labelledby', 'custom-label')
      expect(alert).toHaveAttribute('data-testid', 'custom-alert')
    })

    it('applies data-slot attributes correctly', () => {
      render(
        <Alert title="Test Title">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const titleElement = screen.getByText('Test Title')
      const descriptionElement = screen.getByText('Description')
      expect(titleElement).toHaveAttribute('data-slot', 'alert-title')
      expect(descriptionElement).toHaveAttribute('data-slot', 'alert-description')
    })
  })

  describe('Component Composition', () => {
    it('renders all parts together correctly', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom</div>
      render(
        <Alert
          variant="destructive"
          title="Error"
          icon={CustomIcon}
          actions={
            <button type="button" data-testid="fix-button">
              Fix
            </button>
          }
        >
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )

      // Check main alert container
      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toHaveClass('m-1', 'w-full')
      expect(alertInner).toHaveClass('m-0', 'border-destructive/20')

      // Check custom icon
      const customIcon = screen.getByTestId('icon')
      expect(customIcon).toBeInTheDocument()
      expect(customIcon).toHaveTextContent('MockIcon-CustomIcon')

      // Check title
      const title = screen.getByText('Error')
      expect(title).toBeInTheDocument()

      // Check description
      const description = screen.getByText('Something went wrong')
      expect(description).toBeInTheDocument()

      // Check actions
      const action = screen.getByTestId('fix-button')
      expect(action).toBeInTheDocument()
    })

    it('renders minimal alert with only description', () => {
      render(<Alert>Description only</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()

      // Should have default icon
      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('MockIcon-AlertCircleIcon')

      // Should have description
      expect(screen.getByText('Description only')).toBeInTheDocument()
    })
  })

  describe('Custom Classes and Props', () => {
    it('applies custom className to alert', () => {
      render(
        <Alert className="custom-alert-class" data-custom="test">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-alert-class')
      expect(alert).toHaveAttribute('data-custom', 'test')
    })

    it('passes through additional div props', () => {
      render(
        <Alert id="my-alert" onClick={vi.fn()}>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('id', 'my-alert')
    })
  })

  describe('Edge Cases', () => {
    it('renders without children gracefully', () => {
      render(<Alert />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()

      // Should still have default icon
      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('MockIcon-AlertCircleIcon')
    })

    it('handles complex description content', () => {
      render(
        <Alert>
          <AlertDescription>
            <span data-testid="complex-content">Complex content with markup</span>
          </AlertDescription>
        </Alert>
      )

      const complexContent = screen.getByTestId('complex-content')
      expect(complexContent).toBeInTheDocument()
    })
  })
})

describe('AlertTitle Component', () => {
  it('renders with correct props and classes', () => {
    render(<AlertTitle variant="destructive">Error Title</AlertTitle>)

    const titleElement = screen.getByText('Error Title')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveAttribute('data-slot', 'alert-title')
    expect(titleElement).toHaveClass('font-medium', 'tracking-tight')
  })

  it('applies custom className', () => {
    render(<AlertTitle className="custom-title">Custom Title</AlertTitle>)

    const titleElement = screen.getByText('Custom Title')
    expect(titleElement).toHaveClass('custom-title', 'font-medium', 'tracking-tight')
  })

  it('passes through additional props', () => {
    render(<AlertTitle id="my-title">Title</AlertTitle>)

    const titleElement = screen.getByText('Title')
    expect(titleElement).toHaveAttribute('id', 'my-title')
  })
})

describe('AlertDescription Component', () => {
  it('renders with correct props and classes', () => {
    render(<AlertDescription variant="info">Info description</AlertDescription>)

    const descElement = screen.getByText('Info description')
    expect(descElement).toBeInTheDocument()
    expect(descElement).toHaveAttribute('data-slot', 'alert-description')
    expect(descElement).toHaveClass('text-info-foreground')
  })

  it('applies variant-specific styles', () => {
    render(<AlertDescription variant="destructive">Error details</AlertDescription>)

    const descElement = screen.getByText('Error details')
    expect(descElement).toHaveClass('text-destructive')
  })

  it('applies custom className', () => {
    render(<AlertDescription className="custom-desc">Custom description</AlertDescription>)

    const descElement = screen.getByText('Custom description')
    expect(descElement).toHaveClass(
      'custom-desc',
      'w-full',
      'text-muted-foreground',
      'text-sm',
      'leading-normal'
    )
  })

  it('passes through additional props', () => {
    render(<AlertDescription id="my-desc">Description</AlertDescription>)

    const descElement = screen.getByText('Description')
    expect(descElement).toHaveAttribute('id', 'my-desc')
  })
})
