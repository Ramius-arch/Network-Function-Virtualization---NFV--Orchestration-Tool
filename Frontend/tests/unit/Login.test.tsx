import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import Login from '../../src/components/Login';
import { AuthProvider } from '../../src/context/AuthContext'; // Import AuthProvider for context

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Login Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders login form correctly', () => {
    render(
      <AuthProvider>
        <Login onLoginSuccess={() => {}} />
      </AuthProvider>,
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(
      <AuthProvider>
        <Login onLoginSuccess={() => {}} />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('calls onLoginSuccess on successful login', async () => {
    const onLoginSuccess = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mock_token' }),
    });

    render(
      <AuthProvider>
        <Login onLoginSuccess={onLoginSuccess} />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledTimes(1);
      expect(onLoginSuccess).toHaveBeenCalledWith('mock_token');
    });
  });
});
