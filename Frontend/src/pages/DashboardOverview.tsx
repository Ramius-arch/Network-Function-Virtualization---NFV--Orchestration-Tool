import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEnvironment } from '../context/EnvironmentContext';

const DashboardOverview: React.FC = () => {
    const { isDemo } = useEnvironment();
    const [statsOpen, setStatsOpen] = React.useState(true);

    const sections = [
        {
            title: 'Topology HUB',
            desc: 'Visual hub for all network nodes and inter-domain connections.',
            path: '/topology',
            icon: '⌬',
            color: 'primary'
        },
        {
            title: 'Telemetry Stream',
            desc: 'Deep analytics and real-time monitoring of all provisioned assets.',
            path: '/monitoring',
            icon: '📈',
            color: 'secondary'
        },
        {
            title: 'Provisioning',
            desc: 'Lifecycle management of compute resources and virtualization layers.',
            path: '/provisioning',
            icon: '⚙️',
            color: 'primary'
        },
        {
            title: 'Active Operations',
            desc: 'Real-time manipulation of control and data planes.',
            path: '/operations',
            icon: '⚡',
            color: 'accent'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-16 animate-fade-in space-y-20">
            <div className="text-center">
                <h1 className="text-7xl font-bold font-orbitron tracking-tighter mb-6 text-primary drop-shadow-[0_0_15px_rgba(0,200,200,0.2)]">
                    ATOMIC_PLATFORM
                </h1>
                <p className="text-xl text-text/40 max-w-2xl mx-auto font-light leading-relaxed">
                    {isDemo
                        ? 'Simulated NFV Orchestration and Performance Management Sandbox.'
                        : 'Real-time NFV Orchestration and Production Resource Management.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {sections.map((section, i) => (
                    <NavLink
                        key={i}
                        to={section.path}
                        className="group relative p-10 rounded-[2.5rem] border border-primary/10 bg-black/40 hover:border-primary/40 focus-contrast transition-all overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="text-5xl mb-8 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{section.icon}</div>
                            <h2 className="text-2xl font-bold font-orbitron mb-3 group-hover:text-primary transition-colors uppercase tracking-widest">{section.title}</h2>
                            <p className="text-text/40 text-sm leading-relaxed max-w-[90%]">{section.desc}</p>
                            <div className="mt-10 flex items-center text-[10px] font-bold font-mono text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 tracking-[0.3em]">
                                ACCESS_DOMAIN <span className="ml-3">→</span>
                            </div>
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    </NavLink>
                ))}
            </div>

            {/* Quick Stats Banner */}
            <div className="space-y-6">
                <button
                    onClick={() => setStatsOpen(!statsOpen)}
                    className={`flex items-center gap-4 text-xs font-bold font-mono transition-colors uppercase tracking-[0.4em] bg-transparent border-none p-0 ${isDemo ? 'text-amber-500/60 hover:text-amber-400' : 'text-primary/40 hover:text-primary'
                        }`}
                >
                    <span className={`transition-transform duration-300 ${statsOpen ? 'rotate-90' : ''}`}>▶</span>
                    {isDemo ? 'SIMULATED_HEALTH_METRICS' : 'SYSTEM_HEALTH_OVERVIEW'}
                </button>

                <div className={`collapsible-container ${statsOpen ? 'open' : ''}`}>
                    <div className="collapsible-inner">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 border border-primary/5 rounded-[2rem] bg-primary/[0.02] backdrop-blur-sm">
                            {[
                                { label: 'Cloud Clusters', value: '4', trend: 'STABLE' },
                                { label: 'Active VNFs', value: '158', trend: '+12' },
                                { label: 'Success Rate', value: '99.9%', trend: 'NOMINAL' },
                                { label: 'Avg Latency', value: '12ms', trend: '-2ms' }
                            ].map((stat, i) => (
                                <div key={i} className="text-center space-y-2 group">
                                    <p className="text-[9px] text-text/30 font-mono uppercase tracking-widest group-hover:text-primary/60 transition-colors">{stat.label}</p>
                                    <p className="text-4xl font-bold text-text group-hover:scale-105 transition-transform duration-500">{stat.value}</p>
                                    <p className="text-[8px] font-mono text-secondary/40">{stat.trend}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
