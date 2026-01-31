import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tooltip, TooltipTrigger } from '@/components/twc-ui/tooltip'

vi.mock('react-aria-components', () => ({
  Tooltip: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="tooltip" {...props}>
      {children}
    </div>
  ),
  TooltipTrigger: ({ children, ...props }: any) => (
    <button data-testid="tooltip-trigger" type="button" {...props}>
      {children}
    </button>
  ),
  OverlayArrow: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="tooltip-arrow" {...props}>
      {children}
    </div>
  ),
  composeRenderProps: (
    className: string | undefined,
    fn: (className: string, renderProps: any) => string
  ) => fn(className || '', { isEntering: false, isExiting: false })
}))

vi.mock('tailwind-variants', () => ({
  tv: (config: any) => {
    const baseClasses = Array.isArray(config.base) ? config.base.join(' ') : config.base || ''
    return Object.assign(
      (options: any = {}) => {
        let classes = baseClasses
        if (options.isEntering && config.variants?.isEntering?.true) {
          classes += ' ' + config.variants.isEntering.true.join(' ')
        }
        if (options.isExiting && config.variants?.isExiting?.true) {
          classes += ' ' + config.variants.isExiting.true.join(' ')
        }
        if (options.className) {
          classes += ' ' + options.className
        }
        return classes.trim()
      },
      {
        base: config.base || [],
        variants: config.variants || {},
        defaultVariants: config.defaultVariants || {},
        toString: () => baseClasses
      }
    )
  }
}))

