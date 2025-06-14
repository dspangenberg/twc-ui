import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DocPage from '../DocPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'test-doc-1' }),
}));

// Mock data for testing different scenarios
const mockDocData = {
  id: 'test-doc-1',
  title: 'Test Documentation Page',
  content: 'This is comprehensive test content for the documentation page.',
  lastModified: '2023-10-01T10:30:00Z',
  tags: ['react', 'testing', 'documentation'],
  author: 'Test Author',
  category: 'Development',
  status: 'published',
  version: '1.0.0'
};

const mockEmptyDoc = {
  id: 'empty-doc',
  title: '',
  content: '',
  lastModified: '',
  tags: [],
  author: '',
  category: '',
  status: 'draft',
  version: ''
};

const mockLargeDoc = {
  ...mockDocData,
  id: 'large-doc',
  title: 'A'.repeat(200),
  content: 'Lorem ipsum '.repeat(1000),
  tags: Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`)
};

// Mock functions for component callbacks
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnShare = jest.fn();
const mockOnNavigate = jest.fn();
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

// Helper function to render component with default props
const renderDocPage = (props: any = {}) => {
  const defaultProps = {
    doc: mockDocData,
    isLoading: false,
    isEditing: false,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onShare: mockOnShare,
    onNavigate: mockOnNavigate,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    ...props
  };
  return render(<DocPage {...defaultProps} />);
};

// Helper to render component with user event setup
const renderWithUser = (props: any = {}) => {
  const user = userEvent.setup();
  const renderResult = renderDocPage(props);
  return { user, ...renderResult };
};

describe('DocPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering - Happy Path', () => {
    test('renders document title correctly', () => {
      renderDocPage();
      expect(screen.getByText('Test Documentation Page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Documentation Page');
    });

    test('renders document content with proper formatting', () => {
      renderDocPage();
      expect(screen.getByText('This is comprehensive test content for the documentation page.')).toBeInTheDocument();
    });

    test('displays author information correctly', () => {
      renderDocPage();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText(/authored by/i)).toBeInTheDocument();
    });

    test('shows formatted last modified date', () => {
      renderDocPage();
      expect(screen.getByText(/october|oct/i)).toBeInTheDocument();
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });

    test('renders all document tags as interactive elements', () => {
      renderDocPage();
      mockDocData.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
      const tagButtons = screen.getAllByRole('button', { name: /tag/i });
      expect(tagButtons).toHaveLength(mockDocData.tags.length);
    });

    test('displays document category and status', () => {
      renderDocPage();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText(/published/i)).toBeInTheDocument();
    });

    test('shows document version information', () => {
      renderDocPage();
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('triggers edit mode when edit button is clicked', async () => {
      const { user } = renderWithUser();
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockDocData);
    });

    test('calls delete handler with confirmation', async () => {
      const { user } = renderWithUser();
      window.confirm = jest.fn(() => true);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('delete'));
      expect(mockOnDelete).toHaveBeenCalledWith(mockDocData.id);
    });

    test('cancels delete when user declines confirmation', async () => {
      const { user } = renderWithUser();
      window.confirm = jest.fn(() => false);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    test('handles share functionality correctly', async () => {
      const { user } = renderWithUser();
      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);
      expect(mockOnShare).toHaveBeenCalledWith(mockDocData);
    });

    test('navigates when back button is clicked', async () => {
      const { user } = renderWithUser();
      const backButton = screen.getByRole('button', { name: /back|return/i });
      await user.click(backButton);
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });

    test('handles tag clicks for filtering/navigation', async () => {
      const { user } = renderWithUser();
      const firstTag = screen.getByText(mockDocData.tags[0]);
      await user.click(firstTag);
      expect(mockOnNavigate).toHaveBeenCalledWith(expect.objectContaining({ tag: mockDocData.tags[0] }));
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('handles completely empty document gracefully', () => {
      renderDocPage({ doc: mockEmptyDoc });
      expect(screen.getByText(/untitled|no title/i)).toBeInTheDocument();
      expect(screen.getByText(/no content available|empty document/i)).toBeInTheDocument();
    });

    test('handles undefined document prop', () => {
      renderDocPage({ doc: undefined });
      expect(screen.getByText(/document not found|loading/i)).toBeInTheDocument();
    });

    test('handles null document prop', () => {
      renderDocPage({ doc: null });
      expect(screen.getByText(/document not found|not available/i)).toBeInTheDocument();
    });

    test('handles missing optional callbacks', () => {
      const { container } = render(<DocPage doc={mockDocData} />);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(mockDocData.title)).toBeInTheDocument();
    });

    test('handles extremely long content without breaking layout', () => {
      renderDocPage({ doc: mockLargeDoc });
      expect(screen.getByText(mockLargeDoc.title.substring(0, 50))).toBeInTheDocument();
      expect(screen.getByText(/lorem ipsum/i)).toBeInTheDocument();
    });

    test('handles special characters and HTML in content safely', () => {
      const specialDoc = {
        ...mockDocData,
        title: 'Title with <script>alert("xss")</script>',
        content: 'Content with <>&"\' and 🚀'
      };
      renderDocPage({ doc: specialDoc });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText(/special chars/i)).toBeInTheDocument();
      expect(screen.getByText(/🚀/)).toBeInTheDocument();
    });

    test('handles empty tags array', () => {
      renderDocPage({ doc: { ...mockDocData, tags: [] } });
      expect(screen.getByText(/no tags|untagged/i)).toBeInTheDocument();
    });

    test('handles maximum number of tags gracefully', () => {
      renderDocPage({ doc: mockLargeDoc });
      expect(screen.getByText('tag-1')).toBeInTheDocument();
      const showMore = screen.queryByText(/show more|\+\d+/i);
      if (showMore) expect(showMore).toBeInTheDocument();
    });

    test('handles invalid date formats', () => {
      renderDocPage({ doc: { ...mockDocData, lastModified: 'invalid-date' } });
      expect(screen.getByText(/invalid date|unknown date/i)).toBeInTheDocument();
    });

    test('handles missing required fields', () => {
      renderDocPage({ doc: { id: 'incomplete-doc' } });
      expect(screen.getByText(/untitled|unknown/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling and Failure Conditions', () => {
    test('handles edit callback errors gracefully', async () => {
      const mockErrorEdit = jest.fn().mockRejectedValue(new Error('Edit failed'));
      const { user } = renderWithUser({ onEdit: mockErrorEdit });
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      await waitFor(() => expect(mockErrorEdit).toHaveBeenCalled());
      expect(screen.queryByText(/error|failed/i)).toBeInTheDocument();
    });

    test('handles delete callback errors', async () => {
      const mockErrorDelete = jest.fn().mockRejectedValue(new Error('Delete failed'));
      const { user } = renderWithUser({ onDelete: mockErrorDelete });
      window.confirm = jest.fn(() => true);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      await waitFor(() => expect(mockErrorDelete).toHaveBeenCalled());
    });

    test('handles share callback errors', async () => {
      const mockErrorShare = jest.fn().mockRejectedValue(new Error('Share failed'));
      const { user } = renderWithUser({ onShare: mockErrorShare });
      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);
      await waitFor(() => expect(mockErrorShare).toHaveBeenCalled());
    });

    test('handles network errors during operations', async () => {
      const netErr = Object.assign(new Error('Network error'), { name: 'NetworkError' });
      const mockNetErrEdit = jest.fn().mockRejectedValue(netErr);
      const { user } = renderWithUser({ onEdit: mockNetErrEdit });
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      await waitFor(() => expect(screen.getByText(/network|connection/i)).toBeInTheDocument());
    });

    test('handles permission errors', async () => {
      const permErr = Object.assign(new Error('No permission'), { name: 'PermissionError' });
      const mockPermErrDelete = jest.fn().mockRejectedValue(permErr);
      const { user } = renderWithUser({ onDelete: mockPermErrDelete });
      window.confirm = jest.fn(() => true);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      await waitFor(() => expect(screen.getByText(/permission|unauthorized/i)).toBeInTheDocument());
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    test('uses proper semantic HTML structure', () => {
      renderDocPage();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    test('has ARIA labels and descriptions', () => {
      renderDocPage();
      const editBtn = screen.getByRole('button', { name: /edit/i });
      expect(editBtn).toHaveAttribute('aria-label', expect.stringContaining('edit'));
      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      expect(deleteBtn).toHaveAttribute('aria-label', expect.stringContaining('delete'));
    });

    test('supports keyboard navigation', async () => {
      const { user } = renderWithUser();
      await user.tab();
      expect(screen.getByRole('button', { name: /edit/i })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: /delete/i })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: /share/i })).toHaveFocus();
    });

    test('activates buttons with Enter and Space', async () => {
      const { user } = renderWithUser();
      const editBtn = screen.getByRole('button', { name: /edit/i });
      editBtn.focus();
      await user.keyboard('{Enter}');
      expect(mockOnEdit).toHaveBeenCalled();
      const shareBtn = screen.getByRole('button', { name: /share/i });
      shareBtn.focus();
      await user.keyboard(' ');
      expect(mockOnShare).toHaveBeenCalled();
    });

    test('manages focus in modals/forms', async () => {
      const { user } = renderWithUser();
      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);
      await waitFor(() => {
        expect(document.activeElement).toBeInstanceOf(HTMLElement);
      });
    });

    test('provides alt text for images if present', () => {
      renderDocPage();
      const images = screen.queryAllByRole('img');
      images.forEach(img => expect(img).toHaveAttribute('alt'));
    });
  });

  describe('Loading States and Async Behavior', () => {
    test('shows loading indicator when isLoading is true', () => {
      renderDocPage({ isLoading: true });
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('hides content while loading', () => {
      renderDocPage({ isLoading: true });
      expect(screen.queryByText(mockDocData.title)).not.toBeInTheDocument();
    });

    test('renders content after loading', () => {
      const { rerender } = renderDocPage({ isLoading: true });
      rerender(<DocPage doc={mockDocData} isLoading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(screen.getByText(mockDocData.title)).toBeInTheDocument();
    });

    test('disables interactions during loading', () => {
      renderDocPage({ isLoading: true });
      screen.queryAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
    });

    test('shows intermediate loading during async operations', async () => {
      const slowSave = jest.fn(() => new Promise(res => setTimeout(res, 100)));
      const { user } = renderWithUser({ onSave: slowSave, isEditing: true });
      const saveBtn = screen.getByRole('button', { name: /save/i });
      await user.click(saveBtn);
      expect(screen.getByText(/saving|processing/i)).toBeInTheDocument();
      await waitFor(() => expect(slowSave).toHaveBeenCalled());
    });
  });

  describe('Editing Mode and Form Interactions', () => {
    test('renders form fields in edit mode', () => {
      renderDocPage({ isEditing: true });
      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /content/i })).toBeInTheDocument();
    });

    test('shows save and cancel in edit mode', () => {
      renderDocPage({ isEditing: true });
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    test('handles save operation with updated inputs', async () => {
      const { user } = renderWithUser({ isEditing: true });
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      const saveBtn = screen.getByRole('button', { name: /save/i });
      await user.click(saveBtn);
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title' }));
    });

    test('handles cancel action', async () => {
      const { user } = renderWithUser({ isEditing: true });
      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelBtn);
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('validates required fields before saving', async () => {
      const { user } = renderWithUser({ isEditing: true });
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      await user.clear(titleInput);
      const saveBtn = screen.getByRole('button', { name: /save/i });
      await user.click(saveBtn);
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    test('preserves unsaved changes when toggling modes', () => {
      const { rerender } = renderDocPage({ isEditing: true });
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      fireEvent.change(titleInput, { target: { value: 'Modified Title' } });
      rerender(<DocPage doc={mockDocData} isEditing={false} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      rerender(<DocPage doc={mockDocData} isEditing={true} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(screen.queryByText(/unsaved changes/i)).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    test('avoids unnecessary re-renders with same props', () => {
      const { rerender } = renderDocPage();
      const spy = jest.spyOn(console, 'log').mockImplementation();
      rerender(<DocPage doc={mockDocData} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(spy).not.toHaveBeenCalledWith(expect.stringContaining('render'));
      spy.mockRestore();
    });

    test('handles rapid successive interactions', async () => {
      const { user } = renderWithUser();
      const editBtn = screen.getByRole('button', { name: /edit/i });
      await Promise.all(Array(10).fill(0).map(() => user.click(editBtn)));
      expect(mockOnEdit).toHaveBeenCalledTimes(10);
    });

    test('renders large content within performance thresholds', () => {
      const start = performance.now();
      renderDocPage({ doc: mockLargeDoc });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000);
      expect(screen.getByText(mockLargeDoc.title.substring(0, 50))).toBeInTheDocument();
    });

    test('cleans up event listeners on unmount', () => {
      const addSpy = jest.spyOn(document, 'addEventListener');
      const removeSpy = jest.spyOn(document, 'removeEventListener');
      const { unmount } = renderDocPage();
      const added = addSpy.mock.calls.length;
      unmount();
      const removed = removeSpy.mock.calls.length;
      expect(removed).toBeGreaterThanOrEqual(added);
      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });

  describe('Integration and Prop Updates', () => {
    test('updates rendered content when props change', () => {
      const { rerender } = renderDocPage();
      expect(screen.getByText('Test Documentation Page')).toBeInTheDocument();
      const updated = { ...mockDocData, title: 'Updated Title' };
      rerender(<DocPage doc={updated} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });

    test('applies new callback props during interactions', async () => {
      const { user, rerender } = renderWithUser();
      const newEdit = jest.fn();
      rerender(<DocPage doc={mockDocData} onEdit={newEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(newEdit).toHaveBeenCalled();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    test('maintains consistent state across rapid prop changes', () => {
      const { rerender } = renderDocPage({ isEditing: true });
      rerender(<DocPage doc={mockDocData} isEditing={false} onEdit={mockOnEdit} />);
      rerender(<DocPage doc={mockDocData} isEditing={true} onEdit={mockOnEdit} />);
      rerender(<DocPage doc={mockDocData} isEditing={false} onEdit={mockOnEdit} />);
      expect(screen.getByText(mockDocData.title)).toBeInTheDocument();
    });

    test('reflects external document updates in edit mode', () => {
      const { rerender } = renderDocPage({ isEditing: true });
      const external = { ...mockDocData, title: 'Externally Updated' };
      rerender(<DocPage doc={external} isEditing={true} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(screen.getByDisplayValue('Externally Updated')).toBeInTheDocument();
    });

    test('works with router navigation integration', async () => {
      const { user } = renderWithUser();
      const backBtn = screen.getByRole('button', { name: /back/i });
      await user.click(backBtn);
      expect(mockOnNavigate).toHaveBeenCalled();
    });
  });

  describe('Component State and Lifecycle', () => {
    test('initializes with correct default state', () => {
      renderDocPage();
      expect(screen.getByText(mockDocData.title)).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('mounts and unmounts without errors', () => {
      const { unmount } = renderDocPage();
      expect(() => unmount()).not.toThrow();
    });

    test('preserves internal state across re-renders', () => {
      const { rerender } = renderDocPage();
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      rerender(<DocPage doc={mockDocData} onEdit={mockOnEdit} onDelete={mockOnDelete} onShare={mockOnShare} />);
      expect(mockOnEdit).toHaveBeenCalled();
    });
}); // End of main describe

// Export test utilities for reuse
export {
  mockDocData,
  mockEmptyDoc,
  mockLargeDoc,
  renderDocPage,
  renderWithUser
};

// Custom Jest matcher for basic accessibility checks
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
    }
  }
}

expect.extend({
  toBeAccessible(received: HTMLElement) {
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasRoleAttr = received.hasAttribute('role');
    const hasAlt = received.tagName === 'IMG' ? received.hasAttribute('alt') : true;
    const pass = hasAriaLabel || hasRoleAttr || hasAlt;
    return pass
      ? { pass: true, message: () => 'Element is accessible' }
      : { pass: false, message: () => 'Expected element to have aria-label, role, or alt text' };
  }
});