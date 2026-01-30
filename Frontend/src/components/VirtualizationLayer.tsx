import React, { useState } from 'react';

const VirtualizationLayer: React.FC = () => {
  const [functionName, setFunctionName] = useState('ids-protection-cluster');
  const [image, setImage] = useState('registry.atomic.internal/sec/ips-v2.1:latest');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const mockInstances = [
    { id: 'inst-901', name: 'firewall-v1', image: 'ubuntu-fips-22.04', status: 'running', uptime: '143h 12m' },
    { id: 'inst-032', name: 'lb-primary', image: 'nginx-stable-alpine', status: 'running', uptime: '12h 02m' },
    { id: 'inst-x77', name: 'dpi-engine', image: 'zeek-ids-core', status: 'paused', uptime: '0h 45m' }
  ];

  const handleDeploy = async () => {
    setLoading(true);
    setStatus('Initializing hypervisor environment...');
    setTimeout(() => {
      setStatus(`Instance ${functionName} is LIVE. Image verified and entrypoint started.`);
      setLoading(false);
    }, 1500);
  };

  const handleRemove = async () => {
    setLoading(true);
    setStatus('Gracefully terminating container services...');
    setTimeout(() => {
      setStatus(`Resource cleanup complete. Instance ${functionName} purged.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-secondary/20 shadow-2xl transition-all">
      <h2 className="text-3xl font-bold mb-8 text-secondary font-orbitron uppercase tracking-widest text-center border-b border-secondary/10 pb-4">Hypervisor Layer Control</h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary/60 uppercase font-bold ml-1">SYSTEM_INSTANCE_ID</label>
              <input
                type="text"
                className="p-4 border border-secondary/20 rounded-xl bg-background/50 text-text w-full focus:border-secondary outline-none transition-all font-mono"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary/60 uppercase font-bold ml-1">IMAGE_REGISTRY_PATH</label>
              <input
                type="text"
                className="p-4 border border-secondary/20 rounded-xl bg-background/50 text-text w-full focus:border-secondary outline-none transition-all font-mono text-sm"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="flex-[2] bg-secondary text-background py-4 rounded-xl font-bold hover:bg-primary transition-all uppercase tracking-widest shadow-lg shadow-secondary/20"
            >
              {loading ? 'Spawning...' : 'Instantiate Virtual Function'}
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="flex-1 border border-error/50 text-error/80 py-4 rounded-xl font-bold hover:bg-error hover:text-white transition-all uppercase text-xs tracking-widest"
            >
              {loading ? 'Killing...' : 'Terminate Node'}
            </button>
          </div>
        </div>

        {/* Instance Registry Table */}
        <div className="lg:col-span-12">
          <h3 className="text-xs font-bold text-text/40 uppercase font-mono tracking-widest mb-6 border-l-2 border-secondary pl-3">Virtualized_Instance_Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockInstances.map(inst => (
              <div key={inst.id} className="p-6 bg-black/60 rounded-3xl border border-secondary/5 hover:border-secondary/40 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold font-orbitron uppercase text-text/90 group-hover:text-secondary transition-colors">{inst.name}</span>
                  <div className={`w-2 h-2 rounded-full ${inst.status === 'running' ? 'bg-secondary animate-pulse shadow-[0_0_8px_#00FF00]' : 'bg-accent'}`}></div>
                </div>
                <div className="space-y-1 flex-grow">
                  <p className="text-[9px] text-text/40 font-mono truncate">{inst.image}</p>
                  <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-widest">{inst.status}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-secondary/5 flex justify-between items-center text-[9px] font-mono text-text/30">
                  <span>ID: {inst.id}</span>
                  <span>Uptime: {inst.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          {status && (
            <div className="mt-8 p-6 bg-secondary/5 border border-secondary/10 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-3 bg-secondary rounded-full"></div>
                <p className="text-[10px] text-secondary font-mono uppercase tracking-widest">hypervisor_service_callback</p>
              </div>
              <p className="text-xs text-text/80 font-mono italic">{`>>`} {status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualizationLayer;
