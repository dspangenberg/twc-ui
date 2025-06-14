import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import { AppHeader } from '../app-header';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

describe('AppHeader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event('resize'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the header element with proper semantic markup', () => {
      render(<AppHeader />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    it('should render with default title when no title prop is provided', () => {
      render(<AppHeader />);
      const defaultTitle = screen.queryByRole('heading', { level: 1 });
      expect(defaultTitle).toBeInTheDocument();
    });

    it('should render with custom title when title prop is provided', () => {
      const customTitle = 'My Custom Application Header';
      render(<AppHeader title={customTitle} />);
      expect(screen.getByRole('heading', { name: customTitle })).toBeInTheDocument();
    });

    it('should render logo when logo prop is provided', () => {
      const logoSrc = '/logo.png';
      const logoAlt = 'Company Logo';
      render(<AppHeader logo={{ src: logoSrc, alt: logoAlt }} />);
      const logo = screen.getByRole('img', { name: logoAlt });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', logoSrc);
    });

    it('should apply custom className when provided', () => {
      const customClassName = 'custom-header-class';
      render(<AppHeader className={customClassName} />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass(customClassName);
    });
  });

  describe('Navigation Menu', () => {
    it('should render navigation menu when navItems are provided', () => {
      const navItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
      render(<AppHeader navItems={navItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      navItems.forEach(item => {
        expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
      });
    });

    it('should render mobile menu toggle button on small screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      window.dispatchEvent(new Event('resize'));
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      expect(menuToggle).toBeInTheDocument();
    });

    it('should toggle mobile menu when menu button is clicked', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      expect(screen.queryByRole('navigation')).not.toBeVisible();
      await user.click(menuToggle);
      expect(screen.getByRole('navigation')).toBeVisible();
      await user.click(menuToggle);
      expect(screen.queryByRole('navigation')).not.toBeVisible();
    });

    it('should call onNavItemClick callback when navigation item is clicked', async () => {
      const mockOnNavItemClick = vi.fn();
      const user = userEvent.setup();
      const navItems = [{ label: 'Home', href: '/', onClick: mockOnNavItemClick }];
      render(<AppHeader navItems={navItems} />);
      const homeLink = screen.getByRole('link', { name: 'Home' });
      await user.click(homeLink);
      expect(mockOnNavItemClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AppHeader title="Test App" />);
      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('role', 'banner');
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const navItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];
      render(<AppHeader navItems={navItems} />);
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const aboutLink = screen.getByRole('link', { name: 'About' });
      await user.tab();
      expect(homeLink).toHaveFocus();
      await user.tab();
      expect(aboutLink).toHaveFocus();
    });

    it('should handle Enter and Space keys for menu toggle', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      menuToggle.focus();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('navigation')).toBeVisible();
      await user.keyboard(' ');
      expect(screen.queryByRole('navigation')).not.toBeVisible();
    });

    it('should close mobile menu on Escape key', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      await user.click(menuToggle);
      expect(screen.getByRole('navigation')).toBeVisible();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('navigation')).not.toBeVisible();
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      await user.click(menuToggle);
      const firstNavItem = screen.getByRole('link', { name: 'Home' });
      await waitFor(() => {
        expect(firstNavItem).toHaveFocus();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty navigation items array', () => {
      render(<AppHeader navItems={[]} />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle extremely long title text', () => {
      const longTitle = 'A'.repeat(1000);
      render(<AppHeader title={longTitle} />);
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent(longTitle);
    });

    it('should handle null/undefined props gracefully', () => {
      expect(() => {
        render(<AppHeader title={undefined} navItems={undefined} />);
      }).not.toThrow();
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should handle navigation items with missing href', () => {
      const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Invalid', href: null },
        { label: 'About', href: '/about' },
      ] as any;
      render(<AppHeader navItems={navItems} />);
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });

    it('should handle rapid menu toggle clicks', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      await user.click(menuToggle);
      await user.click(menuToggle);
      await user.click(menuToggle);
      expect(screen.queryByRole('navigation')).toBeVisible();
    });

    it('should handle window resize events', async () => {
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      expect(screen.queryByRole('button', { name: /menu|toggle/i })).not.toBeInTheDocument();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      window.dispatchEvent(new Event('resize'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /menu|toggle/i })).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Integration', () => {
    it('should render quickly with many navigation items', () => {
      const manyNavItems = Array.from({ length: 100 }, (_, i) => ({
        label: `Item ${i}`,
        href: `/item/${i}`,
      }));
      const startTime = performance.now();
      render(<AppHeader navItems={manyNavItems} />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should not cause memory leaks on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      unmount();
      if (addEventListenerSpy.mock.calls.length > 0) {
        expect(removeEventListenerSpy).toHaveBeenCalled();
      }
    });

    it('should work with React Router navigation', async () => {
      const mockNavigate = vi.fn();
      vi.doMock('react-router-dom', () => ({
        useNavigate: () => mockNavigate,
        Link: ({ children, to, onClick, ...props }: any) => (
          <a href={to} onClick={(e) => { e.preventDefault(); onClick?.(e); }} {...props}>
            {children}
          </a>
        ),
      }));
      const user = userEvent.setup();
      const navItems = [{ label: 'Home', href: '/', onClick: mockNavigate }];
      render(<AppHeader navItems={navItems} />);
      const homeLink = screen.getByRole('link', { name: 'Home' });
      await user.click(homeLink);
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should handle concurrent state updates', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      render(<AppHeader navItems={[{ label: 'Home', href: '/' }]} />);
      const menuToggle = screen.getByRole('button', { name: /menu|toggle/i });
      const promises = [
        user.click(menuToggle),
        user.keyboard('{Enter}'),
        user.keyboard('{Escape}'),
      ];
      await Promise.all(promises);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Custom Hooks and Context Integration', () => {
    it('should integrate with theme context if available', () => {
      const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
        <div data-theme="dark">{children}</div>
      );
      render(
        <ThemeProvider>
          <AppHeader title="Themed Header" />
        </ThemeProvider>
      );
      const header = screen.getByRole('banner');
      expect(header.closest('[data-theme="dark"]')).toBeInTheDocument();
    });

    it('should handle authentication state changes', () => {
      const { rerender } = render(<AppHeader isAuthenticated={false} />);
      expect(screen.queryByText(/login|sign in/i)).toBeInTheDocument();
      rerender(<AppHeader isAuthenticated={true} userInfo={{ name: 'John Doe' }} />);
      expect(screen.queryByText('John Doe')).toBeInTheDocument();
    });
  });
});

// Helper functions for testing
const createMockNavItems = (count: number = 3) =>
  Array.from({ length: count }, (_, i) => ({
    label: `Nav Item ${i + 1}`,
    href: `/nav-${i + 1}`,
  }));

const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Additional snapshot tests if needed
describe('Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const { container } = render(<AppHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all props', () => {
    const props = {
      title: 'Test Application',
      logo: { src: '/logo.png', alt: 'Logo' },
      navItems: createMockNavItems(3),
      className: 'custom-class',
      isAuthenticated: true,
      userInfo: { name: 'Test User', avatar: '/avatar.png' },
    };
    const { container } = render(<AppHeader {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});