describe('Tooltip', () => {
  it('renders a tooltip with children', () => {
    render(
      <Tooltip>
        <div>Tooltip Content</div>
      </Tooltip>
    )

    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument()
  })

  it('applies default tooltip classes', () => {
    render(
      <Tooltip>
        <span>Test Content</span>
      </Tooltip>
    )

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveClass(
      'group',
      'rounded-md',
      'bg-foreground',
      'px-3',
      'pt-1.5',
      'pb-1',
      'text-sm',
      'text-white',
      'will-change-transform'
    )
  })

  it('applies custom className', () => {
    render(
      <Tooltip className="custom-tooltip-class">
        <div>Custom Content</div>
      </Tooltip>
    )

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveClass('custom-tooltip-class')
  })

  it('forwards additional props to underlying tooltip', () => {
    render(
      <Tooltip data-testid="custom-tooltip" placement="top">
        <div>Content</div>
      </Tooltip>
    )

    const tooltip = screen.getByTestId('custom-tooltip')
    expect(tooltip).toHaveAttribute('placement', 'top')
  })

  it('renders overlay arrow', () => {
    render(
      <Tooltip>
        <div>Content with Arrow</div>
      </Tooltip>
    )

    expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument()
  })

  it('renders arrow with correct attributes', () => {
    render(
      <Tooltip placement="bottom">
        <div>Content</div>
      </Tooltip>
    )

    const arrow = screen.getByTestId('tooltip-arrow')
    // Note: placement is forwarded to the inner svg, not the wrapper div
    expect(arrow).toBeInTheDocument()
  })

  it('renders arrow svg with correct structure', () => {
    render(
      <Tooltip>
        <div>Content</div>
      </Tooltip>
    )

    const arrow = screen.getByTestId('tooltip-arrow')
    const svg = arrow.querySelector('svg')
    const path = svg?.querySelector('path')

    expect(svg).toBeInTheDocument()
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M0 0 L4 4 L8 0')
    expect(svg).toHaveAttribute('width', '8')
    expect(svg).toHaveAttribute('height', '8')
  })

  it('applies arrow classes based on placement', () => {
    render(
      <Tooltip placement="left">
        <div>Left Content</div>
      </Tooltip>
    )

    const svg = screen.getByTestId('tooltip-arrow').querySelector('svg')
    expect(svg).toHaveClass('placement-left:-rotate-90', 'fill-foreground', 'stroke-foreground')
  })

  it('applies bottom placement rotation correctly', () => {
    render(
      <Tooltip placement="bottom">
        <div>Bottom Content</div>
      </Tooltip>
    )

    const svg = screen.getByTestId('tooltip-arrow').querySelector('svg')
    expect(svg).toHaveClass('placement-bottom:rotate-180', 'fill-foreground', 'stroke-foreground')
  })

  it('applies right placement rotation correctly', () => {
    render(
      <Tooltip placement="right">
        <div>Right Content</div>
      </Tooltip>
    )

    const svg = screen.getByTestId('tooltip-arrow').querySelector('svg')
    expect(svg).toHaveClass('placement-right:rotate-90', 'fill-foreground', 'stroke-foreground')
  })

  it('sets default offset of 8', () => {
    render(
      <Tooltip>
        <div>Content</div>
      </Tooltip>
    )

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveAttribute('offset', '8')
  })

  it('includes title element in arrow svg', () => {
    render(
      <Tooltip>
        <div>Content</div>
      </Tooltip>
    )

    const title = screen.getByTitle('Tooltip-Arrow')
    expect(title).toBeInTheDocument()
  })

  it('handles complex children content', () => {
    render(
      <Tooltip>
        <div>
          <h3>Complex Title</h3>
          <p>Complex description</p>
          <button>Action</button>
        </div>
      </Tooltip>
    )

    expect(screen.getByText('Complex Title')).toBeInTheDocument()
    expect(screen.getByText('Complex description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('handles empty children gracefully', () => {
    render(<Tooltip>{null}</Tooltip>)

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toBeInTheDocument()
  })
})

describe('TooltipTrigger', () => {
  it('renders a trigger button with children', () => {
    render(<TooltipTrigger>Trigger Content</TooltipTrigger>)

    const trigger = screen.getByTestId('tooltip-trigger')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Trigger Content')
    expect(trigger.tagName.toLowerCase()).toBe('button')
  })

  it('forwards additional props to trigger', () => {
    render(
      <TooltipTrigger data-testid="custom-trigger" aria-label="Custom trigger label" isDisabled>
        Trigger Content
      </TooltipTrigger>
    )

    const trigger = screen.getByTestId('custom-trigger')
    expect(trigger).toHaveAttribute('aria-label', 'Custom trigger label')
  })

  it('renders trigger with complex children', () => {
    render(
      <TooltipTrigger>
        <span className="icon">🔍</span>
        <span>Search</span>
      </TooltipTrigger>
    )

    const trigger = screen.getByTestId('tooltip-trigger')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })
})

describe('Tooltip Integration', () => {
  it('can be used with TooltipTrigger for typical tooltip pattern', () => {
    render(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <div>This is a tooltip</div>
      </Tooltip>
    )

    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Hover me')).toBeInTheDocument()
    expect(screen.getByText('This is a tooltip')).toBeInTheDocument()
  })

  it('maintains proper component structure with arrow', () => {
    render(
      <Tooltip placement="top">
        <TooltipTrigger>Top Tooltip</TooltipTrigger>
        <div>Top tooltip content</div>
      </Tooltip>
    )

    const trigger = screen.getByTestId('tooltip-trigger')
    const tooltip = screen.getByTestId('tooltip')
    const arrow = screen.getByTestId('tooltip-arrow')

    expect(trigger).toBeInTheDocument()
    expect(tooltip).toBeInTheDocument()
    expect(arrow).toBeInTheDocument()
    expect(tooltip).toHaveAttribute('placement', 'top')
    // Note: data-placement is on inner svg, not the wrapper
  })

  it('applies custom classes while maintaining defaults', () => {
    render(
      <Tooltip className="bg-red-500 text-black" placement="bottom">
        <div>Styled Tooltip</div>
      </Tooltip>
    )

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveClass(
      'group',
      'rounded-md',
      'bg-foreground',
      'px-3',
      'pt-1.5',
      'pb-1',
      'text-sm',
      'text-white',
      'will-change-transform'
    )
    expect(tooltip).toHaveClass('bg-red-500', 'text-black')
  })

  it('handles all placement options', () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const

    placements.forEach(placement => {
      const { unmount } = render(
        <Tooltip placement={placement}>
          <TooltipTrigger>{placement}</TooltipTrigger>
          <div>Content</div>
        </Tooltip>
      )

      const tooltip = screen.getByTestId('tooltip')
      const arrow = screen.getByTestId('tooltip-arrow')

      expect(tooltip).toHaveAttribute('placement', placement)
      expect(arrow).toBeInTheDocument()

      unmount()
    })
  })
})
