import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';

const ResourceAllocator: React.FC = () => {
  const { envMode } = useEnvironment();
  const [functionName, setFunctionName] = useState('edge-compute-node-12');
  const [cpu, setCpu] = useState('8');
  const [memory, setMemory] = useState('32');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const mockAllocations = [
    { id: 'all-v9', name: 'firewall-v1', cpu: '4 Cores', mem: '16GB', status: 'active', tenant: 'Security_Team' },
    { id: 'all-v4', name: 'lb-primary', cpu: '2 Cores', mem: '4GB', status: 'active', tenant: 'Platform_Eng' },
    { id: 'all-k0', name: 'ids-cluster', cpu: '16 Cores', mem: '64GB', status: 'warning', tenant: 'Security_Team' }
  ];

  const handleAllocate = async () => {
    setLoading(true);
    setStatus('Negotiating hypervisor lease...');
    try {
      const data = await fetchAPI('/api/resource-allocator/allocate', {
        method: 'POST',
        body: JSON.stringify({ functionName, resources: { cpu, memory } }),
      });
      setStatus(`Lease confirmed for ${data.functionName || functionName}. Reserved ${data.allocatedCpu}vCPU / ${data.allocatedMemory} RAM. Status: ${data.status}`);
    } catch (err: any) {
      setStatus(`Lease negotiation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScale = async (direction: 'up' | 'down') => {
    setLoading(true);
    setStatus(`Attempting global resource ${direction}scale...`);
    try {
      const data = await fetchAPI('/api/resource-allocator/scale', {
        method: 'POST',
        body: JSON.stringify({ functionName, scale: direction }),
      });
      setStatus(`Topology re-balanced. ${data.functionName || functionName} scaled to ${data.allocatedCpu} / ${data.allocatedMemory} RAM. Status: ${data.status}`);
    } catch (err: any) {
      setStatus(`Scaling failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Virtual Resource Allocation' : 'Resource Inventory Manager'}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">L1_HARDWARE_RESERVATION</p>
        </div>
        {envMode === 'demo' && (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full">
            DEMO_MOCK
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Allocator Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">RESERVATION_NAME</label>
              <input
                type="text"
                className="premium-input w-full font-mono text-sm"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">VCPU_COUNT</label>
                <input
                  type="text"
                  className="premium-input w-full font-mono text-sm"
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">RAM_QUOTA_GB</label>
                <input
                  type="text"
                  className="premium-input w-full font-mono text-sm"
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                onClick={handleAllocate}
                disabled={loading}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-violet-600/20 active:scale-95"
              >
                {loading ? 'Negotiating...' : 'Reserve Physical Assets'}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => handleScale('up')}
                  disabled={loading}
                  className="flex-1 border border-white/10 hover:border-violet-500/30 text-white py-3 rounded-2xl font-bold transition-all uppercase text-[10px] tracking-widest bg-slate-900/50 hover:bg-violet-600/10"
                >
                  Scale Up
                </button>
                <button
                  onClick={() => handleScale('down')}
                  disabled={loading}
                  className="flex-1 border border-red-500/20 text-red-400 py-3 rounded-2xl font-bold hover:bg-red-600/10 transition-all uppercase text-[10px] tracking-widest bg-slate-900/50"
                >
                  Scale Down
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Leases */}
        <div className="lg:col-span-7 space-y-6">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest ml-1 text-left">Active_Lease_Registry</h4>
          <div className="space-y-3">
            {mockAllocations.map(alloc => (
              <div 
                key={alloc.id} 
                className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl flex justify-between items-center hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white font-space-grotesk">{alloc.name}</span>
                  <span className="text-[8px] text-slate-500 font-mono italic">Tenant: {alloc.tenant}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className="flex gap-2">
                    <span className="bg-violet-500/10 text-violet-400 text-[8px] px-2 py-0.5 rounded-lg border border-violet-500/20 uppercase font-mono">{alloc.cpu}</span>
                    <span className="bg-cyan-500/10 text-cyan-400 text-[8px] px-2 py-0.5 rounded-lg border border-cyan-500/20 uppercase font-mono">{alloc.mem}</span>
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${alloc.status === 'active' ? 'text-green-400' : 'text-amber-400'}`}>{alloc.status}</span>
                </div>
              </div>
            ))}
            
            {/* Telemetry output block */}
            <div className="mt-6 p-4 border border-white/5 rounded-2xl bg-slate-950/80">
              <p className="text-[8px] text-violet-400 font-mono lowercase mb-2 text-left">system_operation_output</p>
              <p className="text-xs text-slate-400 font-mono min-h-[40px] text-left leading-relaxed">
                {status ? `>> ${status}` : "AWAITING_INPUT_SIGNAL..."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocator;
