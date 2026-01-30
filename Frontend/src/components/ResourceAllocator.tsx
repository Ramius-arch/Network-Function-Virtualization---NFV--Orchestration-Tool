import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const ResourceAllocator: React.FC = () => {
  const { isDemo } = useEnvironment();
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
    setTimeout(() => {
      setStatus(`Lease confirmed for ${functionName}. Reserved ${cpu}vCPU / ${memory}GB RAM.`);
      setLoading(false);
    }, 1100);
  };

  const handleScale = async (direction: 'up' | 'down') => {
    setLoading(true);
    setStatus(`Attempting global resource ${direction}scale...`);
    setTimeout(() => {
      setStatus(`Topology re-balanced. ${functionName} ${direction}scaled successfully.`);
      setLoading(false);
    }, 1300);
  };

  return (
    <div className="relative">
      <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl transition-all">
        <h2 className={`text-3xl font-bold mb-8 font-orbitron uppercase tracking-widest text-center border-b border-primary/10 pb-4 ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
          {isDemo ? 'Virtual Resource Demo' : 'Resource Inventory Manager'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Allocator Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-primary/60 uppercase font-bold ml-1 font-mono">RESERVATION_NAME</label>
                <input
                  type="text"
                  className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-primary/60 uppercase font-bold ml-1 font-mono">VCPU_COUNT</label>
                  <input
                    type="text"
                    className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono"
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-primary/60 uppercase font-bold ml-1 font-mono">RAM_QUOTA_GB</label>
                  <input
                    type="text"
                    className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleAllocate}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold transition-all uppercase tracking-widest shadow-lg ${isDemo
                      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/10'
                      : 'bg-primary text-background hover:bg-secondary shadow-primary/20'
                    }`}
                >
                  {loading ? 'Negotiating...' : isDemo ? 'Simulate Reservation' : 'Reserve Physical Assets'}
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleScale('up')}
                    disabled={loading}
                    className={`flex-1 border py-3 rounded-xl font-bold transition-all uppercase text-xs tracking-widest ${isDemo ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10' : 'border-primary text-primary hover:bg-primary/10'
                      }`}
                  >
                    Hot-Scale Up
                  </button>
                  <button
                    onClick={() => handleScale('down')}
                    disabled={loading}
                    className="flex-1 border border-error/50 text-error/80 py-3 rounded-xl font-bold hover:bg-error/10 transition-all uppercase text-xs tracking-widest"
                  >
                    Scale Down
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Reservations */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-text/40 uppercase font-mono tracking-widest ml-2">Active_Lease_Registry</h3>
            <div className="space-y-4">
              {mockAllocations.map(alloc => (
                <div key={alloc.id} className={`p-4 bg-black/60 border rounded-2xl flex justify-between items-center transition-all cursor-crosshair ${isDemo ? 'border-amber-500/10 hover:border-amber-500/40' : 'border-primary/5 hover:border-primary/40'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text font-orbitron">{alloc.name}</span>
                    <span className="text-[9px] text-primary/40 font-mono italic">Tenant: {alloc.tenant}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex gap-2">
                      <span className="bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded border border-primary/20 uppercase font-mono">{alloc.cpu}</span>
                      <span className="bg-secondary/10 text-secondary text-[8px] px-2 py-0.5 rounded border border-secondary/20 uppercase font-mono">{alloc.mem}</span>
                    </div>
                    <span className={`text-[8px] font-bold uppercase ${alloc.status === 'active' ? 'text-secondary' : 'text-accent'}`}>{alloc.status}</span>
                  </div>
                </div>
              ))}
              <div className={`mt-6 p-4 border rounded-xl ${isDemo ? 'bg-amber-500/5 border-amber-500/10' : 'bg-primary/5 border-primary/10'}`}>
                <p className="text-[9px] text-primary font-mono lowercase mb-2">system_operation_output</p>
                <p className="text-xs text-text/60 font-mono min-h-[40px]">
                  {status ? `>> ${status}` : "AWAITING_INPUT_SIGNAL..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="absolute bottom-4 right-4 bg-amber-500 text-black text-[8px] font-bold px-3 py-1 uppercase tracking-widest rounded shadow-xl">
            DEMO_INSTANCE_PREVIEW
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceAllocator;
