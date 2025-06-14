import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '../Button';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    test('renders button with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    test('renders button with custom text content', () => {
      render(<Button>Custom Button Text</Button>);
      expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
    });

    test('renders button with JSX children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    test('applies custom className to button element', () => {
      render(<Button className="custom-button-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button-class');
    });

    test('forwards HTML button attributes correctly', () => {
      render(
        <Button
          id="test-button"
          data-testid="custom-button"
          title="Button tooltip"
        >
          Test
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Button tooltip');
    });
  });

  describe('Button Variants and States', () => {
    test('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-primary');
    });

    test('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-secondary');
    });

    test('renders danger variant correctly', () => {
      render(<Button variant="danger">Danger Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-danger');
    });

    test('renders success variant correctly', () => {
      render(<Button variant="success">Success Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-success');
    });

    test('renders different sizes correctly', () => {
      const sizes = ['small', 'medium', 'large'];
      sizes.forEach(size => {
        render(<Button size={size}>{`${size} Button`}</Button>);
        const button = screen.getByRole('button', { name: new RegExp(size, 'i') });
        expect(button).toHaveClass(`btn-${size}`);
      });
    });

    test('renders disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    test('renders loading state correctly', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('button')).toHaveTextContent(/loading/i);
    });

    test('renders outline variant correctly', () => {
      render(<Button outline>Outline Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-outline');
    });

    test('renders full width button correctly', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-full-width');
    });
  });

  describe('User Interactions', () => {
    test('calls onClick handler when button is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Clickable Button</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    test('does not call onClick when button is disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('does not call onClick when button is in loading state', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} loading>Loading Button</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('handles keyboard activation with Enter key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard activation with Space key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Space Button</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles focus events correctly', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(
        <Button onFocus={handleFocus} onBlur={handleBlur}>
          Focus Test Button
        </Button>
      );
      const button = screen.getByRole('button');

      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test('handles mouse events correctly', async () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      const user = userEvent.setup();

      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Mouse Events Button
        </Button>
      );
      const button = screen.getByRole('button');

      await user.hover(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      await user.unhover(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    test('prevents event propagation when specified', async () => {
      const parentClick = jest.fn();
      const buttonClick = jest.fn(e => e.stopPropagation());
      const user = userEvent.setup();

      render(
        <div onClick={parentClick}>
          <Button onClick={buttonClick}>Stop Propagation Button</Button>
        </div>
      );

      await user.click(screen.getByRole('button'));
      expect(buttonClick).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has correct default ARIA attributes', () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toHaveAttribute('aria-pressed');
    });

    test('supports custom ARIA label', () => {
      render(<Button aria-label="Custom accessible label">🔍</Button>);
      const button = screen.getByRole('button', { name: 'Custom accessible label' });
      expect(button).toHaveAttribute('aria-label', 'Custom accessible label');
    });

    test('supports aria-describedby for additional context', () => {
      render(
        <>
          <Button aria-describedby="help-text">Submit Form</Button>
          <div id="help-text">This will submit your form data</div>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('indicates loading state to screen readers', () => {
      render(<Button loading aria-label="Submit form">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('supports toggle button functionality', () => {
      const { rerender } = render(<Button pressed={false}>Toggle</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(<Button pressed={true}>Toggle</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    test('has proper focus management', async () => {
      const user = userEvent.setup();
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });

    test('supports keyboard navigation when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    test('announces state changes to screen readers', () => {
      const { rerender } = render(<Button>Normal State</Button>);

      rerender(<Button loading>Loading State</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');

      rerender(<Button disabled>Disabled State</Button>);
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('supports high contrast mode indicators', () => {
      render(<Button variant="primary">High Contrast Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border: solid');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles null children gracefully', () => {
      render(<Button>{null}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    test('handles undefined children gracefully', () => {
      render(<Button>{undefined}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('handles empty string children', () => {
      render(<Button>{''}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    test('handles complex nested children', () => {
      render(
        <Button>
          <div>
            <span>Nested</span>
            <strong>Content</strong>
          </div>
        </Button>
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('handles rapid successive clicks', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Rapid Click Test</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    test('handles click event with custom event data', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} data-custom="test-data">Custom Data Button</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            dataset: expect.objectContaining({
              custom: 'test-data'
            })
          })
        })
      );
    });

    test('maintains state consistency during prop changes', () => {
      const { rerender } = render(<Button>Initial State</Button>);
      let button = screen.getByRole('button');
      expect(button).not.toBeDisabled();

      rerender(<Button disabled>Disabled State</Button>);
      button = screen.getByRole('button');
      expect(button).toBeDisabled();

      rerender(<Button loading>Loading State</Button>);
      button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');

      rerender(<Button>Back to Normal</Button>);
      button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-busy');
    });

    test('handles invalid prop combinations gracefully', () => {
      render(<Button disabled loading>Conflicted Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    test('handles extremely long text content', () => {
      const longText = 'A'.repeat(1000);
      render(<Button>{longText}</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longText);
    });

    test('handles special characters in content', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      render(<Button>{specialChars}</Button>);
      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });

    test('handles async onClick handlers', async () => {
      const asyncHandler = jest.fn().mockResolvedValue('success');
      const user = userEvent.setup();

      render(<Button onClick={asyncHandler}>Async Button</Button>);

      await user.click(screen.getByRole('button'));
      expect(asyncHandler).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(asyncHandler).toHaveReturnedWith(Promise.resolve('success'));
      });
    });

    test('handles thrown errors in onClick handlers', async () => {
      const errorHandler = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<Button onClick={errorHandler}>Error Button</Button>);

      await user.click(screen.getByRole('button'));
      expect(errorHandler).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });

  describe('Form Integration', () => {
    test('renders as submit button when type is submit', () => {
      render(<Button type="submit">Submit Form</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('renders as reset button when type is reset', () => {
      render(<Button type="reset">Reset Form</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    test('defaults to button type when no type specified', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    test('submits form when submit button is clicked', async () => {
      const handleSubmit = jest.fn(e => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <input name="test" defaultValue="value" />
          <Button type="submit">Submit</Button>
        </form>
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    test('resets form when reset button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <input name="test" defaultValue="initial" />
          <Button type="reset">Reset</Button>
        </form>
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'changed');
      expect(input.value).toBe('changed');

      await user.click(screen.getByRole('button'));
      expect(input.value).toBe('initial');
    });

    test('handles form attribute correctly', () => {
      render(
        <>
          <form id="external-form">
            <input name="test" />
          </form>
          <Button form="external-form" type="submit">External Submit</Button>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'external-form');
    });
  });

  describe('Visual Regression (Snapshots)', () => {
    test('matches snapshot for default button', () => {
      const { container } = render(<Button>Default Button</Button>);
      expect(container.firstChild).toMatchSnapshot('button-default');
    });

    test('matches snapshot for all variants', () => {
      const variants = ['primary', 'secondary', 'danger', 'success', 'warning', 'info'];
      variants.forEach(variant => {
        const { container } = render(
          <Button variant={variant as any}>{`${variant} Button`}</Button>
        );
        expect(container.firstChild).toMatchSnapshot(`button-variant-${variant}`);
      });
    });

    test('matches snapshot for all sizes', () => {
      const sizes = ['small', 'medium', 'large'];
      sizes.forEach(size => {
        const { container } = render(
          <Button size={size as any}>{`${size} Button`}</Button>
        );
        expect(container.firstChild).toMatchSnapshot(`button-size-${size}`);
      });
    });

    test('matches snapshot for disabled state', () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      expect(container.firstChild).toMatchSnapshot('button-disabled');
    });

    test('matches snapshot for loading state', () => {
      const { container } = render(<Button loading>Loading Button</Button>);
      expect(container.firstChild).toMatchSnapshot('button-loading');
    });

    test('matches snapshot for outline variant', () => {
      const { container } = render(<Button outline>Outline Button</Button>);
      expect(container.firstChild).toMatchSnapshot('button-outline');
    });

    test('matches snapshot for full width button', () => {
      const { container } = render(<Button fullWidth>Full Width Button</Button>);
      expect(container.firstChild).toMatchSnapshot('button-full-width');
    });

    test('matches snapshot with icon and text', () => {
      const { container } = render(
        <Button>
          <span role="img" aria-label="search">🔍</span>
          Search
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot('button-with-icon');
    });
  });

  describe('Performance and Memory', () => {
    test('does not cause memory leaks with event handlers', () => {
      const handleClick = jest.fn();
      const { unmount } = render(<Button onClick={handleClick}>Memory Test</Button>);

      unmount();

      fireEvent.click(document.body);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('handles rapid re-renders efficiently', () => {
      const { rerender } = render(<Button>Initial</Button>);

      for (let i = 0; i < 100; i++) {
        rerender(<Button key={i}>{`Render ${i}`}</Button>);
      }

      expect(screen.getByRole('button')).toHaveTextContent('Render 99');
    });

    test('efficiently handles prop changes', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>);

      const startTime = performance.now();

      rerender(<Button variant="secondary">Test</Button>);
      rerender(<Button variant="danger">Test</Button>);
      rerender(<Button variant="success">Test</Button>);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Integration with Other Components', () => {
    test('works correctly within form elements', async () => {
      const handleSubmit = jest.fn(e => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input name="name" required />
          </label>
          <Button type="submit">Submit Form</Button>
        </form>
      );

      await user.type(screen.getByRole('textbox'), 'John Doe');
      await user.click(screen.getByRole('button'));

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    test('works correctly as part of button groups', () => {
      render(
        <div role="group" aria-label="Action buttons">
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});