import React from 'react';
import Monitoring from '../components/Monitoring';

const MonitoringPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-16 animate-fade-in max-w-7xl mx-auto py-16 px-4">
            <div className="flex flex-col gap-4 border-b border-primary/10 pb-10">
                <h1 className="text-6xl font-bold text-primary font-orbitron tracking-tight drop-shadow-[0_0_15px_rgba(0,200,200,0.1)]">TELEMETRY_STREAM</h1>
                <p className="text-lg text-text/30 font-light max-w-3xl leading-relaxed">
                    High-resolution performance tracking and predictive analytics for all virtualized network functions across the global infrastructure mesh.
                </p>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 shadow-2xl shadow-primary/5 min-h-[700px]">
                <Monitoring />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-primary/10 rounded-2xl bg-black/40">
                    <h3 className="text-xl font-bold text-secondary font-orbitron mb-4 uppercase">Analytics_Log</h3>
                    <div className="space-y-3 font-mono text-xs text-text/60 overflow-y-auto max-h-48 custom-scrollbar">
                        <p><span className="text-primary">[INFO]</span> Baseline traffic pattern identified for Domain-A</p>
                        <p><span className="text-secondary">[OK]</span> Metric synchronization complete across all clusters</p>
                        <p><span className="text-accent">[WARN]</span> Slight latency spike detected in North-Region-Bridge</p>
                        <p><span className="text-primary">[INFO]</span> New monitoring agent heartbeats received (x12)</p>
                        <p><span className="text-secondary">[OK]</span> Power efficiency mode engaged for idle VNF nodes</p>
                    </div>
                </div>
                <div className="p-6 border border-primary/10 rounded-2xl bg-black/40 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 border-2 border-secondary/50 rounded-full flex items-center justify-center text-secondary mb-4 animate-spin-slow">
                        <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">Health Score: 98%</h3>
                    <p className="text-sm text-text/40">Across all provisioned cross-region virtual infrastructure.</p>
                </div>
            </div>
        </div>
    );
};

export default MonitoringPage;
