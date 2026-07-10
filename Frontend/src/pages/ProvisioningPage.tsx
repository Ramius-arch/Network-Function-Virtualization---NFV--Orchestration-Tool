import React from 'react';
import ResourceAllocator from '../components/ResourceAllocator';
import VirtualizationLayer from '../components/VirtualizationLayer';

const ProvisioningPage: React.FC = () => {
    return (
        <div className="h-full max-w-7xl mx-auto animate-fade-in flex flex-col gap-12 py-12 px-6">
            <div className="text-left border-b border-white/5 pb-8">
                <h1 className="text-4xl font-bold text-white font-space-grotesk tracking-tight">System Provisioning</h1>
                <p className="text-xs text-slate-500 font-mono mt-2 tracking-wider">LIFECYCLE MANAGEMENT FOR COMPUTE, MEMORY, AND HYPERVISOR PROVISIONING LAYERS</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Resource Allocation */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/5 flex items-center justify-center text-violet-400 border border-violet-500/20 font-bold text-md shadow-lg shadow-violet-500/5">1</div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-white font-space-grotesk">Resource Allocation</h2>
                            <p className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">L1_HARDWARE_RESERVATION</p>
                        </div>
                    </div>
                    <div className="bg-slate-950/45 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <ResourceAllocator />
                    </div>
                </div>

                {/* Virtualization */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/5 flex items-center justify-center text-cyan-400 border border-cyan-500/20 font-bold text-md shadow-lg shadow-cyan-500/5">2</div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-white font-space-grotesk">Virtualization Layer</h2>
                            <p className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">L2_HYPERVISOR_PROVISIONING</p>
                        </div>
                    </div>
                    <div className="bg-slate-950/45 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <VirtualizationLayer />
                    </div>
                </div>

            </div>

            <div className="mt-8 p-8 border border-white/5 rounded-2xl bg-slate-950/45 text-center">
                <h3 className="text-md font-bold text-white mb-2 uppercase font-space-grotesk tracking-wide">Ready for Deployment?</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xl mx-auto leading-relaxed">Ensure all resource schemas are validated and authorized before committing configurations to the production control plane.</p>
                <div className="flex justify-center gap-3">
                    <div className="h-1 w-16 bg-violet-500/20 rounded-full"></div>
                    <div className="h-1 w-16 bg-cyan-500/20 rounded-full"></div>
                    <div className="h-1 w-16 bg-violet-500/20 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ProvisioningPage;
