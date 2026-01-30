import React from 'react';

interface NodeTooltipProps {
    label: string;
    description: string;
    status: 'active' | 'idle' | 'warning' | 'error';
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
        active: 'text-secondary',
        idle: 'text-text/50',
        warning: 'text-accent',
        error: 'text-error',
    };

    return (
        <div
            className="fixed z-[100] w-64 p-3 bg-black/80 backdrop-blur-lg border border-primary/50 rounded-lg shadow-2xl animate-fade-in pointer-events-none"
            style={{
                left: `${position.x + 10}px`,
                top: `${position.y + 10}px`,
            }}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-primary font-orbitron tracking-tight">{label}</h4>
                <span className={`text-[10px] uppercase font-bold ${statusColors[status]}`}>{status}</span>
            </div>
            <p className="text-[11px] text-text/80 mb-3 leading-relaxed">{description}</p>

            {metrics && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/20">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 uppercase">CPU</span>
                        <span className="text-[10px] font-mono">{metrics.cpu}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 uppercase">MEM</span>
                        <span className="text-[10px] font-mono">{metrics.memory}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 uppercase">NET</span>
                        <span className="text-[10px] font-mono">{metrics.traffic}</span>
                    </div>
                </div>
            )}

            <div className="mt-3 flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full animate-pulse ${status === 'active' ? 'bg-secondary' : 'bg-primary/50'}`}></div>
                <span className="text-[8px] text-text/30 font-fira-code">Real-time sync active</span>
            </div>
        </div>
    );
};

export default NodeTooltip;
