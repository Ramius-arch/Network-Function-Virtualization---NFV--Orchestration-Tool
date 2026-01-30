import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const DataPlane: React.FC = () => {
  const { isDemo } = useEnvironment();
  const [source, setSource] = useState('10.0.0.5/32');
  const [destination, setDestination] = useState('172.16.20.100');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const initialRules = [
    { id: 'rte-44', src: '192.168.1.0/24', dest: 'VPN-GW-01', proto: 'TCP', port: 443, metrics: '150Mb/s' },
    { id: 'rte-12', src: 'Internal-Workload-B', dest: 'Storage-Primary', proto: 'RDMA', port: 1002, metrics: '12Gb/s' },
    { id: 'rte-89', src: 'any', dest: 'Internet-Egress', proto: 'UDP', port: 53, metrics: '1.2Mb/s' }
  ];

  const handleRouteTraffic = async () => {
    setLoading(true);
    setStatus('Establishing SDN flow-bridge...');
    setTimeout(() => {
      setStatus(`Injected flow-rule from ${source} to ${destination} across 12 switches.`);
      setLoading(false);
    }, 900);
  };

  const handleClearTrafficRules = async () => {
    setLoading(true);
    setStatus('Flushing silicon-level flow tables...');
    setTimeout(() => {
      setStatus('All dynamic flow rules purged. Reverting to base ACLs.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl transition-all">
        <h2 className={`text-3xl font-bold mb-8 font-orbitron uppercase tracking-widest text-center border-b border-primary/10 pb-4 ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
          {isDemo ? 'Data Plane Simulation' : 'Data Plane Orchestrator'}
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-primary/60 uppercase font-bold ml-1 font-mono">FLOW_ORIGIN_IP</label>
                <input
                  type="text"
                  placeholder="e.g. 10.0.0.1/24"
                  className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono text-sm"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-primary/60 uppercase font-bold ml-1 font-mono">GATEWAY_TARGET</label>
                <input
                  type="text"
                  placeholder="e.g. 172.16.0.42"
                  className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono text-sm"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleRouteTraffic}
                disabled={loading}
                className={`py-4 rounded-xl font-bold transition-all uppercase tracking-widest shadow-lg ${isDemo ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/10' : 'bg-primary text-background hover:bg-secondary shadow-primary/10'
                  }`}
              >
                {loading ? 'Establishing...' : isDemo ? 'Simulate Flow' : 'Commit Flow-Bridge'}
              </button>
              <button
                onClick={handleClearTrafficRules}
                disabled={loading}
                className="border border-error/50 text-error/80 py-4 rounded-xl font-bold hover:bg-error transition-all uppercase text-xs tracking-widest"
              >
                {loading ? 'Purging...' : 'Flush Dynamic Rules'}
              </button>
            </div>
          </div>

          {/* Existing Routes Table */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className={`p-6 rounded-2xl border h-full ${isDemo ? 'bg-amber-500/5 border-amber-500/10' : 'bg-primary/5 border-primary/10'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-sm font-bold uppercase font-orbitron ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
                  {isDemo ? 'Simulated_Flow_Matrix' : 'Active_Flow_Matrix'}
                </h3>
                <span className="text-[10px] text-primary/40 font-mono">COUNT: 3</span>
              </div>

              <div className="space-y-3">
                {initialRules.map((rule, i) => (
                  <div key={i} className={`bg-black/40 p-4 rounded-xl border flex justify-between items-center group transition-all ${isDemo ? 'border-amber-500/5 hover:border-amber-500/30' : 'border-primary/5 hover:border-primary/30'}`}>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text/60 font-mono uppercase">{rule.src} → {rule.dest}</span>
                      <span className="text-[8px] text-primary/40 font-mono font-bold">{rule.proto} // PORT:{rule.port}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono transition-colors ${isDemo ? 'text-amber-500 group-hover:text-amber-400' : 'text-secondary group-hover:text-primary'}`}>
                        {rule.metrics}
                      </span>
                      <div className="text-[8px] text-text/20 uppercase">RuleID: {rule.id}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 font-mono text-[10px] bg-black/60 p-4 rounded-xl border border-primary/5 text-text/40 animate-fade-in min-h-[60px]">
                {status ? (
                  <p className={isDemo ? 'text-amber-500/90' : 'text-primary/90'}>⚡ STATUS: {status}</p>
                ) : (
                  <p>AWAITING_ORCHESTRATION_INPUT...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/10 rounded-2xl overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[8px] font-bold px-4 py-0.5 uppercase tracking-widest rounded-full">
            DATA_PLANE_SIMULATION
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPlane;
