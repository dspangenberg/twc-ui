import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AppProvider } from '../providers/AppProvider';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initialization', () => {
    test('should initialize with default values when no stored user', () => {
      const TestComponent = () => {
        const { user, isAuthenticated, isLoading } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
            <div data-testid="authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="loading">{isLoading.toString()}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    test('should restore user from localStorage on initialization', async () => {
      const storedUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? user.name : 'null'}</div>
            <div data-testid="authenticated">{isAuthenticated.toString()}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });
    });

    test('should handle corrupted localStorage data gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? user.name : 'null'}</div>
            <div data-testid="authenticated">{isAuthenticated.toString()}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
        expect(consoleSpy).toHaveBeenCalledWith('Failed to parse stored user:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Login functionality', () => {
    test('should handle successful login', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const TestComponent = () => {
        const { user, isAuthenticated, login, isLoading } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? user.name : 'null'}</div>
            <div data-testid="authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="loading">{isLoading.toString()}</div>
            <button onClick={() => login('john@example.com', 'password')}>Login</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      });
    });

    test('should handle login failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const TestComponent = () => {
        const { login, isLoading } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await login('john@example.com', 'wrongpassword');
          } catch (err) {
            setError((err as Error).message);
          }
        };

        return (
          <div>
            <div data-testid="loading">{isLoading.toString()}</div>
            <div data-testid="error">{error || 'no error'}</div>
            <button onClick={handleLogin}>Login</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('should handle network errors during login', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const TestComponent = () => {
        const { login } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await login('john@example.com', 'password');
          } catch (err) {
            setError((err as Error).message);
          }
        };

        return (
          <div>
            <div data-testid="error">{error || 'no error'}</div>
            <button onClick={handleLogin}>Login</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
        expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Logout functionality', () => {
    test('should clear user data on logout', async () => {
      const storedUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

      const TestComponent = () => {
        const { user, isAuthenticated, logout } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? user.name : 'null'}</div>
            <div data-testid="authenticated">{isAuthenticated.toString()}</div>
            <button onClick={logout}>Logout</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      fireEvent.click(screen.getByText('Logout'));

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('User update functionality', () => {
    test('should update user data correctly', async () => {
      const storedUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

      const TestComponent = () => {
        const { user, updateUser } = useAuth();
        return (
          <div>
            <div data-testid="user-name">{user ? user.name : 'null'}</div>
            <div data-testid="user-email">{user ? user.email : 'null'}</div>
            <button onClick={() => updateUser({ name: 'Jane Doe', email: 'jane@example.com' })}>
              Update User
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
      });

      fireEvent.click(screen.getByText('Update User'));

      expect(screen.getByTestId('user-name')).toHaveTextContent('Jane Doe');
      expect(screen.getByTestId('user-email')).toHaveTextContent('jane@example.com');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ ...storedUser, name: 'Jane Doe', email: 'jane@example.com' })
      );
    });

    test('should not update user when no user is logged in', () => {
      const TestComponent = () => {
        const { user, updateUser } = useAuth();
        return (
          <div>
            <div data-testid="user">{user ? user.name : 'null'}</div>
            <button onClick={() => updateUser({ name: 'Jane Doe' })}>Update User</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Update User'));

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Hook usage outside provider', () => {
    test('should throw error when useAuth is used outside AuthProvider', () => {
      const TestComponent = () => {
        useAuth();
        return <div>Test</div>;
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => render(<TestComponent />)).toThrow(
        'useAuth must be used within an AuthProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.className = '';
  });

  describe('Initialization', () => {
    test('should initialize with default theme when no stored theme', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });

    test('should initialize with custom default theme', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
    });

    test('should restore theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const TestComponent = () => {
        const { theme, effectiveTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
    });

    test('should ignore invalid stored theme values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
    });
  });

  describe('Theme switching', () => {
    test('should switch to light theme', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={() => setTheme('light')}>Set Light</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Set Light'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('should switch to dark theme', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Set Dark'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should handle system theme with light preference', () => {
      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={() => setTheme('system')}>Set System</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Set System'));

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    test('should handle system theme with dark preference', () => {
      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={() => setTheme('system')}>Set System</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Set System'));

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Theme toggling', () => {
    test('should toggle from light to dark', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
        React.useEffect(() => {
          setTheme('light');
        }, [setTheme]);

        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Toggle'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
    });

    test('should toggle from dark to light', () => {
      const TestComponent = () => {
        const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
        React.useEffect(() => {
          setTheme('dark');
        }, [setTheme]);

        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Toggle'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });

    test('should toggle system theme based on effective theme', () => {
      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const TestComponent = () => {
        const { theme, effectiveTheme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="effective-theme">{effectiveTheme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Toggle'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
    });
  });

  describe('System theme preference changes', () => {
    test('should respond to system theme preference changes', () => {
      let mediaQueryCallback: ((event: MediaQueryListEvent) => void) | null = null;

      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryCallback = callback;
          }
        }),
        removeEventListener: jest.fn(),
      }));

      const TestComponent = () => {
        const { effectiveTheme } = useTheme();
        return <div data-testid="effective-theme">{effectiveTheme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');

      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('should not respond to system changes when not using system theme', () => {
      let mediaQueryCallback: ((event: MediaQueryListEvent) => void) | null = null;

      (window.matchMedia as jest.Mock).mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryCallback = callback;
          }
        }),
        removeEventListener: jest.fn(),
      }));

      const TestComponent = () => {
        const { effectiveTheme, setTheme } = useTheme();
        React.useEffect(() => {
          setTheme('light');
        }, [setTheme]);

        return <div data-testid="effective-theme">{effectiveTheme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');

      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });
  });

  describe('Hook usage outside provider', () => {
    test('should throw error when useTheme is used outside ThemeProvider', () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});

describe('AppProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.className = '';
  });

  test('should provide both AuthContext and ThemeContext', () => {
    const TestComponent = () => {
      const { user, isAuthenticated } = useAuth();
      const { theme, effectiveTheme } = useTheme();

      return (
        <div>
          <div data-testid="auth-user">{user ? user.name : 'null'}</div>
          <div data-testid="auth-authenticated">{isAuthenticated.toString()}</div>
          <div data-testid="theme">{theme}</div>
          <div data-testid="effective-theme">{effectiveTheme}</div>
        </div>
      );
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('auth-user')).toHaveTextContent('null');
    expect(screen.getByTestId('auth-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
  });

  test('should allow interaction with both providers simultaneously', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const TestComponent = () => {
      const { user, login } = useAuth();
      const { theme, setTheme } = useTheme();

      return (
        <div>
          <div data-testid="auth-user">{user ? user.name : 'null'}</div>
          <div data-testid="theme">{theme}</div>
          <button onClick={() => login('john@example.com', 'password')}>Login</button>
          <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
        </div>
      );
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-user')).toHaveTextContent('John Doe');
    });

    fireEvent.click(screen.getByText('Set Dark Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('should maintain provider independence', async () => {
    const TestComponent = () => {
      const { logout } = useAuth();
      const { theme, setTheme } = useTheme();

      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={logout}>Logout</button>
          <button onClick={() => setTheme('light')}>Set Light Theme</button>
        </div>
      );
    };

    const storedUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'user') return JSON.stringify(storedUser);
      if (key === 'theme') return 'dark';
      return null;
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByText('Set Light Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  test('should render children correctly', () => {
    const TestChild = () => <div data-testid="test-child">Child Component</div>;

    render(
      <AppProvider>
        <TestChild />
      </AppProvider>
    );

    expect(screen.getByTestId('test-child')).toHaveTextContent('Child Component');
  });

  test('should handle multiple children', () => {
    render(
      <AppProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </AppProvider>
    );

    expect(screen.getByTestId('child-1')).toHaveTextContent('Child 1');
    expect(screen.getByTestId('child-2')).toHaveTextContent('Child 2');
    expect(screen.getByTestId('child-3')).toHaveTextContent('Child 3');
  });
});

describe('Provider Integration and Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.className = '';
  });

  describe('Provider nesting and composition', () => {
    test('should handle nested providers correctly', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="nested-theme">{theme}</div>;
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeProvider defaultTheme="light">
            <TestComponent />
          </ThemeProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId('nested-theme')).toHaveTextContent('light');
    });

    test('should handle provider unmounting gracefully', () => {
      const TestComponent = ({ showProvider }: { showProvider: boolean }) => {
        if (showProvider) {
          return (
            <AuthProvider>
              <div data-testid="provider-content">Provider active</div>
            </AuthProvider>
          );
        }
        return <div data-testid="no-provider">No provider</div>;
      };

      const { rerender } = render(<TestComponent showProvider={true} />);
      expect(screen.getByTestId('provider-content')).toBeInTheDocument();

      rerender(<TestComponent showProvider={false} />);
      expect(screen.getByTestId('no-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('provider-content')).not.toBeInTheDocument();
    });
  });

  describe('Rapid state changes and race conditions', () => {
    test('should handle rapid auth state changes', async () => {
      const mockUser1 = { id: '1', name: 'User 1', email: 'user1@example.com', role: 'user' };
      const mockUser2 = { id: '2', name: 'User 2', email: 'user2@example.com', role: 'admin' };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockUser1 })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUser2 });

      const TestComponent = () => {
        const { user, login } = useAuth();
        return (
          <div>
            <div data-testid="current-user">{user ? user.name : 'null'}</div>
            <button onClick={() => login('user1@example.com', 'password')}>Login User 1</button>
            <button onClick={() => login('user2@example.com', 'password')}>Login User 2</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login User 1'));
      fireEvent.click(screen.getByText('Login User 2'));

      await waitFor(() => {
        expect(screen.getByTestId('current-user')).toHaveTextContent('User 2');
      });
    });

    test('should handle rapid theme changes', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button
              onClick={() => {
                setTheme('light');
                setTheme('dark');
                setTheme('system');
              }}
            >
              Rapid Theme Change
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Rapid Theme Change'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
  });

  describe('Memory and performance considerations', () => {
    test('should not cause memory leaks with event listeners', () => {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const addSpy = jest.spyOn(mql, 'addEventListener');
      const removeSpy = jest.spyOn(mql, 'removeEventListener');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(addSpy).toHaveBeenCalled();
      unmount();
      expect(removeSpy).toHaveBeenCalled();

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    test('should handle large user objects efficiently', async () => {
      const largeUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        ...Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`prop${i}`, `value${i}`])),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => largeUser,
      });

      const TestComponent = () => {
        const { user, login } = useAuth();
        return (
          <div>
            <div data-testid="user-name">{user ? user.name : 'null'}</div>
            <button onClick={() => login('john@example.com', 'password')}>Login</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(largeUser));
    });
  });

  describe('Browser compatibility and edge cases', () => {
    test('should handle localStorage being unavailable', () => {
      const originalLS = window.localStorage;
      Object.defineProperty(window, 'localStorage', { value: undefined, writable: true });

      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
          </div>
        );
      };

      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();

      Object.defineProperty(window, 'localStorage', { value: originalLS, writable: true });
    });

    test('should handle matchMedia being unavailable', () => {
      const originalMM = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', { value: undefined, writable: true });

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();

      Object.defineProperty(window, 'matchMedia', { value: originalMM, writable: true });
    });
  });
});

// Additional utility functions for testing
const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

const createMockFetchResponse = (data: any, ok = true) => ({
  ok,
  json: async () => data,
});

// Performance test helper
const measureRenderTime = (component: React.ReactElement) => {
  const start = performance.now();
  render(component);
  const end = performance.now();
  return end - start;
};

// Test for provider render performance (optional performance test)
describe('Provider Performance', () => {
  test('should render providers efficiently', () => {
    const TestComponent = () => {
      const { user } = useAuth();
      const { theme } = useTheme();
      return (
        <div>
          <div>{user ? user.name : 'null'}</div>
          <div>{theme}</div>
        </div>
      );
    };

    const renderTime = measureRenderTime(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(renderTime).toBeLessThan(50);
  });
});