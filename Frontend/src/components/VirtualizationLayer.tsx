import React, { useState } from 'react';
import { fetchAPI } from '../utils/api';

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
    try {
      const data = await fetchAPI('/api/virtualization-layer/deploy', {
        method: 'POST',
        body: JSON.stringify({ functionName, image }),
      });
      setStatus(`Instance ${data.functionName || functionName} is LIVE. Status: ${data.status || 'deployed'}. Instance ID: ${data.instanceId || 'unknown'}`);
    } catch (err: any) {
      setStatus(`Deployment failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setStatus('Gracefully terminating container services...');
    try {
      const data = await fetchAPI('/api/virtualization-layer/remove', {
        method: 'POST',
        body: JSON.stringify({ functionName }),
      });
      setStatus(`Resource cleanup complete. Instance ${data.functionName || functionName} purged. Status: ${data.status || 'removed'}`);
    } catch (err: any) {
      setStatus(`Termination failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk text-white">Hypervisor Layer Control</h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">L2_HYPERVISOR_PROVISIONING</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">SYSTEM_INSTANCE_ID</label>
              <input
                type="text"
                className="premium-input w-full font-mono text-sm"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">IMAGE_REGISTRY_PATH</label>
              <input
                type="text"
                className="premium-input w-full font-mono text-sm"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-cyan-600/20 active:scale-95"
            >
              {loading ? 'Spawning...' : 'Instantiate Virtual Function'}
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="flex-1 border border-red-500/20 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-600/10 transition-all uppercase text-xs tracking-wider bg-slate-900/50"
            >
              {loading ? 'Purging...' : 'Terminate Node'}
            </button>
          </div>
        </div>

        {/* Instance Registry Table */}
        <div className="lg:col-span-12 space-y-4">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest ml-1 text-left">Virtualized_Instance_Registry</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockInstances.map(inst => (
              <div 
                key={inst.id} 
                className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold font-space-grotesk text-white group-hover:text-cyan-400 transition-colors">{inst.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${inst.status === 'running' ? 'bg-green-400 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-amber-400'}`}></span>
                  </div>
                </div>
                
                <div className="space-y-1 text-left">
                  <p className="text-[9px] text-slate-500 font-mono truncate">{inst.image}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{inst.status}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>ID: {inst.id}</span>
                  <span>Uptime: {inst.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          {status && (
            <div className="mt-6 p-4 border border-white/5 rounded-2xl bg-slate-950/80">
              <p className="text-[8px] text-cyan-400 font-mono lowercase mb-2 text-left">hypervisor_service_callback</p>
              <p className="text-xs text-slate-400 font-mono min-h-[40px] text-left leading-relaxed">
                {`>>`} {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualizationLayer;
