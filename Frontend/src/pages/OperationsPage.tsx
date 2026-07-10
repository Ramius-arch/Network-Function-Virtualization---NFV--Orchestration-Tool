import React, { useState } from 'react';
import ControlPlane from '../components/ControlPlane';
import DataPlane from '../components/DataPlane';
import LegacyIntegration from '../components/LegacyIntegration';

const OperationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'control' | 'data' | 'legacy'>('control');

    return (
        <div className="h-full animate-fade-in py-12 px-6 max-w-7xl mx-auto space-y-12">
            <div className="text-left border-b border-white/5 pb-8">
                <h1 className="text-4xl font-bold text-white font-space-grotesk tracking-tight">Active Operations</h1>
                <p className="text-xs text-slate-500 font-mono mt-2 tracking-wider">COMMAND INTERFACE FOR PLANE-LEVEL MANIPULATION AND PEERING SYNCHRONIZATION</p>
            </div>

            {/* Tab Navigation (Figma styled pill switcher) */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-white/5 rounded-2xl w-fit">
                {[
                    { id: 'control', label: 'Control Plane', icon: '🎮' },
                    { id: 'data', label: 'Data Plane', icon: '⚡' },
                    { id: 'legacy', label: 'Legacy Bridge', icon: '🔌' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all font-space-grotesk text-xs font-bold uppercase tracking-wider ${activeTab === tab.id
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'control' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-slate-950/45 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <ControlPlane />
                        </div>
                    </div>
                )}
                {activeTab === 'data' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-slate-950/45 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <DataPlane />
                        </div>
                    </div>
                )}
                {activeTab === 'legacy' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-slate-950/45 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <LegacyIntegration />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 pt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono flex justify-between">
                <span>OPERATIONAL_STATUS: NOMINAL</span>
                <span className="animate-pulse">● SIGNAL_CONNECTED</span>
                <span>SYNC_LATENCY: 4ms</span>
            </div>
        </div>
    );
};

export default OperationsPage;
