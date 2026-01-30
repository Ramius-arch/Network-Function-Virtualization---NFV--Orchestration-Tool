import React from 'react';
import ResourceAllocator from '../components/ResourceAllocator';
import VirtualizationLayer from '../components/VirtualizationLayer';

const ProvisioningPage: React.FC = () => {
    return (
        <div className="h-full max-w-6xl mx-auto animate-fade-in flex flex-col gap-20 py-20 px-4">
            <header className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-primary font-orbitron tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary/70 to-primary animate-pulse-glow drop-shadow-[0_0_15px_rgba(0,200,200,0.1)]">
                    SYSTEM_PROVISIONING
                </h1>
                <p className="text-text/30 font-fira-code max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
                    Lifecycle management for compute, memory, and orchestration layers.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-10 focus-contrast p-2 rounded-[2.5rem] transition-all">
                    <div className="flex items-center gap-6 mb-4 px-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 font-bold text-xl shadow-lg shadow-primary/5">1</div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary font-orbitron uppercase tracking-widest">Resource Allocation</h2>
                            <p className="text-[10px] text-text/20 font-mono uppercase mt-1">L1_HARDWARE_RESERVATION</p>
                        </div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/10 shadow-2xl hover:border-primary/30 transition-all">
                        <ResourceAllocator />
                    </div>
                </div>

                <div className="space-y-10 focus-contrast p-2 rounded-[2.5rem] transition-all">
                    <div className="flex items-center gap-6 mb-4 px-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 font-bold text-xl shadow-lg shadow-secondary/5">2</div>
                        <div>
                            <h2 className="text-3xl font-bold text-secondary font-orbitron uppercase tracking-widest">Virtualization</h2>
                            <p className="text-[10px] text-text/20 font-mono uppercase mt-1">L2_HYPERVISOR_PROVISIONING</p>
                        </div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-secondary/10 shadow-2xl hover:border-secondary/30 transition-all">
                        <VirtualizationLayer />
                    </div>
                </div>
            </div>

            <div className="mt-8 p-8 border border-primary/10 rounded-2xl bg-primary/5 text-center transition-all hover:bg-primary/10">
                <h3 className="text-lg font-bold text-primary mb-2 uppercase">Ready for Deployment?</h3>
                <p className="text-sm text-text/60 mb-6">Ensure all resource schemas are validated before pushing to the production control plane.</p>
                <div className="flex justify-center gap-4">
                    <div className="h-1 w-24 bg-primary/20 rounded-full"></div>
                    <div className="h-1 w-24 bg-secondary/20 rounded-full"></div>
                    <div className="h-1 w-24 bg-primary/20 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ProvisioningPage;
