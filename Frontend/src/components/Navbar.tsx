import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
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
    { label: 'Landing Page', path: '/' },
    { label: 'Overview', path: '/dashboard' },
    { label: 'Topology', path: '/topology' },
    { label: 'Monitoring', path: '/monitoring' },
    { label: 'Provisioning', path: '/provisioning' },
    { label: 'Operations', path: '/operations' },
  ];

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-8 shadow-2xl sticky top-0 z-[100] font-space-grotesk relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-12">
        
        {/* Brand logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
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

        {/* ── DESKTOP NAVIGATION (Hidden on mobile) ────────────────────────── */}
        {token && (
          <ul className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `px-3 py-2 text-xs transition-all rounded-xl font-medium tracking-wide ${isActive
                      ? 'text-white bg-slate-900 border border-white/10 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="h-4 w-px bg-white/10 mx-3"></li>

            {/* Environment Switcher */}
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

            <li className="h-6 w-px bg-white/10 mx-3"></li>
            
            {username && (
              <li className="text-[10px] uppercase tracking-wider text-slate-500 font-mono hidden lg:block text-left">
                OPERATOR: <span className="text-slate-300">{username}</span>
                {envMode === 'demo' && (
                  <span className="ml-2 text-amber-500/80 animate-pulse">[DEMO_MOCK]</span>
                )}
              </li>
            )}
            
            <li>
              <button
                onClick={logout}
                className="ml-3 border border-red-500/20 text-red-400/90 text-xs px-4 py-2 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all hover-scale shadow-lg shadow-red-600/5 cursor-pointer"
              >
                HALT_SESSION
              </button>
            </li>
          </ul>
        )}

        {/* ── MOBILE MENU TOGGLE BUTTON (Hidden on desktop) ───────────────── */}
        {token && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden text-slate-400 hover:text-white transition-colors p-2 text-xl cursor-pointer"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* ── MOBILE EXPANDED DROPDOWN ─────────────────────────────────────── */}
      {token && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-950/95 border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in z-[200] shadow-2xl md:hidden text-left">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block px-4 py-3 text-xs rounded-xl font-medium transition-all ${isActive
                      ? 'text-white bg-slate-900 border border-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="h-px bg-white/5 my-2"></div>

          {/* Environment switcher */}
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">HYPERVISOR_MODE:</span>
            <div className="flex items-center bg-slate-900 border border-white/5 rounded-full p-1 gap-1">
              <button
                onClick={() => setEnvMode('live')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wide rounded-full transition-all ${envMode === 'live'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500'
                  }`}
              >
                Live
              </button>
              <button
                onClick={() => setEnvMode('demo')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wide rounded-full transition-all ${envMode === 'demo'
                  ? 'bg-amber-500 text-black'
                  : 'text-slate-500'
                  }`}
              >
                Demo
              </button>
            </div>
          </div>

          {username && (
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono px-2">
              OPERATOR: <span className="text-slate-300">{username}</span>
              {envMode === 'demo' && (
                <span className="ml-2 text-amber-500 font-bold">[DEMO]</span>
              )}
            </div>
          )}

          <div className="h-px bg-white/5 my-2"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full border border-red-500/20 text-red-400/90 text-xs py-3 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/5 cursor-pointer text-center"
          >
            HALT_OPERATIONAL_SESSION
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
