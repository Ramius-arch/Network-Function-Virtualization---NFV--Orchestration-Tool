import React from 'react';
import NetworkTopology from '../components/NetworkTopology';

const TopologyPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-10 animate-fade-in py-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-end border-b border-primary/10 pb-8 px-2">
                <div>
                    <h1 className="text-5xl font-bold text-primary font-orbitron tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,200,200,0.1)]">NETWORK_TOPOLOGY</h1>
                    <p className="text-xs text-text/30 font-mono uppercase mt-2 tracking-widest">Real-time Infrastructure Visualization HUB</p>
                </div>
                <div className="px-6 py-2 bg-primary/5 border border-primary/20 rounded-full text-[10px] text-primary font-bold font-mono tracking-widest animate-pulse">
                    LIVE_FEED_ACTIVE
                </div>
            </div>

            <div className="flex-grow border border-primary/20 rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-md relative min-h-[70vh]">
                <NetworkTopology />
            </div>

            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: 'Active Nodes', value: '12', status: 'Healthy' },
                    { label: 'Edge Links', value: '45', status: 'Stable' },
                    { label: 'Cross-Domain Latency', value: '8ms', status: 'Optimal' }
                ].map((stat, i) => (
                    <div key={i} className="p-4 border border-primary/10 rounded-xl bg-black/30 backdrop-blur-sm">
                        <p className="text-xs text-text/40 font-mono uppercase mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        <p className="text-[10px] text-secondary mt-1">Status: {stat.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopologyPage;
