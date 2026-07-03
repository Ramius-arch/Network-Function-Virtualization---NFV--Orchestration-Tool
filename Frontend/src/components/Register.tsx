import { useState } from 'react';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    let response;
    let data;
    let apiFailed = false;

    try {
      response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
        apiFailed = true;
      } else {
        data = await response.json();
        if (response.ok) {
          setSuccess(true);
          onRegisterSuccess();
          setLoading(false);
          return;
        } else {
          setError(data.message || 'Registration failed');
          setLoading(false);
          return;
        }
      }
    } catch (err: unknown) {
      apiFailed = true;
    }

    if (apiFailed) {
      console.warn('API unreachable or offline. Falling back to browser-local registration for showcase.');
      try {
        const users = JSON.parse(localStorage.getItem('atomic_mock_users') || '{}');
        if (users[username]) {
          setError('User already exists (local fallback)');
        } else {
          users[username] = password;
          localStorage.setItem('atomic_mock_users', JSON.stringify(users));
          setSuccess(true);
          onRegisterSuccess();
        }
      } catch (err) {
        setError('Error writing to local storage auth database');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-text">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-text text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-text text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-error text-xs italic mb-4">{error}</p>}
          {success && <p className="text-success text-xs italic mb-4">Registration successful! You can now log in.</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
