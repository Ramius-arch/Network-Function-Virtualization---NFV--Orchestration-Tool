import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import robotHero from '../assets/robot_hero.png';

const LandingPage: React.FC = () => {
  const { token }      = useAuth();
  const navigate       = useNavigate();
  const pageRef        = useRef<HTMLDivElement>(null);
  const robotColRef    = useRef<HTMLDivElement>(null);

  // ── Raw cursor position (normalised 0‥1 relative to full page) ──────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // ── Spring-smoothed values ───────────────────────────────────────────────
  const smoothX = useSpring(rawX, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 55, damping: 20 });

  // ── Eye pupil offset (small movement, ±6px) ─────────────────────────────
  const pupilDX = useTransform(smoothX, [0, 1], [-6, 6]);
  const pupilDY = useTransform(smoothY, [0, 1], [-4, 4]);

  // ── Spotlight position relative to robot column (0‥100%) ────────────────
  // We map cursor X over the whole page to 20‥80% inside the column,
  // and cursor Y straight to vertical %.
  const spotX = useTransform(smoothX, [0, 1], [30, 70]);  // % inside column
  const spotY = useTransform(smoothY, [0, 1], [55, 90]);  // % inside column (stays low, below robot torso)

  // Local state for JSX usage (Motion values need .get() or subscribers)
  const [pDX, setPDX] = useState(0);
  const [pDY, setPDY] = useState(0);
  const [sX,  setSX]  = useState(50);
  const [sY,  setSY]  = useState(75);

  useEffect(() => {
    const u1 = pupilDX.on('change', v => setPDX(v));
    const u2 = pupilDY.on('change', v => setPDY(v));
    const u3 = spotX.on('change',   v => setSX(v));
    const u4 = spotY.on('change',   v => setSY(v));

    const onMove = (e: MouseEvent) => {
      if (!pageRef.current) return;
      const { width, height } = pageRef.current.getBoundingClientRect();
      rawX.set(e.clientX / width);
      rawY.set(e.clientY / height);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      u1(); u2(); u3(); u4();
    };
  }, [rawX, rawY, pupilDX, pupilDY, spotX, spotY]);

  const handleEnter    = () => navigate(token ? '/dashboard' : '/login');
  const handleRegister = () => navigate('/register');

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col select-none"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >

      {/* ═══════════════════════════════════
          NAVBAR
      ═══════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex justify-between items-center px-10 py-6 max-w-screen-xl mx-auto w-full"
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

      {/* ═══════════════════════════════════
          HERO BODY
      ═══════════════════════════════════ */}
      <main className="flex-grow flex items-center relative z-10 px-10 max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full min-h-[84vh]">

          {/* ── LEFT: Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-start space-y-8 z-20"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-violet-400 tracking-[0.3em] uppercase">
                NFV Orchestration Platform
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white">
                Deconstruct.
              </h1>
              <h2 className="text-[clamp(1.4rem,3.5vw,2.8rem)] font-bold leading-tight text-white/35 tracking-tight">
                Liquidate the Network.
              </h2>
            </div>

            {/* Subtext */}
            <p
              className="text-base text-white/40 max-w-[420px] leading-relaxed"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Decouple network software from physical hardware. Spin up virtual firewalls, routers, and load balancers on demand — from a single programmable control plane.
            </p>

            {/* CTAs */}
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
            <div className="flex gap-10 pt-4 border-t border-white/5 w-full">
              {[
                { value: '158',    label: 'Active VNFs'  },
                { value: '99.99%', label: 'Uptime'       },
                { value: '12ms',   label: 'Avg Latency'  },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-white">{s.value}</span>
                  <span className="text-[9px] text-white/25 font-mono uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Robot scene (fixed / grounded) ── */}
          <div
            ref={robotColRef}
            className="relative flex justify-center items-end min-h-[600px] overflow-hidden"
          >
            {/* 
              ┌─────────────────────────────────────────┐
              │  CURSOR-TRACKING WHITE SPOTLIGHT GLOW    │
              │  Stays behind robot, follows mouse       │
              └─────────────────────────────────────────┘
            */}
            <div
              className="absolute inset-0 pointer-events-none transition-none"
              style={{
                background: `radial-gradient(ellipse 55% 45% at ${sX}% ${sY}%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`,
                willChange: 'background',
              }}
            />

            {/* ── Robot image — FIXED, grounded to bottom ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative z-10 w-full max-w-[460px]"
              /* No transform, no translate — robot is anchored */
            >
              <img
                src={robotHero}
                alt="Atomic NFV Robot"
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.95))' }}
                draggable={false}
              />

              {/*
                ┌──────────────────────────────────────────┐
                │  EYE / HEAD TRACKING LAYER               │
                │  SVG overlay precisely over the robot's  │
                │  helmet visor area.                      │
                │                                          │
                │  Robot eye region is approximately:      │
                │  Left eye:  40–45% X, 14–18% Y of image │
                │  Right eye: 55–60% X, 14–18% Y of image │
                └──────────────────────────────────────────┘
              */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 460 600"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Glow filter for pupils */}
                  <filter id="eye-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="eye-outer-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                    </feMerge>
                  </filter>
                </defs>

                {/* ── Left eye ── */}
                {/* Outer ambient glow (large, soft, does not move) */}
                <ellipse
                  cx={187}
                  cy={96}
                  rx={16}
                  ry={10}
                  fill="rgba(220,240,255,0.08)"
                  filter="url(#eye-outer-glow)"
                />
                {/* LED dot-grid texture (static, represents LED matrix face) */}
                {[[-4,-2],[-4,1],[-4,4],[0,-2],[0,1],[0,4],[4,-2],[4,1],[4,4]].map(([dx,dy], i) => (
                  <circle
                    key={`le${i}`}
                    cx={187 + dx}
                    cy={96  + dy}
                    r={1.1}
                    fill="rgba(255,255,255,0.3)"
                  />
                ))}
                {/* Bright moving pupil — tracks cursor */}
                <circle
                  cx={187 + pDX}
                  cy={96  + pDY}
                  r={5}
                  fill="rgba(255,255,255,0.85)"
                  filter="url(#eye-glow)"
                />
                {/* Inner bright core */}
                <circle
                  cx={187 + pDX}
                  cy={96  + pDY}
                  r={2.5}
                  fill="white"
                />

                {/* ── Right eye ── */}
                <ellipse
                  cx={273}
                  cy={96}
                  rx={16}
                  ry={10}
                  fill="rgba(220,240,255,0.08)"
                  filter="url(#eye-outer-glow)"
                />
                {[[-4,-2],[-4,1],[-4,4],[0,-2],[0,1],[0,4],[4,-2],[4,1],[4,4]].map(([dx,dy], i) => (
                  <circle
                    key={`re${i}`}
                    cx={273 + dx}
                    cy={96  + dy}
                    r={1.1}
                    fill="rgba(255,255,255,0.3)"
                  />
                ))}
                <circle
                  cx={273 + pDX}
                  cy={96  + pDY}
                  r={5}
                  fill="rgba(255,255,255,0.85)"
                  filter="url(#eye-glow)"
                />
                <circle
                  cx={273 + pDX}
                  cy={96  + pDY}
                  r={2.5}
                  fill="white"
                />
              </svg>
            </motion.div>

            {/* Status chips — anchored, not floating */}
            <div className="absolute top-8 right-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              <div className="font-mono text-left">
                <div className="text-[8px] text-white/30 uppercase tracking-wider">VIM Daemon</div>
                <div className="text-[10px] font-bold text-white/75">CONNECTED_OK</div>
              </div>
            </div>

            <div className="absolute bottom-8 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-20">
              <span className="text-violet-400 text-sm">⚡</span>
              <div className="font-mono text-left">
                <div className="text-[8px] text-white/30 uppercase tracking-wider">Control Plane</div>
                <div className="text-[10px] font-bold text-white/75">158 VNFs Active</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ═══════════════════════════════════
          FOOTER
      ═══════════════════════════════════ */}
      <footer className="relative z-10 py-5 border-t border-white/5 text-center">
        <p className="text-[9px] text-white/15 font-mono tracking-widest uppercase">
          ATOMIC PLATFORM // CARRIER_GRADE_NFV // © 2026 RAMIUS_ARCH
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
