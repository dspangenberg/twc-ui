import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/twc-ui/empty'

describe('Empty', () => {
  it('renders an Empty component', () => {
    render(<Empty data-testid="empty-container" />)
    expect(screen.getByTestId('empty-container')).toBeInTheDocument()
  })

  it('applies standard classes', () => {
    render(<Empty data-testid="empty-container" />)
    const container = screen.getByTestId('empty-container')
    expect(container).toHaveClass(
      'flex',
      'min-w-0',
      'flex-1',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-6',
      'text-balance',
      'rounded-lg',
      'border-dashed',
      'p-6',
      'text-center',
      'md:p-12'
    )
  })

  it('applies custom className', () => {
    render(<Empty data-testid="empty-container" className="custom-empty-class" />)
    const container = screen.getByTestId('empty-container')
    expect(container).toHaveClass('custom-empty-class')
  })

  it('retains data-slot attribute', () => {
    render(<Empty data-testid="empty-container" />)
    const container = screen.getByTestId('empty-container')
    expect(container).toHaveAttribute('data-slot', 'empty')
  })

  it('forwards additional props', () => {
    render(<Empty data-testid="empty-container" role="status" aria-label="Empty state" />)
    const container = screen.getByTestId('empty-container')
    expect(container).toHaveAttribute('role', 'status')
    expect(container).toHaveAttribute('aria-label', 'Empty state')
  })

  it('renders children correctly', () => {
    render(
      <Empty data-testid="empty-container">
        <div>Empty Content</div>
      </Empty>
    )
    expect(screen.getByText('Empty Content')).toBeInTheDocument()
  })
})

describe('EmptyHeader', () => {
  it('renders an EmptyHeader component', () => {
    render(<EmptyHeader data-testid="empty-header" />)
    expect(screen.getByTestId('empty-header')).toBeInTheDocument()
  })

  it('applies standard classes', () => {
    render(<EmptyHeader data-testid="empty-header" />)
    const header = screen.getByTestId('empty-header')
    expect(header).toHaveClass(
      'flex',
      'max-w-sm',
      'flex-col',
      'items-center',
      'gap-2',
      'text-center'
    )
  })

  it('applies custom className', () => {
    render(<EmptyHeader data-testid="empty-header" className="custom-header-class" />)
    const header = screen.getByTestId('empty-header')
    expect(header).toHaveClass('custom-header-class')
  })

  it('retains data-slot attribute', () => {
    render(<EmptyHeader data-testid="empty-header" />)
    const header = screen.getByTestId('empty-header')
    expect(header).toHaveAttribute('data-slot', 'empty-header')
  })

  it('forwards additional props', () => {
    render(<EmptyHeader data-testid="empty-header" role="heading" />)
    const header = screen.getByTestId('empty-header')
    expect(header).toHaveAttribute('role', 'heading')
  })
})

