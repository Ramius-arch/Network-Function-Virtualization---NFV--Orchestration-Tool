import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const generateMockJWT = (username: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ id: 'guest', username, exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `${header}.${payload}.mock_signature`;
};

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const handleGuestLogin = () => {
    setLoading(true);
    const mockToken = generateMockJWT('guest_user');
    console.log('Logging in as guest user from registration.');
    setTimeout(() => {
      login(mockToken);
      setLoading(false);
    }, 800);
  };

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
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div className="flex items-center my-1">
              <div className="flex-grow border-t border-text/10"></div>
              <span className="mx-4 text-[10px] text-text/30 font-mono tracking-widest">OR</span>
              <div className="flex-grow border-t border-text/10"></div>
            </div>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full border border-primary/40 text-primary hover:bg-primary/10 font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              Explore as Guest (Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
