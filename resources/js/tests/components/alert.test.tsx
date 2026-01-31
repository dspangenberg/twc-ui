import { queryByAttribute, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

// Import the alert component
import { Alert, AlertDescription, AlertTitle } from '@/components/twc-ui/alert'

// Mock the icons
vi.mock('@hugeicons/core-free-icons', () => ({
  InfoCircle: ({ className }: { className?: string }) => (
    <div data-testid="info-circle" className={className}>
      MockInfoCircle
    </div>
  ),
  CheckCircle01: ({ className }: { className?: string }) => (
    <div data-testid="check-circle" className={className}>
      MockCheckCircle
    </div>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <div data-testid="alert-triangle" className={className}>
      MockAlertTriangle
    </div>
  ),
  XClose: ({ className }: { className?: string }) => (
    <div data-testid="x-close" className={className}>
      MockXClose
    </div>
  ),
  AlertCircleIcon: ({ className, strokeWidth }: { className?: string; strokeWidth?: string }) => (
    <div data-testid="alert-circle-icon" className={className} data-stroke-width={strokeWidth}>
      MockAlertCircleIcon
    </div>
  ),
  InformationCircleIcon: ({
    className,
    strokeWidth
  }: {
    className?: string
    strokeWidth?: string
  }) => (
    <div data-testid="info-circle-icon" className={className} data-stroke-width={strokeWidth}>
      MockInformationCircleIcon
    </div>
  )
}))

vi.mock('@/components/ui/icon', () => ({
  default: ({ name, ...props }: { name: string; [key: string]: any }) => (
    <div data-testid={`icon-${name}`} {...props}>
      MockIcon-{name}
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
      expect(alertContainer).toHaveClass('m-1')
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
      expect(alertContainer).toHaveClass('m-1')
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
      expect(alertContainer).toHaveClass('m-1')
      expect(alertInner).toHaveClass(
        'border-yellow-200',
        'bg-yellow-50',
        'dark:border-yellow-900/40',
        'dark:bg-yellow-950/40'
      )
    })
  })

  describe('Icon Support', () => {
    it('renders alert circle icon when variant is destructive and icon is null', () => {
      render(
        <Alert variant="destructive" icon={null}>
          <AlertDescription>Warning</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('alert-circle-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('size-5', 'text-destructive')
    })

    it('renders info circle icon when variant is info and icon is null', () => {
      render(
        <Alert variant="info" icon={null}>
          <AlertDescription>Information</AlertDescription>
        </Alert>
      )

      const icon = screen.getByTestId('info-circle-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('size-5', 'text-yellow-700')
    })

    it('does not render icon when icon is undefined', () => {
      render(
        <Alert>
          <AlertDescription>No icon alert</AlertDescription>
        </Alert>
      )

      const icon = screen.queryByTestId('icon')
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
    })

    it('does not render title when not provided', () => {
      render(
        <Alert>
          <AlertDescription>No title alert</AlertDescription>
        </Alert>
      )

      const titleContainer = queryByAttribute('data-slot', document.body, 'alert-title')
      expect(titleContainer).not.toBeInTheDocument()
    })

    it('applies correct title styles', () => {
      render(
        <Alert title="Test Title">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const titleElement = screen.getByText('Test Title')
      expect(titleElement).toBeInTheDocument()
      expect(titleElement).toHaveAttribute('data-slot', 'alert-title')
      expect(titleElement).toHaveClass(
        'col-start-2',
        'line-clamp-1',
        'min-h-4',
        'pt-0.5',
        'font-medium',
        'tracking-tight'
      )
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
    })

    it('applies correct description styles for default variant', () => {
      render(
        <Alert>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const descriptionContainer = screen.getByText('Description').parentElement
      expect(descriptionContainer).toBeInTheDocument()
      expect(descriptionContainer).toHaveAttribute('data-slot', 'alert-description')
      expect(descriptionContainer).toHaveClass(
        'flex-1',
        'justify-items-start',
        'gap-1',
        'text-muted-foreground',
        'text-sm',
        '[&_p]:leading-relaxed'
      )
    })

    it('applies correct description styles for destructive variant', () => {
      render(
        <Alert variant="destructive">
          <AlertDescription>Destructive description</AlertDescription>
        </Alert>
      )

      const descriptionContainer = screen.getByText('Destructive description').parentElement
      expect(descriptionContainer).toHaveClass('text-destructive')
    })

    it('applies correct description styles for info variant', () => {
      render(
        <Alert variant="info">
          <AlertDescription>Info description</AlertDescription>
        </Alert>
      )

      const descriptionContainer = screen.getByText('Info description').parentElement
      expect(descriptionContainer).toHaveClass('text-yellow-700')
    })
  })

  describe('Actions Support', () => {
    it('renders actions when provided', () => {
      render(
        <Alert actions={<button data-testid="action-button">Action</button>}>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const actions = screen.getByTestId('action-button')
      expect(actions).toBeInTheDocument()
      expect(actions.parentElement).toHaveClass('flex-none', 'justify-end')
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
        <Alert aria-labelledby="custom-label">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-labelledby', 'custom-label')
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
      render(
        <Alert variant="destructive" title="Error" icon={null} actions={<button>Fix</button>}>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )

      // Check main alert container
      const alertContainer = screen.getByRole('alert').parentElement
      const alertInner = screen.getByRole('alert')
      expect(alertContainer).toBeInTheDocument()
      expect(alertContainer).toHaveClass('m-1')
      expect(alertInner).toHaveClass('m-0', 'border-destructive/20')

      // Check icon
      const icon = screen.getByTestId('alert-circle-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('size-5', 'text-destructive')

      // Check title
      const title = screen.getByText('Error')
      expect(title).toBeInTheDocument()

      // Check description
      const description = screen.getByText('Something went wrong')
      expect(description).toBeInTheDocument()

      // Check actions
      const action = screen.getByRole('button', { name: 'Fix' })
      expect(action).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('renders without children gracefully', () => {
      render(<Alert />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('handles empty title gracefully', () => {
      render(
        <Alert title="">
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )

      const titleContainer = queryByAttribute('data-slot', document.body, 'alert-title')
      expect(titleContainer).not.toBeInTheDocument()
    })
  })
})

describe('AlertTitle Component', () => {
  it('renders with correct props and classes', () => {
    render(<AlertTitle variant="destructive">Error Title</AlertTitle>)

    const titleElement = screen.getByText('Error Title')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveAttribute('data-slot', 'alert-title')
  })

  it('applies variant-specific styles', () => {
    render(<AlertTitle variant="destructive">Error</AlertTitle>)

    const titleElement = screen.getByText('Error')
    expect(titleElement).toHaveClass(
      'col-start-2',
      'line-clamp-1',
      'min-h-4',
      'pt-0.5',
      'font-medium',
      'tracking-tight'
    )
  })

  it('applies custom className', () => {
    render(<AlertTitle className="custom-title">Custom Title</AlertTitle>)

    const titleElement = screen.getByText('Custom Title')
    expect(titleElement).toHaveClass('custom-title')
  })
})

describe('AlertDescription Component', () => {
  it('renders with correct props and classes', () => {
    render(<AlertDescription variant="info">Info description</AlertDescription>)

    const descElement = screen.getByText('Info description')
    expect(descElement).toBeInTheDocument()
    expect(descElement).toHaveAttribute('data-slot', 'alert-description')
  })

  it('applies variant-specific styles', () => {
    render(<AlertDescription variant="destructive">Error details</AlertDescription>)

    const descElement = screen.getByText('Error details')
    expect(descElement).toHaveClass('text-destructive')

    const { unmount } = render(<AlertDescription variant="info">Info details</AlertDescription>)

    const descElement2 = screen.getByText('Info details')
    expect(descElement2).toHaveClass('text-yellow-700')

    unmount()
  })

  it('applies custom className', () => {
    render(<AlertDescription className="custom-desc">Custom description</AlertDescription>)

    const descElement = screen.getByText('Custom description')
    expect(descElement).toHaveClass('custom-desc')
  })
})
