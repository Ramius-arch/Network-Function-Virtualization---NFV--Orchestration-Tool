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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-white font-space-grotesk relative overflow-hidden px-4">
      {/* Background radial gradient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="p-8 bg-slate-950/60 border border-white/5 rounded-3xl w-full max-w-md backdrop-blur-xl shadow-2xl relative z-10 text-left">
        <div className="text-center mb-8">
          <span className="text-[9px] font-bold font-mono text-violet-500 uppercase tracking-[0.4em] block mb-2">NFV Orchestration Gateway</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">Operator Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-slate-400 text-xs font-bold font-mono uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="premium-input w-full font-mono text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="operator_name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-400 text-xs font-bold font-mono uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="premium-input w-full font-mono text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
              ✕ {error}
            </p>
          )}

          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            
            <div className="flex items-center my-1">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="mx-4 text-[9px] text-slate-600 font-mono tracking-widest uppercase">OR</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full border border-white/10 hover:border-violet-500/30 text-white py-4 rounded-2xl font-bold transition-all uppercase text-xs tracking-widest bg-slate-900/50 hover:bg-violet-600/10 disabled:opacity-50"
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
