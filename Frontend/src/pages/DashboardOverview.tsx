import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEnvironment } from '../context/EnvironmentContext';

const DashboardOverview: React.FC = () => {
  const { envMode } = useEnvironment();
  const [pulseCount, setPulseCount] = useState(0);

  // Constants to animate the metrics values
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount(prev => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-fade-in space-y-16">
      
      {/* Title Panel */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-8 gap-6">
        <div>
          <span className="text-[10px] font-bold font-mono text-violet-500 uppercase tracking-[0.4em] block mb-2">Orchestration control plane</span>
          <h1 className="text-4xl md:text-5xl font-bold font-space-grotesk tracking-tight text-white leading-tight">
            ATOMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">OPERATOR_DECK</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-2 font-light">
            {envMode === 'demo'
              ? 'Demo Sandbox: Telemetry and VNF Provisioning simulated on mock clusters.'
              : 'Production Console: Active VNF lifecycles synchronizing with local docker daemon.'}
          </p>
        </div>

        {/* Global connection status badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-xl">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <div className="text-left font-mono">
            <p className="text-[9px] text-slate-500 leading-none">VIM_DAEMON</p>
            <p className="text-[10px] text-slate-200 font-bold leading-none mt-1">CONNECTED_OK</p>
          </div>
        </div>
      </div>

      {/* premium 21st.dev style Bento Grid */}
      <div className="bento-grid">
        
        {/* Card 1: Network Topology Console (Span 2x2) */}
        <NavLink 
          to="/topology" 
          className="bento-card border-beam md:col-span-2 md:row-span-2 group cursor-pointer"
        >
          <div className="glow-dot-pattern" />
          <div className="card-glow-blob" />
          
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold font-mono text-cyan-500 uppercase tracking-widest">Live Topology Map</span>
                <h3 className="text-2xl font-bold font-space-grotesk text-white mt-1 group-hover:text-cyan-400 transition-colors">Topology Hub</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">Graph view connecting virtualization layers, access gateways, and security groups in real-time.</p>
              </div>
              <div className="text-2xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">⌬</div>
            </div>

            {/* Interactive Vector mini map simulation */}
            <div className="h-44 w-full bg-slate-950/70 border border-white/5 rounded-2xl my-6 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full opacity-60" viewBox="0 0 400 180">
                {/* Node connections */}
                <path d="M 80 90 Q 200 40 320 90 M 80 90 Q 200 140 320 90 M 200 90 L 80 90 M 200 90 L 320 90" fill="none" stroke="#334155" strokeWidth="2" />
                <path d="M 80 90 Q 200 40 320 90" fill="none" stroke="#0891B2" strokeWidth="2" className="optical-track" />
                
                {/* Nodes */}
                <circle cx="80" cy="90" r="18" fill="#1E293B" stroke="#0891B2" strokeWidth="2" />
                <circle cx="80" cy="90" r="4" fill="#0891B2" />
                <text x="80" y="125" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">INGRESS_GATE</text>

                <circle cx="200" cy="90" r="22" fill="#1E293B" stroke="#7C3AED" strokeWidth="2" />
                <circle cx="200" cy="90" r="6" fill="#7C3AED" className="animate-ping" />
                <circle cx="200" cy="90" r="4" fill="#7C3AED" />
                <text x="200" y="125" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">VNF_CORE_CPU</text>

                <circle cx="320" cy="90" r="18" fill="#1E293B" stroke="#0891B2" strokeWidth="2" />
                <circle cx="320" cy="90" r="4" fill="#0891B2" />
                <text x="320" y="125" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">EGRESS_GATE</text>
              </svg>
            </div>

            <div className="flex items-center text-[10px] font-bold font-mono text-cyan-500 group-hover:translate-x-2 transition-transform tracking-widest mt-auto">
              ACCESS TOPOLOGY MAP <span className="ml-2">→</span>
            </div>
          </div>
        </NavLink>

        {/* Card 2: Telemetry metrics (Span 1x1) */}
        <NavLink 
          to="/monitoring" 
          className="bento-card border-beam group cursor-pointer"
        >
          <div className="glow-dot-pattern" />
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold font-mono text-violet-500 uppercase tracking-widest">System metrics</span>
                <h3 className="text-lg font-bold font-space-grotesk text-white mt-1 group-hover:text-violet-400 transition-colors">Telemetry Stream</h3>
              </div>
              <span className="text-xl opacity-40">📈</span>
            </div>
            
            {/* Live moving graph wave */}
            <div className="h-16 w-full flex items-end overflow-hidden my-4">
              <svg viewBox="0 0 120 40" className="w-full h-full">
                <path 
                  d={`M 0 ${25 + Math.sin(pulseCount) * 5} Q 20 ${10 - Math.sin(pulseCount) * 6} 40 ${20 + Math.sin(pulseCount) * 4} T 80 ${15 - Math.sin(pulseCount) * 8} T 120 ${20 + Math.sin(pulseCount) * 5}`} 
                  fill="none" 
                  stroke="#7C3AED" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d={`M 0 ${25 + Math.sin(pulseCount) * 5} Q 20 ${10 - Math.sin(pulseCount) * 6} 40 ${20 + Math.sin(pulseCount) * 4} T 80 ${15 - Math.sin(pulseCount) * 8} T 120 ${20 + Math.sin(pulseCount) * 5} L 120 40 L 0 40 Z`} 
                  fill="url(#grad)" 
                  opacity="0.1" 
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-[10px] font-bold font-mono text-violet-500 group-hover:translate-x-2 transition-transform tracking-widest mt-auto">
              OPEN Telemetry <span className="ml-2">→</span>
            </div>
          </div>
        </NavLink>

        {/* Card 3: Provisioning Engine (Span 1x1) */}
        <NavLink 
          to="/provisioning" 
          className="bento-card border-beam group cursor-pointer"
        >
          <div className="glow-dot-pattern" />
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold font-mono text-cyan-500 uppercase tracking-widest">Hardware provisioner</span>
                <h3 className="text-lg font-bold font-space-grotesk text-white mt-1 group-hover:text-cyan-400 transition-colors">VIM Deployer</h3>
              </div>
              <span className="text-xl opacity-40">⚙️</span>
            </div>

            {/* Micro details */}
            <div className="space-y-2 my-4 font-mono text-[9px] text-slate-500">
              <div className="flex justify-between">
                <span>DOCKER_VIM:</span>
                <span className="text-green-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between">
                <span>CPU_THREADS:</span>
                <span className="text-slate-300">12 / 16 ALLOCATED</span>
              </div>
              <div className="flex justify-between">
                <span>RAM_LEASED:</span>
                <span className="text-slate-300">8.0 GB</span>
              </div>
            </div>

            <div className="text-[10px] font-bold font-mono text-cyan-500 group-hover:translate-x-2 transition-transform tracking-widest mt-auto">
              PROVISION ASSETS <span className="ml-2">→</span>
            </div>
          </div>
        </NavLink>

        {/* Card 4: Operations Plane (Span 1x1) */}
        <NavLink 
          to="/operations" 
          className="bento-card border-beam group cursor-pointer"
        >
          <div className="glow-dot-pattern" />
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold font-mono text-violet-500 uppercase tracking-widest">Active routing</span>
                <h3 className="text-lg font-bold font-space-grotesk text-white mt-1 group-hover:text-violet-400 transition-colors">Plane Control</h3>
              </div>
              <span className="text-xl opacity-40">⚡</span>
            </div>

            {/* Telemetry log preview */}
            <div className="bg-slate-950/70 border border-white/5 p-3 rounded-xl font-mono text-[8px] text-slate-400 space-y-1 my-4">
              <p className="text-green-500/80">&gt; routing_table commit ok</p>
              <p className="text-slate-500">&gt; acl_rule: block source 10.0.8.2</p>
              <p className="text-cyan-500">&gt; links synched cleanly</p>
            </div>

            <div className="text-[10px] font-bold font-mono text-violet-500 group-hover:translate-x-2 transition-transform tracking-widest mt-auto">
              MANAGE ROUTING <span className="ml-2">→</span>
            </div>
          </div>
        </NavLink>

        {/* Card 5: Infrastructure health status (Span 3x1) */}
        <div className="bento-card md:col-span-3 min-h-[140px] flex-row items-center justify-between gap-8">
          <div className="glow-dot-pattern" />
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {[
              { label: 'Cluster Clusters', value: '4 nodes', trend: 'ACTIVE' },
              { label: 'Total VNFs active', value: '158 running', trend: '+12 updates' },
              { label: 'VIM Success Rate', value: '99.99%', trend: 'HEALTHY' },
              { label: 'Internal Latency', value: '11.8ms', trend: 'OPTIMIZED' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1 font-mono text-left">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block">{stat.label}</span>
                <span className="text-2xl font-bold font-space-grotesk text-white block">{stat.value}</span>
                <span className="text-[8px] font-bold text-green-500/80">{stat.trend}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
