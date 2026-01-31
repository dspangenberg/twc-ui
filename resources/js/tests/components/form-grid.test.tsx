import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormGrid } from '@/components/twc-ui/form-grid'

describe('FormGrid', () => {
  it('renders a FormGrid with children', () => {
    render(
      <FormGrid>
        <div data-testid="test-child">Test Content</div>
      </FormGrid>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies grid-cols-24 by default', () => {
    render(
      <FormGrid>
        <div>Content</div>
      </FormGrid>
    )

    const gridContainer = screen.getByText('Content').parentElement
    expect(gridContainer).toHaveClass('grid-cols-24')
  })

  describe('Title Functionality', () => {
    it('displays title when present', () => {
      render(
        <FormGrid title="Form Title">
          <div>Content</div>
        </FormGrid>
      )

      expect(screen.getByText('Form Title')).toBeInTheDocument()
    })

    it('does not display title when empty', () => {
      render(
        <FormGrid title="">
          <div>Content</div>
        </FormGrid>
      )

      // Check that no title container is rendered
      const container = screen.getByText('Content').parentElement?.parentElement
      expect(container?.querySelector('.flex.items-center.px-4')).not.toBeInTheDocument()
    })

    it('applies default titleClass', () => {
      render(
        <FormGrid title="Test Title">
          <div>Content</div>
        </FormGrid>
      )

      const titleElement = screen.getByText('Test Title').parentElement
      expect(titleElement).toHaveClass(
        'font-medium',
        'text-sm',
        'text-black',
        'mt-4',
        'pb-3',
        'border-b'
      )
    })

    it('applies custom titleClass', () => {
      render(
        <FormGrid title="Test Title" titleClass="custom-title-class">
          <div>Content</div>
        </FormGrid>
      )

      const titleElement = screen.getByText('Test Title').parentElement
      expect(titleElement).toHaveClass('custom-title-class')
    })

    it('renders action when present', () => {
      render(
        <FormGrid
          title="Form Title"
          action={
            <button type="button" data-testid="action-button">
              Action
            </button>
          }
        >
          <div>Content</div>
        </FormGrid>
      )

      expect(screen.getByTestId('action-button')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Grid Configuration', () => {
    it('applies grid-cols-6 when cols={6}', () => {
      render(
        <FormGrid cols={6}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('grid-cols-6')
    })

    it('applies grid-cols-12 when cols={12}', () => {
      render(
        <FormGrid cols={12}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('grid-cols-12')
    })

    it('applies grid-cols-24 when cols={24}', () => {
      render(
        <FormGrid cols={24}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('grid-cols-24')
    })
  })

  describe('Border Styling', () => {
    it('applies border styling when border=true', () => {
      render(
        <FormGrid border>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('border-accent', 'border-t')
    })

    it('does not apply border styling when border=false', () => {
      render(
        <FormGrid border={false}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).not.toHaveClass('mx-0', 'border-accent', 'border-t', 'pt-4')
    })
  })

  describe('Grid Layout', () => {
    it('applies grid classes when grid=true', () => {
      render(
        <FormGrid grid>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('m-0', 'grid', 'gap-x-3', 'gap-y-6', 'px-4', 'py-2')
    })

    it('does not apply grid classes when grid=false', () => {
      render(
        <FormGrid grid={false}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).not.toHaveClass('m-0', 'grid', 'gap-x-3', 'gap-y-6', 'px-4', 'py-2')
    })
  })

  describe('Margin Styling', () => {
    it('applies margin classes when margin=true', () => {
      render(
        <FormGrid margin>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('mt-3')
    })

    it('does not apply margin classes when margin=false', () => {
      render(
        <FormGrid margin={false}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('not-first:mt-2')
    })
  })

  describe('Width Styling', () => {
    it('applies w-full when fullWidth=true', () => {
      render(
        <FormGrid fullWidth>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('w-full')
    })

    it('does not apply w-full when fullWidth=false', () => {
      render(
        <FormGrid fullWidth={false}>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).not.toHaveClass('w-full')
    })
  })

  describe('Custom Classes', () => {
    it('applies custom className', () => {
      render(
        <FormGrid className="custom-class">
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('custom-class')
    })

    it('retains base classes with custom className', () => {
      render(
        <FormGrid className="custom-class">
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass('custom-class', 'flex-1', 'px-4', 'last:mb-3')
    })
  })

  describe('Default Props', () => {
    it('uses correct default values', () => {
      render(
        <FormGrid>
          <div>Content</div>
        </FormGrid>
      )

      const gridContainer = screen.getByText('Content').parentElement
      expect(gridContainer).toHaveClass(
        'grid-cols-24',
        'w-full',
        'm-0',
        'grid',
        'gap-x-3',
        'gap-y-6',
        'px-4',
        'py-2',
        'mt-3'
      )
    })
  })

  describe('Structure', () => {
    it('has correct HTML structure', () => {
      render(
        <FormGrid title="Test Title" className="test-class">
          <div data-testid="child-content">Test Content</div>
        </FormGrid>
      )

      const outerContainer = screen.getByText('Test Title').parentElement?.parentElement
      const titleContainer = screen.getByText('Test Title').parentElement
      const gridContainer = screen.getByTestId('child-content').parentElement

      expect(outerContainer).toHaveClass('flex-1', 'border-accent')
      expect(titleContainer).toHaveClass('flex', 'items-center', 'px-4')
      expect(gridContainer).toHaveClass('flex-1', 'px-4', 'last:mb-3', 'test-class')
    })

    it('renders multiple children correctly', () => {
      render(
        <FormGrid>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </FormGrid>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('Complex Combinations', () => {
    it('combines all props correctly', () => {
      render(
        <FormGrid
          title="Complex Form"
          cols={12}
          border
          grid
          margin
          fullWidth
          className="complex-form"
          titleClass="complex-title"
          action={
            <button type="button" data-testid="complex-action">
              Submit
            </button>
          }
        >
          <div data-testid="complex-content">Complex Content</div>
        </FormGrid>
      )

      expect(screen.getByText('Complex Form')).toBeInTheDocument()
      expect(screen.getByTestId('complex-action')).toBeInTheDocument()
      expect(screen.getByTestId('complex-content')).toBeInTheDocument()

      const titleElement = screen.getByText('Complex Form').parentElement
      expect(titleElement).toHaveClass('complex-title')

      const gridContainer = screen.getByTestId('complex-content').parentElement
      expect(gridContainer).toHaveClass(
        'grid-cols-12',
        'border-accent',
        'border-t',
        'm-0',
        'grid',
        'gap-x-3',
        'gap-y-6',
        'px-4',
        'py-2',
        'mt-3',
        'w-full',
        'complex-form'
      )
    })
  })
})
