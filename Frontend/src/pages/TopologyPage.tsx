import React from 'react';
import NetworkTopology from '../components/NetworkTopology';

const TopologyPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-10 animate-fade-in py-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-8 gap-4">
                <div className="text-left">
                    <h1 className="text-4xl font-bold text-white font-space-grotesk tracking-tight">Network Topology</h1>
                    <p className="text-xs text-slate-500 font-mono mt-2 tracking-wider">REAL-TIME INFRASTRUCTURE VISUALIZATION HUB</p>
                </div>
                <div className="px-5 py-2 bg-violet-500/5 border border-violet-500/20 rounded-full text-[9px] text-violet-400 font-bold font-mono tracking-widest animate-pulse">
                    LIVE_FEED_ACTIVE
                </div>
            </div>

            <div className="flex-grow border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-slate-950/40 backdrop-blur-md relative min-h-[70vh]">
                <NetworkTopology />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Nodes', value: '12', status: 'Healthy' },
                    { label: 'Edge Links', value: '45', status: 'Stable' },
                    { label: 'Cross-Domain Latency', value: '8ms', status: 'Optimal' }
                ].map((stat, i) => (
                    <div key={i} className="p-5 border border-white/5 rounded-2xl bg-slate-950/60 backdrop-blur-sm text-left">
                        <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white font-space-grotesk">{stat.value}</p>
                        <p className="text-[10px] text-green-500/80 font-bold mt-1">Status: {stat.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopologyPage;
