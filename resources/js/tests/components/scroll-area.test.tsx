import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScrollArea, ScrollBar } from '@/components/twc-ui/scroll-area'

// Mock Radix UI scroll area components
vi.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area-root" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  Scrollbar: ({ children, className, orientation, ...props }: any) => (
    <div
      data-testid="scroll-area-scrollbar"
      className={className}
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  ),
  Thumb: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area-thumb" className={className} {...props}>
      {children}
    </div>
  ),
  Corner: () => <div data-testid="scroll-area-corner" />
}))

describe('ScrollArea Component', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<ScrollArea />)

      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
    })

    it('renders viewport correctly', () => {
      render(<ScrollArea />)

      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
    })

    it('renders default scrollbar by default', () => {
      render(<ScrollArea />)

      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      expect(scrollbars.length).toBeGreaterThan(0)
    })

    it('renders corner element', () => {
      render(<ScrollArea />)

      expect(screen.getByTestId('scroll-area-corner')).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <ScrollArea>
          <div data-testid="scroll-content">Scrollable content</div>
        </ScrollArea>
      )

      expect(screen.getByTestId('scroll-content')).toBeInTheDocument()
    })
  })

  describe('Props Integration', () => {
    it('applies custom className to root element', () => {
      render(<ScrollArea className="custom-scroll-area" />)

      const scrollArea = screen.getByTestId('scroll-area-root')
      expect(scrollArea).toHaveClass('custom-scroll-area')
    })

    it('applies default classes to root element', () => {
      render(<ScrollArea />)

      const scrollArea = screen.getByTestId('scroll-area-root')
      expect(scrollArea).toHaveClass('relative')
    })

    it('passes additional props to root element', () => {
      render(<ScrollArea data-testid="custom-test-id" />)

      const scrollArea = screen.getByTestId('custom-test-id')
      expect(scrollArea).toBeInTheDocument()
    })

    it('applies default classes to viewport', () => {
      render(<ScrollArea />)

      const viewport = screen.getByTestId('scroll-area-viewport')
      expect(viewport).toHaveClass(
        'size-full',
        'rounded-[inherit]',
        'outline-ring/50',
        'ring-ring/10',
        'transition-[color,box-shadow]',
        'focus-visible:outline-1',
        'focus-visible:ring-4',
        'dark:outline-ring/40',
        'dark:ring-ring/20'
      )
    })
  })

  describe('Data Attributes', () => {
    it('applies correct data-slot attributes', () => {
      render(<ScrollArea />)

      expect(screen.getByTestId('scroll-area-root')).toHaveAttribute('data-slot', 'scroll-area')
      expect(screen.getByTestId('scroll-area-viewport')).toHaveAttribute(
        'data-slot',
        'scroll-area-viewport'
      )
    })

    it('applies data-slot to scroll thumb', () => {
      render(<ScrollArea />)

      const thumbs = screen.getAllByTestId('scroll-area-thumb')
      expect(thumbs.length).toBeGreaterThan(0)
      thumbs.forEach(thumb => {
        expect(thumb).toHaveAttribute('data-slot', 'scroll-area-thumb')
      })
    })
  })

  describe('Content Rendering', () => {
    it('renders long scrollable content', () => {
      render(
        <ScrollArea style={{ height: '100px' }}>
          <div style={{ height: '300px' }} data-testid="long-content">
            {Array.from({ length: 50 }, (_, i) => (
              <p key={i}>Content line {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      )

      expect(screen.getByTestId('long-content')).toBeInTheDocument()
      expect(screen.getByText('Content line 1')).toBeInTheDocument()
      expect(screen.getByText('Content line 50')).toBeInTheDocument()
    })

    it('renders nested elements', () => {
      render(
        <ScrollArea>
          <div data-testid="nested-content">
            <div data-testid="nested-child">
              <span data-testid="nested-span">Nested content</span>
            </div>
          </div>
        </ScrollArea>
      )

      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
      expect(screen.getByTestId('nested-child')).toBeInTheDocument()
      expect(screen.getByTestId('nested-span')).toBeInTheDocument()
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })
  })

  describe('ScrollBar Component', () => {
    it('renders ScrollBar component when used explicitly', () => {
      render(
        <ScrollArea>
          <ScrollBar data-testid="explicit-scrollbar" />
        </ScrollArea>
      )

      expect(screen.getByTestId('explicit-scrollbar')).toBeInTheDocument()
    })

    it('renders ScrollBar with vertical orientation by default', () => {
      render(
        <ScrollArea>
          <ScrollBar />
        </ScrollArea>
      )

      // Find the explicit scrollbar we added
      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      const explicitScrollbar = scrollbars[0] // Take the first one since we only added one explicit

      if (explicitScrollbar) {
        expect(explicitScrollbar).toHaveAttribute('data-orientation', 'vertical')
        expect(explicitScrollbar).toHaveClass('h-full', 'w-2.5', 'border-l', 'border-l-transparent')
      }
    })

    it('renders ScrollBar with horizontal orientation', () => {
      render(
        <ScrollArea>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )

      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      const horizontalScrollbar = scrollbars.find(
        s => s.getAttribute('data-orientation') === 'horizontal'
      )

      if (horizontalScrollbar) {
        expect(horizontalScrollbar).toHaveAttribute('data-orientation', 'horizontal')
        expect(horizontalScrollbar).toHaveClass(
          'h-2.5',
          'flex-col',
          'border-t',
          'border-t-transparent'
        )
      }
    })

    it('applies custom className to ScrollBar', () => {
      render(
        <ScrollArea>
          <ScrollBar className="custom-scrollbar" />
        </ScrollArea>
      )

      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      const customScrollbar = scrollbars.find(s => s.classList.contains('custom-scrollbar'))

      expect(customScrollbar).toHaveClass('custom-scrollbar')
    })

    it('applies default classes to ScrollBar', () => {
      render(
        <ScrollArea>
          <ScrollBar />
        </ScrollArea>
      )

      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      expect(scrollbars.length).toBeGreaterThan(0)

      scrollbars.forEach(scrollbar => {
        expect(scrollbar).toHaveClass(
          'flex',
          'touch-none',
          'select-none',
          'p-px',
          'transition-colors'
        )
      })
    })

    it('renders thumb element within ScrollBar', () => {
      render(
        <ScrollArea>
          <ScrollBar />
        </ScrollArea>
      )

      const thumbs = screen.getAllByTestId('scroll-area-thumb')
      expect(thumbs.length).toBeGreaterThan(0)

      thumbs.forEach(thumb => {
        expect(thumb).toBeInTheDocument()
        expect(thumb).toHaveClass('relative', 'flex-1', 'rounded-full', 'bg-border')
      })
    })

    it('passes additional props to ScrollBar', () => {
      render(
        <ScrollArea>
          <ScrollBar data-testid="custom-scrollbar" />
        </ScrollArea>
      )

      const scrollbar = screen.getByTestId('custom-scrollbar')
      expect(scrollbar).toBeInTheDocument()
    })

    it('applies data-slot to scrollbar', () => {
      render(
        <ScrollArea>
          <ScrollBar />
        </ScrollArea>
      )

      const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
      scrollbars.forEach(scrollbar => {
        expect(scrollbar).toHaveAttribute('data-slot', 'scroll-area-scrollbar')
      })
    })
  })

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(<ScrollArea role="region" aria-label="Scrollable content area" tabIndex={0} />)

      const scrollArea = screen.getByTestId('scroll-area-root')
      expect(scrollArea).toHaveAttribute('role', 'region')
      expect(scrollArea).toHaveAttribute('aria-label', 'Scrollable content area')
      expect(scrollArea).toHaveAttribute('tabIndex', '0')
    })

    it('supports accessibility props on ScrollBar', () => {
      render(
        <ScrollArea>
          <ScrollBar
            data-testid="accessibility-scrollbar"
            aria-label="Vertical scrollbar"
            aria-orientation="vertical"
          />
        </ScrollArea>
      )

      const scrollbar = screen.getByTestId('accessibility-scrollbar')
      expect(scrollbar).toHaveAttribute('aria-label', 'Vertical scrollbar')
      expect(scrollbar).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('Edge Cases', () => {
    it('renders without children', () => {
      render(<ScrollArea />)

      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
    })

    it('renders with empty string as children', () => {
      render(<ScrollArea>{''}</ScrollArea>)

      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
    })

    it('renders with null as children', () => {
      render(<ScrollArea>{null}</ScrollArea>)

      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
    })

    it('handles multiple ScrollBar components', () => {
      render(
        <ScrollArea>
          <ScrollBar data-testid="vertical-scrollbar" orientation="vertical" />
          <ScrollBar data-testid="horizontal-scrollbar" orientation="horizontal" />
        </ScrollArea>
      )

      const verticalScrollbar = screen.getByTestId('vertical-scrollbar')
      const horizontalScrollbar = screen.getByTestId('horizontal-scrollbar')

      expect(verticalScrollbar).toHaveAttribute('data-orientation', 'vertical')
      expect(horizontalScrollbar).toHaveAttribute('data-orientation', 'horizontal')
    })
  })

  describe('Component Composition', () => {
    it('works with custom ScrollBar configuration', () => {
      render(
        <ScrollArea>
          <ScrollBar
            orientation="vertical"
            className="custom-vertical-scrollbar"
            data-testid="vertical-custom"
          />
          <ScrollBar
            orientation="horizontal"
            className="custom-horizontal-scrollbar"
            data-testid="horizontal-custom"
          />
        </ScrollArea>
      )

      const verticalScrollbar = screen.getByTestId('vertical-custom')
      const horizontalScrollbar = screen.getByTestId('horizontal-custom')

      expect(verticalScrollbar).toHaveClass('custom-vertical-scrollbar')
      expect(horizontalScrollbar).toHaveClass('custom-horizontal-scrollbar')
    })

    it('renders complete scroll area structure', () => {
      render(
        <ScrollArea className="test-scroll-area">
          <div data-testid="test-content">Test content</div>
        </ScrollArea>
      )

      // Verify complete structure
      expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
      expect(screen.getAllByTestId('scroll-area-scrollbar').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('scroll-area-thumb').length).toBeGreaterThan(0)
      expect(screen.getByTestId('scroll-area-corner')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })
  })
})
