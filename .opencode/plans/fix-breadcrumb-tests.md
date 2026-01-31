# Plan to Fix Remaining 10 Failing Breadcrumb Tests

## Root Cause Analysis

The failing tests are all related to the `composeRenderProps` mock not correctly simulating the className merging behavior from the actual react-aria-components library.

**Specific Issues:**

1. **BreadcrumbItem className not applied** - Test expects `custom-item` class but mock doesn't handle `composeRenderProps` for `BreadcrumbItem` (it uses `cn()` directly)

2. **BreadcrumbLink classes missing** - Tests expect default classes like `text-foreground transition-colors` but mock doesn't apply them

3. **BreadcrumbPage classes missing** - Tests expect `font-medium text-foreground/80` but mock doesn't apply them

4. **Hover/State classes not working** - Tests expect `data-hovered:underline` but these classes aren't being applied

5. **Duplicate "More" text** - The lucide mock renders "More" in both SVG and the actual component has it, causing 2 matches instead of 1

## Implementation Plan

### 1. Fix composeRenderProps Mock
- Improve the mock to properly handle className merging 
- Ensure it calls the render function with correct props
- Make sure class merging follows the same pattern as actual react-aria-components

### 2. Fix Component Mocks
- Update `BreadcrumbItem` to properly apply classes using `cn()` pattern
- Update `BreadcrumbLink` and `BreadcrumbPage` to use the improved `composeRenderProps` mock
- Ensure all default classes are properly applied

### 3. Fix Lucide Icon Mock
- Remove the "More" text from SVG mock to prevent duplicate text
- Only the actual component should render the screen reader text

### 4. Fix Test Expectations
- Update tests that have incorrect selectors (like searching for data-testids that don't exist)
- Ensure tests are looking for the right elements with correct selectors

### 5. Verify All Fixes
- Run the specific failing tests to ensure they pass
- Ensure no regressions in previously working tests
- Run full test suite to confirm all 19 originally failing tests now pass

## Detailed Changes Required

### composeRenderProps Mock Fix
```typescript
composeRenderProps: (outerClassName: string | undefined, render: (props: any) => any) => 
  (props: any) => {
    const rendered = render(props)
    const innerClassName = typeof rendered === 'object' && rendered.className ? rendered.className : ''
    return {
      ...rendered,
      className: outerClassName ? `${outerClassName} ${innerClassName}`.trim() : innerClassName
    }
  }
```

### Lucide Mock Fix
```typescript
ChevronRightIcon: ({ className, ...props }: any) => (
  <svg data-testid="chevron-right-icon" className={className} {...props}>
  </svg>
),
MoreHorizontal: ({ className, ...props }: any) => (
  <svg data-testid="more-horizontal-icon" className={className} {...props}>
  </svg>
)
```

### Component Mock Updates
- Ensure `BreadcrumbItem` mock correctly applies default classes
- Make sure `BreadcrumbLink` and `BreadcrumbPage` properly handle `composeRenderProps`

This approach addresses the root cause (mock behavior) rather than just fixing test symptoms, ensuring the tests properly validate the component behavior.