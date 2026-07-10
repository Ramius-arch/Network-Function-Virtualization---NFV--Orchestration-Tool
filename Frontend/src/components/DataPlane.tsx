import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';

const DataPlane: React.FC = () => {
  const { envMode } = useEnvironment();
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
    try {
      const data = await fetchAPI('/api/data-plane/route', {
        method: 'POST',
        body: JSON.stringify({ source, destination }),
      });
      setStatus(`Injected flow-rule. Output: ${data.message || 'Success'}`);
    } catch (err: any) {
      setStatus(`Flow injection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTrafficRules = async () => {
    setLoading(true);
    setStatus('Flushing silicon-level flow tables...');
    try {
      const data = await fetchAPI('/api/data-plane/clear', {
        method: 'POST',
      });
      setStatus(`All dynamic flow rules purged. Output: ${data.message || 'Success'}`);
    } catch (err: any) {
      setStatus(`Purge failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Data Plane Simulation' : 'Data Plane Orchestrator'}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">L2_DATA_PLANE_FLOWS</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">FLOW_ORIGIN_IP</label>
              <input
                type="text"
                placeholder="e.g. 10.0.0.1/24"
                className="premium-input w-full font-mono text-sm"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">GATEWAY_TARGET</label>
              <input
                type="text"
                placeholder="e.g. 172.16.0.42"
                className="premium-input w-full font-mono text-sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleRouteTraffic}
              disabled={loading}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-violet-600/20 active:scale-95"
            >
              {loading ? 'Establishing...' : 'Commit Flow-Bridge'}
            </button>
            <button
              onClick={handleClearTrafficRules}
              disabled={loading}
              className="border border-red-500/20 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-600/10 transition-all uppercase text-xs tracking-wider bg-slate-900/50"
            >
              {loading ? 'Purging...' : 'Flush Dynamic Rules'}
            </button>
          </div>
        </div>

        {/* Existing Routes Table */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest text-left">
                  Active_Flow_Matrix
                </h4>
                <span className="text-[9px] text-slate-500 font-mono">COUNT: 3</span>
              </div>

              <div className="space-y-3">
                {initialRules.map((rule, i) => (
                  <div 
                    key={i} 
                    className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:border-violet-500/30 transition-all duration-300 group"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{rule.src} → {rule.dest}</span>
                      <span className="text-[8px] text-violet-400 font-mono font-bold">{rule.proto} // PORT:{rule.port}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-cyan-400 group-hover:text-violet-400 transition-colors">
                        {rule.metrics}
                      </span>
                      <div className="text-[8px] text-slate-500 uppercase">RuleID: {rule.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 font-mono text-[9px] bg-slate-950/80 p-4 rounded-2xl border border-white/5 text-slate-500 text-left animate-fade-in min-h-[60px]">
              {status ? (
                <p className="text-violet-400/90">⚡ STATUS: {status}</p>
              ) : (
                <p>AWAITING_ORCHESTRATION_INPUT...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPlane;
