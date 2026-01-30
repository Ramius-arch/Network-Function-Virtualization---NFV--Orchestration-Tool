import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const ControlPlane: React.FC = () => {
  const { isDemo } = useEnvironment();
  const [functionName, setFunctionName] = useState('firewall-v1');
  const [config, setConfig] = useState(JSON.stringify({
    "rules": [
      { "id": 101, "action": "deny", "src": "any", "dest": "db-server", "port": 3306 },
      { "id": 102, "action": "allow", "src": "10.0.0.0/24", "dest": "any", "port": "any" }
    ],
    "logging": "enabled",
    "threat_intel": "active-sync"
  }, null, 2));

  const [functionState, setFunctionState] = useState<any>({
    "node_id": "fw-v1-primary",
    "uptime": "14d 2h 35m",
    "policy_version": "2.4.12-stable",
    "active_sessions": 1458,
    "last_sync": new Date().toISOString()
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfigure = async () => {
    setLoading(true);
    setStatus('Pushing configuration to edge nodes...');
    setTimeout(() => {
      setStatus('Configuration propagated successfully across 4 shards.');
      setLoading(false);
    }, 1200);
  };

  const handleGetState = async () => {
    setLoading(true);
    setStatus('Polling remote state sensors...');
    setTimeout(() => {
      setFunctionState({
        "node_id": `${functionName}-primary`,
        "uptime": "0d 0h 15m",
        "policy_version": "custom-rc1",
        "active_sessions": Math.floor(Math.random() * 500),
        "last_sync": new Date().toISOString()
      });
      setStatus(`State data synchronized for ${functionName}.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl transition-all">
        <h2 className={`text-3xl font-bold mb-8 font-orbitron uppercase tracking-widest text-center border-b border-primary/10 pb-4 ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
          {isDemo ? 'Control Plane Simulation' : 'Control Plane Manager'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-primary/60 uppercase font-bold ml-1 font-mono">TARGET_FUNCTION_NAME</label>
              <input
                type="text"
                placeholder="e.g. firewall-service-alpha"
                className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono text-sm"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-primary/60 uppercase font-bold ml-1 font-mono">JSON_CONFIGURATION_BLOAD</label>
              <textarea
                className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full h-64 focus:border-primary outline-none transition-all font-mono text-sm resize-none custom-scrollbar"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleConfigure}
                disabled={loading}
                className={`py-4 rounded-xl font-bold transition-all uppercase tracking-widest shadow-lg ${isDemo ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/10' : 'bg-primary text-background hover:bg-secondary shadow-primary/10'
                  }`}
              >
                {loading ? 'Propagating...' : isDemo ? 'Simulate Commit' : 'Commit Changes'}
              </button>
              <button
                onClick={handleGetState}
                disabled={loading}
                className={`border py-4 rounded-xl font-bold transition-all uppercase tracking-widest ${isDemo ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10' : 'border-primary/50 text-primary hover:bg-primary/10'
                  }`}
              >
                {loading ? 'Interrogating...' : 'Query Sensor State'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-black/60 rounded-2xl border border-primary/5 h-full flex flex-col">
              <h3 className={`text-lg font-bold mb-4 font-orbitron uppercase border-b pb-2 ${isDemo ? 'text-amber-500 border-amber-500/10' : 'text-secondary border-secondary/10'}`}>
                Operational_State_Dump
              </h3>
              <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-[300px]">
                <div className="animate-fade-in">
                  <pre className={`text-xs bg-black/30 p-6 rounded-xl border font-mono overflow-auto max-h-[450px] ${isDemo ? 'text-amber-500/80 border-amber-500/10' : 'text-secondary/90 border-secondary/10'}`}>
                    {JSON.stringify(functionState, null, 2)}
                  </pre>
                </div>
              </div>
              {status && (
                <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-3">
                  <div className={`w-1 h-1 rounded-full animate-ping ${isDemo ? 'bg-amber-500' : 'bg-primary'}`}></div>
                  <p className="text-[10px] text-text/50 font-mono truncate">{status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="absolute inset-x-0 bottom-[-20px] pointer-events-none flex justify-center">
          <div className="bg-amber-500 text-black text-[9px] font-black px-8 py-1 uppercase tracking-[0.5em] rounded-b-xl shadow-xl border-t border-black/20">
            Simulation_Mode_Active
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPlane;
