import React from 'react';
import Monitoring from '../components/Monitoring';

const MonitoringPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-6 md:gap-12 animate-fade-in max-w-7xl mx-auto py-6 md:py-12 px-3 md:px-6">
            <div className="flex flex-col gap-4 border-b border-white/5 pb-8 text-left">
                <h1 className="text-4xl font-bold text-white font-space-grotesk tracking-tight">Telemetry Stream</h1>
                <p className="text-sm text-slate-400 max-w-3xl leading-relaxed mt-2 font-light">
                    High-resolution performance tracking and predictive analytics for all virtualized network functions across the global infrastructure mesh.
                </p>
            </div>

            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-3 md:p-6 shadow-2xl">
                <Monitoring />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-white/5 rounded-2xl bg-slate-950/60 text-left">
                    <h3 className="text-lg font-bold text-white font-space-grotesk mb-4 uppercase tracking-wider">Analytics_Log</h3>
                    <div className="space-y-3 font-mono text-xs text-slate-400 overflow-y-auto max-h-48 custom-scrollbar">
                        <p><span className="text-violet-400">[INFO]</span> Baseline traffic pattern identified for Domain-A</p>
                        <p><span className="text-green-400">[OK]</span> Metric synchronization complete across all clusters</p>
                        <p><span className="text-cyan-400">[WARN]</span> Slight latency spike detected in North-Region-Bridge</p>
                        <p><span className="text-violet-400">[INFO]</span> New monitoring agent heartbeats received (x12)</p>
                        <p><span className="text-green-400">[OK]</span> Power efficiency mode engaged for idle VNF nodes</p>
                    </div>
                </div>
                <div className="p-6 border border-white/5 rounded-2xl bg-slate-950/60 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-400 mb-4 bg-violet-500/5 animate-pulse">
                        <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-space-grotesk mb-1">Health Score: 98%</h3>
                    <p className="text-xs text-slate-500">Across all provisioned cross-region virtual infrastructure.</p>
                </div>
            </div>
        </div>
    );
};

export default MonitoringPage;
