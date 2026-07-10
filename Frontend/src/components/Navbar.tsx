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
    { label: 'Overview', path: '/dashboard' },
    { label: 'Topology', path: '/topology' },
    { label: 'Monitoring', path: '/monitoring' },
    { label: 'Provisioning', path: '/provisioning' },
    { label: 'Operations', path: '/operations' },
  ];

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-8 shadow-2xl sticky top-0 z-[100] font-space-grotesk">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-12">
        
        {/* Brand logo */}
        <NavLink to={token ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-violet-500/30 rounded-xl flex items-center justify-center text-violet-400 bg-violet-500/5 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-violet-500/5">
            <span className="text-xl font-bold font-space-grotesk">⌬</span>
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-md font-bold text-white tracking-widest leading-none">
              ATOMIC
            </h1>
            <span className="text-[8px] text-slate-500 font-mono tracking-[0.3em] uppercase mt-1">ORCH_PLANE v3.5</span>
          </div>
        </NavLink>

        {/* Nav list */}
        <ul className="flex space-x-2 items-center">
          {token ? (
            <>
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }: { isActive: boolean }) =>
                      `px-4 py-2 text-xs transition-all rounded-xl font-medium tracking-wide ${isActive
                        ? 'text-white bg-slate-900 border border-white/10 shadow-inner'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="h-4 w-px bg-white/10 mx-4 hidden md:block"></li>

              {/* Environment Switcher (Figma style) */}
              <li className="flex items-center bg-slate-900 border border-white/5 rounded-full p-1 gap-1">
                <button
                  onClick={() => setEnvMode('live')}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wide rounded-full transition-all ${envMode === 'live'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-200'
                    }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setEnvMode('demo')}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wide rounded-full transition-all ${envMode === 'demo'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-500 hover:text-slate-200'
                    }`}
                >
                  Demo
                </button>
              </li>

              <li className="h-6 w-px bg-white/10 mx-4"></li>
              
              {username && (
                <li className="text-[10px] uppercase tracking-wider text-slate-500 font-mono hidden lg:block text-left">
                  OPERATOR: <span className="text-slate-300">{username}</span>
                  {envMode === 'demo' && (
                    <span className="ml-2 text-amber-500/80 animate-pulse">[DEMO_MOCK_ACTIVE]</span>
                  )}
                </li>
              )}
              
              <li>
                <button
                  onClick={logout}
                  className="ml-4 border border-red-500/20 text-red-400/90 text-xs px-4 py-2 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all hover-scale shadow-lg shadow-red-600/5"
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
