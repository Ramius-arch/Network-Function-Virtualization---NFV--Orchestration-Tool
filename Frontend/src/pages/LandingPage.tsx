import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Lazy-load Spline to prevent it from blocking the initial page render
const Spline = lazy(() => import('@splinetool/react-spline'));

// ─────────────────────────────────────────────────────────────────────────────
// Verified working 21st.dev Interactive 3D Robot Scene (Whobee)
// Natively tracks cursor movements inside WebGL with premium physics
// ─────────────────────────────────────────────────────────────────────────────
const SPLINE_SCENE = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

const LandingPage: React.FC = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const handleEnter    = () => navigate(token ? '/dashboard' : '/login');
  const handleRegister = () => navigate('/register');

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col select-none"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* ════ NAVBAR ════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-6 max-w-screen-xl mx-auto w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-white/15 rounded-lg flex items-center justify-center text-white/70 text-base font-bold bg-white/5">
            ⌬
          </div>
          <span className="text-base font-bold tracking-widest text-white">ATOMIC</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegister}
            className="px-5 py-2 text-[11px] font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-full transition-all tracking-wide cursor-pointer hidden sm:block"
          >
            Sign up
          </button>
          <button
            onClick={handleEnter}
            className="px-5 py-2 text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all tracking-widest cursor-pointer"
          >
            {token ? 'Dashboard →' : 'Launch App →'}
          </button>
        </div>
      </motion.header>

      {/* ════ HERO ══════════════════════════════════════════════════════════ */}
      <main className="relative flex-grow grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* ── LEFT: Copy ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center items-start px-10 lg:px-16 pt-28 pb-16 space-y-8"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-violet-400 tracking-[0.3em] uppercase">
              NFV Orchestration Platform
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white">
              Deconstruct.
            </h1>
            <h2 className="text-[clamp(1.4rem,3vw,2.8rem)] font-bold leading-tight text-white/35 tracking-tight">
              Liquidate the Network.
            </h2>
          </div>

          {/* Subtext */}
          <p
            className="text-base text-white/40 max-w-[400px] leading-relaxed"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Decouple network software from physical hardware. Spin up virtual firewalls, routers, and load balancers on demand — from a single programmable control plane.
          </p>

          {/* CTA group */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button
              onClick={handleEnter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-widest rounded-2xl shadow-lg hover:bg-white/90 transition-colors cursor-pointer"
            >
              ENTER PLATFORM
            </motion.button>
            <motion.button
              onClick={handleRegister}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 text-white/50 hover:text-white text-[11px] font-bold tracking-widest rounded-2xl border border-white/10 hover:border-white/25 transition-all cursor-pointer"
            >
              CREATE ACCOUNT
            </motion.button>
          </div>

          {/* Stat strip */}
          <div className="flex gap-10 pt-4 border-t border-white/5 w-full max-w-sm">
            {[
              { value: '158',    label: 'Active VNFs' },
              { value: '99.99%', label: 'Uptime'      },
              { value: '12ms',   label: 'Avg Latency' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-white">{s.value}</span>
                <span className="text-[9px] text-white/25 font-mono uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Live Spline 3D Robot ────────────────────────────────── */}
        <div className="relative w-full h-full min-h-screen">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
                  <span className="text-[10px] text-white/20 font-mono tracking-widest">LOADING 3D SCENE</span>
                </div>
              </div>
            }
          >
            <Spline
              scene={SPLINE_SCENE}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
              }}
            />
          </Suspense>

          {/* Mask to overlay Spline's logo logo badge at bottom-right */}
          <div className="absolute bottom-0 right-0 w-40 h-12 bg-black z-20 pointer-events-none" />
        </div>

      </main>

      {/* ════ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 py-4 text-left px-10">
        <p className="text-[9px] text-white/15 font-mono tracking-widest uppercase">
          ATOMIC PLATFORM // CARRIER_GRADE_NFV // © 2026 RAMIUS_ARCH
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
