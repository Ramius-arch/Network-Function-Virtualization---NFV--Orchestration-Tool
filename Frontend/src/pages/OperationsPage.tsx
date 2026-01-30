import React, { useState } from 'react';
import ControlPlane from '../components/ControlPlane';
import DataPlane from '../components/DataPlane';
import LegacyIntegration from '../components/LegacyIntegration';

const OperationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'control' | 'data' | 'legacy'>('control');

    return (
        <div className="h-full animate-fade-in py-16 px-6 max-w-7xl mx-auto space-y-16">
            <div>
                <h1 className="text-5xl font-bold text-primary font-orbitron mb-4 uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,200,200,0.1)]">Active_Operations</h1>
                <p className="text-text/30 font-mono text-xs tracking-[0.4em] uppercase">Command interface for plane-level manipulation and bridge synchronization.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl border border-primary/10 w-fit">
                {[
                    { id: 'control', label: 'Control Plane', icon: '🎮' },
                    { id: 'data', label: 'Data Plane', icon: '⚡' },
                    { id: 'legacy', label: 'Legacy Bridge', icon: '🔌' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 transition-all font-orbitron text-sm uppercase ${activeTab === tab.id
                            ? 'bg-primary text-background shadow-lg shadow-primary/20'
                            : 'text-text/60 hover:text-primary hover:bg-primary/5'
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
                        <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-primary/20 shadow-2xl">
                            <ControlPlane />
                        </div>
                    </div>
                )}
                {activeTab === 'data' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-primary/20 shadow-2xl">
                            <DataPlane />
                        </div>
                    </div>
                )}
                {activeTab === 'legacy' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-primary/20 shadow-2xl">
                            <LegacyIntegration />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 pt-8 border-t border-primary/10 text-xs text-text/30 font-mono flex justify-between">
                <span>OPERATIONAL_STATUS: NOMINAL</span>
                <span className="animate-pulse">● SIGNAL_CONNECTED</span>
                <span>SYNC_LATENCY: 4ms</span>
            </div>
        </div>
    );
};

export default OperationsPage;
