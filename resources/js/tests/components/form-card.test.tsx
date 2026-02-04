import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FormCard } from '@/components/twc-ui/form-card'

// Mock ScrollArea component
vi.mock('@/components/twc-ui/scroll-area', () => ({
  ScrollArea: ({ children, className, ...props }: any) => (
    <div data-testid="scroll-area" className={className} {...props}>
      {children}
    </div>
  )
}))

describe('FormCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<FormCard>Card content</FormCard>)

      expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <FormCard>
          <div data-testid="card-content">Card content</div>
        </FormCard>
      )

      expect(screen.getByTestId('card-content')).toBeInTheDocument()
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders nested elements', () => {
      render(
        <FormCard>
          <div data-testid="nested-content">
            <span data-testid="nested-span">Nested content</span>
          </div>
        </FormCard>
      )

      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
      expect(screen.getByTestId('nested-span')).toBeInTheDocument()
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })
  })

  describe('Props Integration', () => {
    it('applies custom className to outer container', () => {
      const { container } = render(<FormCard className="custom-card-class">Test content</FormCard>)

      const outerDiv = container.firstChild as HTMLElement
      expect(outerDiv).toHaveClass('custom-card-class')
    })

    it('applies custom innerClassName to ScrollArea', () => {
      render(<FormCard innerClassName="custom-inner-class">Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('custom-inner-class')
    })

    it('passes all props correctly', () => {
      const { container } = render(
        <FormCard className="outer-class" innerClassName="inner-class">
          <div data-testid="card-children">Children content</div>
        </FormCard>
      )

      const outerDiv = container.firstChild as HTMLElement
      const scrollArea = screen.getByTestId('scroll-area')

      expect(outerDiv).toHaveClass('outer-class')
      expect(scrollArea).toHaveClass('inner-class')
      expect(screen.getByTestId('card-children')).toBeInTheDocument()
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })

  describe('Default Classes', () => {
    it('applies default classes to outer container', () => {
      const { container } = render(<FormCard>Test content</FormCard>)

      const outerDiv = container.firstChild as HTMLElement
      expect(outerDiv).toHaveClass('flex', 'flex-1', 'flex-col', 'overflow-hidden')
    })

    it('applies default classes to inner ScrollArea', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('min-h-0', 'flex-1', 'rounded-md', 'border', 'bg-background')
    })
  })

  describe('Combined Classes', () => {
    it('merges custom className with default classes', () => {
      const { container } = render(<FormCard className="custom-class">Test content</FormCard>)

      const outerDiv = container.firstChild as HTMLElement
      expect(outerDiv).toHaveClass('flex', 'flex-1', 'flex-col', 'overflow-hidden', 'custom-class')
    })

    it('merges custom innerClassName with default ScrollArea classes', () => {
      render(<FormCard innerClassName="custom-inner-class">Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass(
        'min-h-0',
        'flex-1',
        'rounded-md',
        'border',
        'bg-background',
        'custom-inner-class'
      )
    })

    it('applies both custom classes simultaneously', () => {
      const { container } = render(
        <FormCard className="outer-custom" innerClassName="inner-custom">
          Test content
        </FormCard>
      )

      const outerDiv = container.firstChild as HTMLElement
      const scrollArea = screen.getByTestId('scroll-area')

      expect(outerDiv).toHaveClass('outer-custom')
      expect(scrollArea).toHaveClass('inner-custom')
    })
  })

  describe('Component Structure', () => {
    it('renders proper DOM hierarchy', () => {
      render(
        <FormCard>
          <div data-testid="test-content">Content</div>
        </FormCard>
      )

      const scrollArea = screen.getByTestId('scroll-area')
      const content = screen.getByTestId('test-content')

      expect(scrollArea).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(scrollArea).toContainElement(content)
    })
  })

  describe('Footer Support', () => {
    it('renders without footer when not provided', () => {
      render(<FormCard>Test content</FormCard>)

      expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
      expect(screen.queryByText('Footer content')).not.toBeInTheDocument()
    })

    it('renders footer when provided', () => {
      render(
        <FormCard footer={<div data-testid="footer-content">Footer content</div>}>
          Test content
        </FormCard>
      )

      expect(screen.getByTestId('footer-content')).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies footer styling when provided', () => {
      render(
        <FormCard footer={<div data-testid="footer-content">Footer content</div>}>
          Test content
        </FormCard>
      )

      const footer = screen.getByTestId('footer-content')?.parentElement
      expect(footer).toHaveClass(
        'flex',
        'w-full',
        'flex-none',
        'items-center',
        'justify-end',
        'px-4',
        'py-1.5'
      )
    })
  })

  describe('Styling Behavior', () => {
    it('applies overflow hidden to prevent card overflow', () => {
      const { container } = render(<FormCard>Test content</FormCard>)

      const outerDiv = container.firstChild as HTMLElement
      expect(outerDiv).toHaveClass('overflow-hidden')
    })

    it('applies border styling to scroll area', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('border')
    })

    it('applies background color to inner scroll area', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('bg-background')
    })

    it('applies rounded corners to inner scroll area', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('rounded-md')
    })
  })

  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<FormCard>{''}</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toBeInTheDocument()
    })

    it('renders with null as children', () => {
      render(<FormCard>{null}</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toBeInTheDocument()
    })

    it('renders without any optional props', () => {
      render(<FormCard>Minimal content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toBeInTheDocument()
      expect(screen.getByText('Minimal content')).toBeInTheDocument()
    })

    it('renders scrollable content', () => {
      render(
        <FormCard>
          <div style={{ height: '200px' }} data-testid="scrollable-content">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Scrollable line {i + 1}</p>
            ))}
          </div>
        </FormCard>
      )

      expect(screen.getByTestId('scrollable-content')).toBeInTheDocument()
      expect(screen.getByText('Scrollable line 1')).toBeInTheDocument()
      expect(screen.getByText('Scrollable line 20')).toBeInTheDocument()
    })

    it('handles complex nested content', () => {
      render(
        <FormCard>
          <div data-testid="complex-content">
            <header data-testid="header">Header</header>
            <main data-testid="main">
              <section data-testid="section">
                <h2 data-testid="heading">Title</h2>
                <p data-testid="paragraph">Paragraph content</p>
              </section>
            </main>
            <footer data-testid="footer">Footer</footer>
          </div>
        </FormCard>
      )

      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('section')).toBeInTheDocument()
      expect(screen.getByTestId('heading')).toBeInTheDocument()
      expect(screen.getByTestId('paragraph')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('applies flex layout that adapts to content', () => {
      const { container } = render(
        <FormCard>
          <div data-testid="responsive-content">
            <div data-testid="item-1">Item 1</div>
            <div data-testid="item-2">Item 2</div>
          </div>
        </FormCard>
      )

      const outerDiv = container.firstChild as HTMLElement
      const scrollArea = screen.getByTestId('scroll-area')

      expect(outerDiv).toHaveClass('flex', 'flex-1', 'flex-col')
      expect(scrollArea).toHaveClass('min-h-0', 'flex-1')
    })

    it('maintains proper sizing constraints', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('min-h-0', 'flex-1')
    })
  })

  describe('Layout Behavior', () => {
    it('applies proper flex direction to card', () => {
      const { container } = render(<FormCard>Test content</FormCard>)

      const outerDiv = container.firstChild as HTMLElement
      expect(outerDiv).toHaveClass('flex-col')
    })

    it('applies proper flex properties to scroll area', () => {
      render(<FormCard>Test content</FormCard>)

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveClass('flex-1')
    })
  })
})
