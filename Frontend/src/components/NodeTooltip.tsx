import React from 'react';

interface NodeTooltipProps {
    label: string;
    description: string;
    status: 'active' | 'idle' | 'warning' | 'error' | 'standby';
    metrics?: {
        cpu: string;
        memory: string;
        traffic: string;
    };
    visible: boolean;
    position: { x: number; y: number };
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({
    label,
    description,
    status,
    metrics,
    visible,
    position,
}) => {
    if (!visible) return null;

    const statusColors = {
        active: 'text-green-400',
        idle: 'text-slate-500',
        warning: 'text-amber-400',
        error: 'text-red-400',
        standby: 'text-cyan-400'
    };

    return (
        <div
            className="fixed z-[100] w-64 p-4 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in pointer-events-none text-left"
            style={{
                left: `${position.x + 10}px`,
                top: `${position.y + 10}px`,
            }}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-white font-space-grotesk tracking-tight">{label}</h4>
                <span className={`text-[9px] uppercase font-mono font-bold tracking-wider ${statusColors[status] || 'text-slate-400'}`}>{status}</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{description}</p>

            {metrics && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase">CPU</span>
                        <span className="text-[10px] text-slate-300">{metrics.cpu}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase">MEM</span>
                        <span className="text-[10px] text-slate-300">{metrics.memory}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase">NET</span>
                        <span className="text-[10px] text-slate-300">{metrics.traffic}</span>
                    </div>
                </div>
            )}

            <div className="mt-3 flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'active' ? 'bg-green-400' : 'bg-violet-400'}`}></div>
                <span className="text-[8px] text-slate-500 font-mono">Real-time sync active</span>
            </div>
        </div>
    );
};

export default NodeTooltip;
