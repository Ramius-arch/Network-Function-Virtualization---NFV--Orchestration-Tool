import React from 'react';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import { useEnvironment } from '../context/EnvironmentContext';

interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const { envMode, setEnvMode } = useEnvironment();
  let username: string | null = null;

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      username = decoded.username;
    } catch (error) {
      console.error('Failed to decode token:', error);
      logout(); // Invalidate token if decoding fails
    }
  }

  const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Topology', path: '/topology' },
    { label: 'Monitoring', path: '/monitoring' },
    { label: 'Provisioning', path: '/provisioning' },
    { label: 'Operations', path: '/operations' },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-xl border-b border-primary/20 py-3 px-8 shadow-2xl sticky top-0 z-[100]">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-12">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-2 border-primary rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
            <span className="text-2xl font-bold font-orbitron">⌬</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-orbitron text-primary tracking-widest leading-none">
              ATOMIC_ORCHESTRATOR
            </h1>
            <span className="text-[8px] text-text/40 font-mono tracking-[0.4em] uppercase">V2.0_PLATFORM</span>
          </div>
        </NavLink>

        <ul className="flex space-x-2 items-center">
          {token ? (
            <>
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }: { isActive: boolean }) =>
                      `px-4 py-2 text-[10px] uppercase tracking-widest transition-all rounded-md font-bold ${isActive
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-text/60 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="h-4 w-px bg-primary/10 mx-4 hidden md:block"></li>

              {/* Environment Switcher */}
              <li className="flex items-center bg-black/40 border border-white/5 rounded-full p-1 gap-1">
                <button
                  onClick={() => setEnvMode('live')}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-tighter rounded-full transition-all ${envMode === 'live'
                    ? 'bg-primary text-background'
                    : 'text-text/40 hover:text-text'
                    }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setEnvMode('demo')}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-tighter rounded-full transition-all ${envMode === 'demo'
                    ? 'bg-amber-500 text-black'
                    : 'text-text/40 hover:text-text'
                    }`}
                >
                  Demo
                </button>
              </li>

              <li className="h-6 w-px bg-primary/20 mx-4"></li>
              {username && (
                <li className="text-[10px] uppercase tracking-widest text-text/40 font-mono hidden lg:block">
                  OPERATOR: <span className="text-secondary">{username}</span>
                  {envMode === 'demo' && (
                    <span className="ml-2 text-amber-500/80 animate-pulse">[DEMO_MOCK_ACTIVE]</span>
                  )}
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="ml-4 border border-error/50 text-error/80 text-[10px] uppercase tracking-widest px-4 py-2 rounded font-bold hover:bg-error hover:text-white transition-all hover-scale"
                >
                  HALT_SESSION
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
