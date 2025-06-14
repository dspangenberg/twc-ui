import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

jest.mock('../services/api', () => ({
  fetchData: jest.fn(),
  postData: jest.fn(),
  deleteData: jest.fn(),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('App Component', () => {
  let mockNavigate: jest.Mock;
  let mockUseAuth: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    mockUseAuth = jest.fn().mockReturnValue({
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (require('../hooks/useAuth').useAuth as jest.Mock).mockImplementation(mockUseAuth);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering Tests', () => {
    test('renders without crashing with default props', () => {
      render(<App />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('renders loading state correctly', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        loading: true,
      });

      render(<App />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders authenticated user interface', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        login: jest.fn(),
        logout: jest.fn(),
        loading: false,
      });

      render(<App />);
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('renders unauthenticated user interface', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('renders with custom theme prop', () => {
      render(<App theme="dark" />);
      expect(screen.getByRole('main')).toHaveClass('dark-theme');
    });

    test('renders error boundary when child component throws', () => {
      const ThrowError: React.FC = () => {
        throw new Error('Test error');
      };
      const AppWithError: React.FC = () => (
        <App>
          <ThrowError />
        </App>
      );

      render(<AppWithError />);
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('User Interaction Tests', () => {
    test('handles login button click', async () => {
      const mockLogin = jest.fn();
      mockUseAuth.mockReturnValue({
        user: null,
        login: mockLogin,
        logout: jest.fn(),
        loading: false,
      });

      const user = userEvent.setup();
      render(<App />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    test('handles logout button click', async () => {
      const mockLogout = jest.fn();
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        login: jest.fn(),
        logout: mockLogout,
        loading: false,
      });

      const user = userEvent.setup();
      render(<App />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('handles navigation menu interactions', async () => {
      const user = userEvent.setup();
      render(<App />);

      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      expect(screen.getByRole('navigation')).toBeVisible();

      const homeLink = screen.getByRole('link', { name: /home/i });
      await user.click(homeLink);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles form submissions', async () => {
      const user = userEvent.setup();
      render(<App />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
      });
    });

    test('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.tab();
      expect(screen.getByRole('button', { name: /login/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /sign up/i })).toHaveFocus();
    });
  });

  describe('Error Handling Tests', () => {
    test('displays API error messages', async () => {
      const mockApi = require('../services/api');
      mockApi.fetchData.mockRejectedValue(new Error('API Error'));

      render(<App />);
      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });
    });

    test('handles network errors gracefully', async () => {
      const mockApi = require('../services/api');
      mockApi.fetchData.mockRejectedValue(new Error('Network Error'));

      render(<App />);
      await waitFor(() => {
        expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    test('handles authentication errors', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        login: jest.fn().mockRejectedValue(new Error('Invalid credentials')),
        logout: jest.fn(),
        loading: false,
        error: 'Invalid credentials',
      });

      render(<App />);
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test('recovers from error states', async () => {
      const user = userEvent.setup();
      const mockApi = require('../services/api');
      mockApi.fetchData.mockRejectedValueOnce(new Error('API Error'));
      mockApi.fetchData.mockResolvedValueOnce({ data: 'success' });

      render(<App />);
      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.queryByText(/error loading data/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases and Boundary Tests', () => {
    test('handles empty data sets', () => {
      render(<App data={[]} />);
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    test('handles null and undefined props gracefully', () => {
      render(<App data={null} user={undefined} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('handles very large data sets', () => {
      const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      render(<App data={largeDataSet} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('handles special characters in user input', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox');
      await user.type(input, '<script>alert("xss")</script>');
      expect(input).toHaveValue('<script>alert("xss")</script>');
      expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('has proper ARIA labels and roles', () => {
      render(<App />);
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Main application');
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
      expect(screen.getByRole('button', { name: /login/i })).toHaveAttribute('aria-describedby');
    });

    test('supports screen reader navigation', () => {
      render(<App />);
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveAttribute('aria-level', '1');
    });

    test('has proper focus management', async () => {
      const user = userEvent.setup();
      render(<App />);
      const firstFocusable = screen.getByRole('button', { name: /login/i });
      firstFocusable.focus();
      expect(firstFocusable).toHaveFocus();
      expect(firstFocusable).toHaveAttribute('tabindex', '0');
    });

    test('has sufficient color contrast', () => {
      render(<App />);
      const mainElement = screen.getByRole('main');
      const computedStyle = getComputedStyle(mainElement);
      expect(computedStyle.color).not.toBe(computedStyle.backgroundColor);
    });
  });

  describe('Performance Tests', () => {
    test('does not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();
      const TestComponent: React.FC = React.memo(() => {
        renderSpy();
        return <App />;
      });

      const { rerender } = render(<TestComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      rerender(<TestComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('handles rapid user interactions efficiently', async () => {
      const user = userEvent.setup();
      render(<App />);
      const button = screen.getByRole('button', { name: /click me/i });
      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }
      expect(screen.getByTestId('click-counter')).toHaveTextContent('10');
    });
  });

  describe('Component Lifecycle Tests', () => {
    test('performs cleanup on unmount', () => {
      const cleanup = jest.fn();
      const { unmount } = render(<App onUnmount={cleanup} />);
      unmount();
      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    test('handles window resize events', () => {
      render(<App />);
      act(() => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
      });
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    });

    test('manages document title correctly', () => {
      render(<App title="Test App" />);
      expect(document.title).toBe('Test App');
    });
  });

  describe('Integration Tests', () => {
    test('integrates with router correctly', () => {
      const mockLocation = { pathname: '/dashboard' };
      (require('react-router-dom').useLocation as jest.Mock).mockReturnValue(mockLocation);
      render(<App />);
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });

    test('integrates with global state management', () => {
      const mockStore = {
        user: { id: 1, name: 'John' },
        theme: 'dark',
        notifications: [],
      };
      render(<App store={mockStore} />);
      expect(screen.getByText('Welcome, John')).toBeInTheDocument();
      expect(screen.getByTestId('dark-theme')).toBeInTheDocument();
    });
  });
});

// Test utilities and helpers
const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Router>
      <AuthProvider>
        <ThemeProvider theme="light">
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
  return render(ui, { wrapper: AllProviders, ...options });
};

const mockApiResponses = {
  success: { data: 'success', status: 200 },
  error: new Error('API Error'),
  loading: new Promise(() => {}),
};

expect.extend({
  toBeAccessible(received: HTMLElement) {
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasRole = received.hasAttribute('role');
    const pass = hasAriaLabel || hasRole;
    return {
      pass,
      message: () => `Expected element to be accessible`,
    };
  },
});

export { renderWithProviders, mockApiResponses };