describe('EmptyMedia', () => {
  it('renders an EmptyMedia component with default variant', () => {
    render(<EmptyMedia data-testid="empty-media" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toBeInTheDocument()
    expect(media).toHaveAttribute('data-slot', 'empty-icon')
    expect(media).toHaveAttribute('data-variant', 'default')
  })

  it('applies default variant classes', () => {
    render(<EmptyMedia data-testid="empty-media" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toHaveClass(
      'mb-2',
      'flex',
      'shrink-0',
      'items-center',
      'justify-center',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0'
    )
  })

  it('renders with icon variant', () => {
    render(<EmptyMedia data-testid="empty-media" variant="icon" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toHaveAttribute('data-variant', 'icon')
    expect(media).toHaveClass(
      'mb-2',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      'flex',
      'size-10',
      'shrink-0',
      'items-center',
      'justify-center',
      'rounded-lg',
      'bg-muted',
      'text-foreground',
      "[&_svg:not([class*='size-'])]:size-6"
    )
  })

  it('applies custom className', () => {
    render(<EmptyMedia data-testid="empty-media" className="custom-media-class" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toHaveClass('custom-media-class')
  })

  it('applies custom className with variant', () => {
    render(<EmptyMedia data-testid="empty-media" variant="icon" className="custom-media-class" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toHaveClass('custom-media-class')
    expect(media).toHaveAttribute('data-variant', 'icon')
  })

  it('forwards additional props', () => {
    render(<EmptyMedia data-testid="empty-media" aria-hidden="true" />)
    const media = screen.getByTestId('empty-media')
    expect(media).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders children like icons correctly', () => {
    render(
      <EmptyMedia data-testid="empty-media">
        <svg data-testid="test-icon" />
      </EmptyMedia>
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })
})

it('wendet default variant Klassen an', () => {
  render(<EmptyMedia data-testid="empty-media" />)
  const media = screen.getByTestId('empty-media')
  expect(media).toHaveClass(
    'mb-2',
    'flex',
    'shrink-0',
    'items-center',
    'justify-center',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0'
  )
})

it('rendert mit icon variant', () => {
  render(<EmptyMedia data-testid="empty-media" variant="icon" />)
  const media = screen.getByTestId('empty-media')
  expect(media).toHaveAttribute('data-variant', 'icon')
  expect(media).toHaveClass(
    'mb-2',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
    'flex',
    'size-10',
    'shrink-0',
    'items-center',
    'justify-center',
    'rounded-lg',
    'bg-muted',
    'text-foreground',
    "[&_svg:not([class*='size-'])]:size-6"
  )
})

it('wendet custom className an', () => {
  render(<EmptyMedia data-testid="empty-media" className="custom-media-class" />)
  const media = screen.getByTestId('empty-media')
  expect(media).toHaveClass('custom-media-class')
})

it('wendet custom className mit variant an', () => {
  render(<EmptyMedia data-testid="empty-media" variant="icon" className="custom-media-class" />)
  const media = screen.getByTestId('empty-media')
  expect(media).toHaveClass('custom-media-class')
  expect(media).toHaveAttribute('data-variant', 'icon')
})

it('leitet additional props durch', () => {
  render(<EmptyMedia data-testid="empty-media" aria-hidden="true" />)
  const media = screen.getByTestId('empty-media')
  expect(media).toHaveAttribute('aria-hidden', 'true')
})

it('rendert children wie Icons korrekt', () => {
  render(
    <EmptyMedia data-testid="empty-media">
      <svg data-testid="test-icon" />
    </EmptyMedia>
  )
  expect(screen.getByTestId('test-icon')).toBeInTheDocument()
})
})

describe('EmptyTitle', () =>
{
  it('rendert eine EmptyTitle-Komponente', () => {
    render(<EmptyTitle data-testid="empty-title" />)
    expect(screen.getByTestId('empty-title')).toBeInTheDocument()
  })

  it('wendet Standard-Klassen an', () => {
    render(<EmptyTitle data-testid="empty-title" />)
    const title = screen.getByTestId('empty-title')
    expect(title).toHaveClass('font-medium', 'text-lg', 'tracking-tight')
  })

  it('wendet custom className an', () => {
    render(<EmptyTitle data-testid="empty-title" className="custom-title-class" />)
    const title = screen.getByTestId('empty-title')
    expect(title).toHaveClass('custom-title-class')
  })

  it('behält data-slot Attribut', () => {
    render(<EmptyTitle data-testid="empty-title" />)
    const title = screen.getByTestId('empty-title')
    expect(title).toHaveAttribute('data-slot', 'empty-title')
  })

  it('rendert title Text', () => {
    render(<EmptyTitle>No items found</EmptyTitle>)
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('leitet additional props durch', () => {
    render(<EmptyTitle data-testid="empty-title" role="heading" />)
    const title = screen.getByTestId('empty-title')
    expect(title).toHaveAttribute('role', 'heading')
  })
}
)

describe('EmptyDescription', () =>
{
  it('rendert eine EmptyDescription-Komponente', () => {
    render(<EmptyDescription data-testid="empty-description" />)
    expect(screen.getByTestId('empty-description')).toBeInTheDocument()
  })

  it('wendet Standard-Klassen an', () => {
    render(<EmptyDescription data-testid="empty-description" />)
    const description = screen.getByTestId('empty-description')
    expect(description).toHaveClass(
      'text-muted-foreground',
      'text-sm/relaxed',
      '[&>a:hover]:text-primary',
      '[&>a]:underline',
      '[&>a]:underline-offset-4'
    )
  })

  it('wendet custom className an', () => {
    render(
      <EmptyDescription data-testid="empty-description" className="custom-description-class" />
    )
    const description = screen.getByTestId('empty-description')
    expect(description).toHaveClass('custom-description-class')
  })

  it('behält data-slot Attribut', () => {
    render(<EmptyDescription data-testid="empty-description" />)
    const description = screen.getByTestId('empty-description')
    expect(description).toHaveAttribute('data-slot', 'empty-description')
  })

  it('rendert description Text', () => {
    render(<EmptyDescription>Your search returned no results.</EmptyDescription>)
    expect(screen.getByText('Your search returned no results.')).toBeInTheDocument()
  })

  it('stützt Links in description mit korrekten Stilen', () => {
    render(
      <EmptyDescription>
        Try <a href="/help">getting help</a> or search again.
      </EmptyDescription>
    )

    const link = screen.getByRole('link', { name: 'getting help' })
    expect(link).toHaveAttribute('href', '/help')
  })

  it('leitet additional props durch', () => {
    render(<EmptyDescription data-testid="empty-description" role="status" />)
    const description = screen.getByTestId('empty-description')
    expect(description).toHaveAttribute('role', 'status')
  })
}
)

describe('EmptyContent', () =>
{
  it('rendert eine EmptyContent-Komponente', () => {
    render(<EmptyContent data-testid="empty-content" />)
    expect(screen.getByTestId('empty-content')).toBeInTheDocument()
  })

  it('wendet Standard-Klassen an', () => {
    render(<EmptyContent data-testid="empty-content" />)
    const content = screen.getByTestId('empty-content')
    expect(content).toHaveClass(
      'flex',
      'w-full',
      'min-w-0',
      'max-w-sm',
      'flex-col',
      'items-center',
      'gap-4',
      'text-balance',
      'text-sm'
    )
  })

  it('wendet custom className an', () => {
    render(<EmptyContent data-testid="empty-content" className="custom-content-class" />)
    const content = screen.getByTestId('empty-content')
    expect(content).toHaveClass('custom-content-class')
  })

  it('behält data-slot Attribut', () => {
    render(<EmptyContent data-testid="empty-content" />)
    const content = screen.getByTestId('empty-content')
    expect(content).toHaveAttribute('data-slot', 'empty-content')
  })

  it('rendert children korrekt', () => {
    render(
      <EmptyContent>
        <button type="button">Action Button</button>
      </EmptyContent>
    )
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
  })

  it('leitet additional props durch', () => {
    render(<EmptyContent data-testid="empty-content" role="group" />)
    const content = screen.getByTestId('empty-content')
    expect(content).toHaveAttribute('role', 'group')
  })
}
)

describe('Komplette Empty Komponente', () =>
{
  it('kombiniert alle Sub-Komponenten korrekt', () => {
    render(
      <Empty data-testid="complete-empty">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <svg data-testid="empty-icon" />
          </EmptyMedia>
          <EmptyTitle>No Data</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            There is no data to display. <a href="/add">Add some data</a> to get started.
          </EmptyDescription>
          <button type="button" data-testid="action-button">
            Add Data
          </button>
        </EmptyContent>
      </Empty>
    )

    expect(screen.getByTestId('complete-empty')).toBeInTheDocument()
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument()
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText(/There is no data to display./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add some data' })).toBeInTheDocument()
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })

  it('hat korrekte data-slot Attribute für alle Komponenten', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>Title</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>Description</EmptyDescription>
        </EmptyContent>
      </Empty>
    )

    expect(document.querySelector('[data-slot="empty"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-header"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-icon"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-title"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-description"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-content"]')).toBeInTheDocument()
  })

  it('unterstützt komplexe nested Strukturen', () => {
    render(
      <Empty className="border-2 border-gray-200">
        <EmptyHeader className="pt-4">
          <EmptyMedia variant="icon" className="bg-blue-100">
            <div data-testid="custom-icon">📁</div>
          </EmptyMedia>
          <EmptyTitle className="text-xl">No Files</EmptyTitle>
        </EmptyHeader>
        <EmptyContent className="pb-4">
          <EmptyDescription className="max-w-xs">
            This folder is empty. <a href="/upload">Upload files</a> or{' '}
            <a href="/create">create new ones</a>.
          </EmptyDescription>
          <div className="flex gap-2">
            <button type="button">Upload</button>
            <button type="button">Create</button>
          </div>
        </EmptyContent>
      </Empty>
    )

    expect(screen.getByText('No Files')).toBeInTheDocument()
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    expect(screen.getByText(/This folder is empty./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Upload files' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'create new ones' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('verwendet default variant für EmptyMedia wenn nicht angegeben', () => {
    render(
      <Empty>
        <EmptyMedia data-testid="default-media">
          <svg />
        </EmptyMedia>
      </Empty>
    )

    const media = screen.getByTestId('default-media')
    expect(media).toHaveAttribute('data-variant', 'default')
    expect(media).toHaveClass('bg-transparent')
    expect(media).not.toHaveClass('bg-muted')
  })
}
)

describe('Accessibility', () =>
{
  it('unterstützt ARIA Attribute', () => {
    render(
      <Empty role="status" aria-live="polite">
        <EmptyTitle>Loading</EmptyTitle>
        <EmptyDescription>Please wait...</EmptyDescription>
      </Empty>
    )

    const empty = screen.getByRole('status')
    expect(empty).toHaveAttribute('aria-live', 'polite')
  })

  it('unterstützt keyboard-navigierbare Elemente', () => {
    render(
      <Empty>
        <EmptyContent>
          <button type="button">Accessible Button</button>
          <a href="/help">Help Link</a>
        </EmptyContent>
      </Empty>
    )

    expect(screen.getByRole('button', { name: 'Accessible Button' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Help Link' })).toBeInTheDocument()
  })
}
)
