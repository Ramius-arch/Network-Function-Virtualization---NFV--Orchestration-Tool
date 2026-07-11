import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import ironmanBody from '../assets/ironman_body.png';
import ironmanHead from '../assets/ironman_head.png';

// Lazy-load Spline to prevent it from blocking the initial page render
const Spline = lazy(() => import('@splinetool/react-spline'));

// ─────────────────────────────────────────────────────────────────────────────
// ROBOT MODE SWITCH
// Set to 'ironman' for the premium custom Iron Man suit with head-tracking
// Set to 'spline' for the live 21st.dev Whobee WebGL scene
// ─────────────────────────────────────────────────────────────────────────────
type RobotMode = 'ironman' | 'spline';
const SPLINE_SCENE = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

const LandingPage: React.FC = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const pageRef   = useRef<HTMLDivElement>(null);
  
  // Set default mode ('ironman' or 'spline')
  const [robotMode] = useState<RobotMode>('spline');

  // ── Cursor coordinates for Iron Man head tracking ─────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const headSX = useSpring(rawX, { stiffness: 90, damping: 20 });
  const headSY = useSpring(rawY, { stiffness: 90, damping: 20 });
  const glowSX = useSpring(rawX, { stiffness: 40, damping: 18 });
  const glowSY = useSpring(rawY, { stiffness: 40, damping: 18 });

  // Helmet rotations (±25 degrees Y, ±14 degrees X)
  const headRotateY = useTransform(headSX, [0, 1], ['-25deg', '25deg']);
  const headRotateX = useTransform(headSY, [0, 1], ['14deg', '-14deg']);
  
  // Slight head displacement to enhance the 3D depth effect
  const headShiftX = useTransform(headSX, [0, 1], ['-10px', '10px']);
  const headShiftY = useTransform(headSY, [0, 1], ['-5px', '5px']);

  // Spotlight position relative to robot column
  const [sX, setSX] = useState(50);
  const [sY, setSY] = useState(70);

  useEffect(() => {
    const unsubs = [
      glowSX.on('change', v => setSX(v * 40 + 30)),
      glowSY.on('change', v => setSY(v * 30 + 50))
    ];

    const onMove = (e: MouseEvent) => {
      if (!pageRef.current) return;
      const { width, height } = pageRef.current.getBoundingClientRect();
      rawX.set(e.clientX / width);
      rawY.set(e.clientY / height);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      unsubs.forEach(fn => fn());
    };
  }, [rawX, rawY, glowSX, glowSY]);

  const handleEnter    = () => navigate(token ? '/dashboard' : '/login');
  const handleRegister = () => navigate('/register');

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#030712] text-white overflow-hidden relative flex flex-col select-none"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* 
        ═══════════════════════════════════════════════════════════════════════
        THEME BLENDING BACKGROUND
        Matches the dashboard with a subtle dot matrix and large radial glows
        ═══════════════════════════════════════════════════════════════════════
      */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 z-0" />
      
      {/* Ambient gradient meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-violet-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-cyan-950/10 blur-[150px] pointer-events-none" />

      {/* ════ NAVBAR ════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-6 max-w-screen-xl mx-auto w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center text-violet-400 text-base font-bold bg-white/5 backdrop-blur-md">
            ⌬
          </div>
          <span className="text-base font-bold tracking-widest text-white">ATOMIC</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegister}
            className="px-5 py-2 text-[11px] font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all tracking-wide cursor-pointer hidden sm:block bg-white/2"
          >
            Sign up
          </button>
          <button
            onClick={handleEnter}
            className="px-5 py-2 text-[11px] font-bold text-white bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 rounded-full transition-all tracking-widest cursor-pointer backdrop-blur-md"
          >
            {token ? 'Dashboard →' : 'Launch App →'}
          </button>
        </div>
      </motion.header>

      {/* ════ HERO ══════════════════════════════════════════════════════════ */}
      <main className="relative flex-grow grid grid-cols-1 lg:grid-cols-2 min-h-screen z-10">
        
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
            className="flex items-center gap-2 bg-violet-950/20 border border-violet-500/15 rounded-full px-3 py-1 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-violet-300 tracking-[0.25em] uppercase">
              NFV Orchestration Platform
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white">
              Deconstruct.
            </h1>
            <h2 className="text-[clamp(1.4rem,3vw,2.8rem)] font-bold leading-tight text-violet-400/60 tracking-tight">
              Liquidate the Network.
            </h2>
          </div>

          {/* Subtext */}
          <p
            className="text-base text-slate-400 max-w-[400px] leading-relaxed"
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
              className="px-8 py-4 text-white/60 hover:text-white text-[11px] font-bold tracking-widest rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer bg-white/2"
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
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: 3D Scene Column ─────────────────────────────────────── */}
        <div className="relative w-full h-full min-h-screen flex justify-center items-end overflow-visible">
          
          {/* Spotlight behind robot */}
          <div
            className="absolute inset-0 pointer-events-none transition-none"
            style={{
              background: `radial-gradient(ellipse 55% 45% at ${sX}% ${sY}%, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.03) 45%, transparent 70%)`,
              willChange: 'background',
            }}
          />

          {/* Render Mode logic */}
          {robotMode === 'spline' ? (
            <div className="relative w-full h-full">
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
              {/* Mask to overlay Spline badge */}
              <div className="absolute bottom-0 right-0 w-40 h-12 bg-[#030712] z-20 pointer-events-none" />
            </div>
          ) : (
            /* 
              ┌──────────────────────────────────────────────────────────────┐
              │  IRON MAN MODE                                               │
              │  Composited red & gold cybernetic armor suit.               │
              │  Head turns to track cursor with spring physics.             │
              └──────────────────────────────────────────────────────────────┘
            */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative w-full max-w-[440px] pb-12 flex justify-center items-end"
              style={{ perspective: '1000px' }}
            >
              
              {/* ── Helmet Layer ── */}
              <motion.div
                className="absolute z-20 pointer-events-none"
                style={{
                  // Position helmet precisely over body neck area
                  left: '50%',
                  top: '12.5%',
                  width: '39%',
                  aspectRatio: '1 / 1',
                  translateX: '-50%',

                  // Cursor-based 3D rotation & translation
                  rotateY: headRotateY,
                  rotateX: headRotateX,
                  x: headShiftX,
                  y: headShiftY,

                  // Pivot point of the neck joint
                  transformOrigin: '50% 90%',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={ironmanHead}
                  alt="Armor Helmet"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.9))',
                  }}
                  draggable={false}
                />
              </motion.div>

              {/* ── Armor Body Layer ── */}
              <img
                src={ironmanBody}
                alt="Armor Torso"
                className="relative z-10 w-full object-contain pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.95))',
                  // Small vertical alignment gap compensation
                  marginTop: '18%',
                }}
                draggable={false}
              />
            </motion.div>
          )}

          {/* Floating Status chips */}
          <div className="absolute top-32 right-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <div className="font-mono text-left">
              <div className="text-[8px] text-white/30 uppercase tracking-wider">VIM Daemon</div>
              <div className="text-[10px] font-bold text-white/75">CONNECTED_OK</div>
            </div>
          </div>

          <div className="absolute bottom-24 left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-30">
            <span className="text-violet-400 text-sm">⚡</span>
            <div className="font-mono text-left">
              <div className="text-[8px] text-white/30 uppercase tracking-wider">Control Plane</div>
              <div className="text-[10px] font-bold text-white/75">158 VNFs Active</div>
            </div>
          </div>
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
