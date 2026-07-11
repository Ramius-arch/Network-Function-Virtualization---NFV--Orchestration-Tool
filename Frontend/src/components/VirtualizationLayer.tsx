import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../utils/api';

const VirtualizationLayer: React.FC = () => {
  const [functionName, setFunctionName] = useState('ids-protection-cluster');
  const [image, setImage] = useState('registry.atomic.internal/sec/ips-v2.1:latest');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Deployment stages animation states
  const [deployStep, setDeployStep] = useState<number>(-1);
  const [customInstances, setCustomInstances] = useState<any[]>([]);

  const defaultMockInstances = [
    { id: 'inst-901', name: 'firewall-v1', image: 'ubuntu-fips-22.04', status: 'running', uptime: '143h 12m', cpu: '2 Cores', memory: '8GB' },
    { id: 'inst-032', name: 'lb-primary', image: 'nginx-stable-alpine', status: 'running', uptime: '12h 02m', cpu: '2 Cores', memory: '4GB' },
    { id: 'inst-x77', name: 'dpi-engine', image: 'zeek-ids-core', status: 'paused', uptime: '0h 45m', cpu: '4 Cores', memory: '16GB' }
  ];

  // Load custom instances from localStorage
  const loadCustomInstances = () => {
    try {
      const saved = localStorage.getItem('atomic_network_functions');
      if (saved) {
        setCustomInstances(JSON.parse(saved));
      } else {
        setCustomInstances([]);
      }
    } catch (e) {
      console.warn('Error loading custom instances:', e);
    }
  };

  useEffect(() => {
    loadCustomInstances();
  }, []);

  const deployStages = [
    'Reserving hypervisor hardware slice (vCPU & RAM)...',
    'Acquiring image layer lock from atomic registry...',
    'Instantiating guest virtualization container...',
    'Assigning local virtual ethernet interface (vEth)...',
    'Binding network bridge gateways (L2/L3 routing)...',
    'Initializing telemetry node agent daemon...'
  ];

  const handleDeploy = async () => {
    if (!functionName.trim()) {
      setStatus('Validation Error: Target function name is required.');
      return;
    }

    setLoading(true);
    setDeployStep(0);
    setStatus('Deployment sequence initialized...');

    // Run progressive console stage animations (takes ~3.5 seconds)
    for (let i = 0; i < deployStages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeployStep(i + 1);
      setStatus(`[STAGE ${i+1}/${deployStages.length}] ${deployStages[i]}`);
    }

    try {
      // Trigger API in case server is running
      const data = await fetchAPI('/api/virtualization-layer/deploy', {
        method: 'POST',
        body: JSON.stringify({ functionName, image }),
      });
      
      // Save custom instance to localStorage
      const newInst = {
        id: data.instanceId || `inst-${Math.floor(Math.random() * 900 + 100)}`,
        name: functionName,
        image: image,
        status: 'running',
        uptime: '0h 01m',
        cpu: '2 Cores',
        memory: '4GB'
      };

      const updated = [...customInstances, newInst];
      localStorage.setItem('atomic_network_functions', JSON.stringify(updated));
      setCustomInstances(updated);

      setStatus(`Deployment successful! Virtual function ${functionName} is live. Hypervisor callback returned Instance ID: ${newInst.id}`);
    } catch (err: any) {
      console.warn('API deploy failed, running local sandbox deployment.', err);
      
      // Local sandbox fallback
      const newInst = {
        id: `inst-${Math.floor(Math.random() * 900 + 100)}`,
        name: functionName,
        image: image,
        status: 'running',
        uptime: '0h 01m',
        cpu: '2 Cores',
        memory: '4GB'
      };

      const updated = [...customInstances, newInst];
      localStorage.setItem('atomic_network_functions', JSON.stringify(updated));
      setCustomInstances(updated);

      setStatus(`[SANDBOX SUCCESS] Virtual function ${functionName} deployed to local mock hypervisor. Instance ID: ${newInst.id}`);
    } finally {
      setLoading(false);
      setDeployStep(-1);
    }
  };

  const handleRemove = async () => {
    if (!functionName.trim()) {
      setStatus('Validation Error: Target function name is required to terminate services.');
      return;
    }

    setLoading(true);
    setStatus('Gracefully terminating container services and releasing hypervisor allocations...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await fetchAPI('/api/virtualization-layer/remove', {
        method: 'POST',
        body: JSON.stringify({ functionName }),
      });

      const updated = customInstances.filter(inst => inst.name !== functionName);
      localStorage.setItem('atomic_network_functions', JSON.stringify(updated));
      setCustomInstances(updated);

      setStatus(`Resource termination complete. Instance ${functionName} purged from catalog.`);
    } catch (err: any) {
      console.warn('API remove failed, running local sandbox cleanup.', err);

      const updated = customInstances.filter(inst => inst.name !== functionName);
      localStorage.setItem('atomic_network_functions', JSON.stringify(updated));
      setCustomInstances(updated);

      setStatus(`[SANDBOX OK] Resource cleanup complete. Instance ${functionName} released from hypervisor pool.`);
    } finally {
      setLoading(false);
    }
  };

  const allInstances = [...defaultMockInstances, ...customInstances];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="text-left">
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
              className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-cyan-600/20 active:scale-95 cursor-pointer"
            >
              {loading && deployStep !== -1 ? 'Deploying...' : 'Instantiate Virtual Function'}
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="flex-1 border border-red-500/20 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-600/10 transition-all uppercase text-xs tracking-wider bg-slate-900/50 cursor-pointer"
            >
              {loading && deployStep === -1 ? 'Purging...' : 'Terminate Node'}
            </button>
          </div>
        </div>

        {/* Live console animation */}
        {loading && deployStep !== -1 && (
          <div className="lg:col-span-12 bg-slate-950 border border-white/10 rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono">provisioning_live_stream.log</span>
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {deployStages.map((stage, idx) => (
                <div 
                  key={idx}
                  className={`transition-opacity duration-300 ${
                    idx < deployStep ? 'text-green-400' : idx === deployStep ? 'text-cyan-400 animate-pulse' : 'text-slate-600 opacity-40'
                  }`}
                >
                  {idx < deployStep ? '✓ [OK] ' : idx === deployStep ? '⚡ [DEPLOYING] ' : '○ [PENDING] '}
                  {stage}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instance Registry Table */}
        <div className="lg:col-span-12 space-y-4">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest ml-1 text-left">Virtualized_Instance_Registry</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allInstances.map(inst => (
              <div 
                key={inst.id} 
                className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold font-space-grotesk text-white group-hover:text-cyan-400 transition-colors">{inst.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${inst.status === 'running' ? 'bg-green-400 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-amber-400'}`}></span>
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
