import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const generateMockJWT = (username: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ id: 'guest', username, exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `${header}.${payload}.mock_signature`;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let response;
    let data;
    let apiFailed = false;

    try {
      response = await fetch('/api/auth/login', {
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
          onLoginSuccess(data.token);
          setLoading(false);
          return;
        } else {
          setError(data.message || 'Login failed');
          setLoading(false);
          return;
        }
      }
    } catch (err: unknown) {
      apiFailed = true;
    }

    if (apiFailed) {
      console.warn('API unreachable or offline. Falling back to browser-local login for showcase.');
      try {
        const users = JSON.parse(localStorage.getItem('atomic_mock_users') || '{}');
        if (users[username] && users[username] === password) {
          const mockToken = generateMockJWT(username);
          onLoginSuccess(mockToken);
        } else {
          setError('Invalid credentials (local fallback) or user not registered locally');
        }
      } catch (err) {
        setError('Error reading local storage auth database');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    const mockToken = generateMockJWT('guest_user');
    
    console.log('Logging in as guest user for showcase.');
    
    setTimeout(() => {
      onLoginSuccess(mockToken);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-text">Login</h2>
        <form onSubmit={handleLogin}>
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
          <div className="flex flex-col gap-4 mt-6">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
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

export default Login;
