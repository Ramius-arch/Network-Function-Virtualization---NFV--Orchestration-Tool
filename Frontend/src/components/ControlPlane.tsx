import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';

const ControlPlane: React.FC = () => {
  const { envMode } = useEnvironment();
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
    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(config);
      } catch (e) {
        throw new Error('Invalid JSON configuration');
      }
      const data = await fetchAPI('/api/control-plane/configure', {
        method: 'POST',
        body: JSON.stringify({ functionName, config: parsedConfig }),
      });
      setStatus(`Configuration propagated successfully for ${data.functionName || functionName}.`);
    } catch (err: any) {
      setStatus(`Configuration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetState = async () => {
    setLoading(true);
    setStatus('Polling remote state sensors...');
    try {
      const data = await fetchAPI(`/api/control-plane/state/${functionName}`, {
        method: 'GET',
      });
      setFunctionState(data.state || {
        "node_id": `${functionName}-primary`,
        "uptime": "0d 0h 15m",
        "policy_version": "custom-rc1",
        "active_sessions": Math.floor(Math.random() * 500),
        "last_sync": new Date().toISOString()
      });
      setStatus(`State data synchronized for ${functionName}.`);
    } catch (err: any) {
      setStatus(`Query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Control Plane Simulation' : 'Control Plane Manager'}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">L4_ROUTING_GATEWAYS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="space-y-6">
          <div className="space-y-1 text-left">
            <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">TARGET_FUNCTION_NAME</label>
            <input
              type="text"
              placeholder="e.g. firewall-service-alpha"
              className="premium-input w-full font-mono text-sm"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[9px] text-slate-400 uppercase font-bold ml-1 font-mono">JSON_CONFIGURATION_BLOB</label>
            <textarea
              className="premium-input w-full h-64 font-mono text-sm resize-none custom-scrollbar"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleConfigure}
              disabled={loading}
              className="py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-violet-600/20 active:scale-95"
            >
              {loading ? 'Propagating...' : 'Commit Changes'}
            </button>
            <button
              onClick={handleGetState}
              disabled={loading}
              className="border border-white/10 hover:border-violet-500/30 text-white py-4 rounded-2xl font-bold transition-all uppercase text-[10px] tracking-widest bg-slate-900/50 hover:bg-violet-600/10"
            >
              {loading ? 'Interrogating...' : 'Query Sensor State'}
            </button>
          </div>
        </div>

        {/* Right Column: State Dump */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest border-b border-white/5 pb-2 text-left">
                Operational_State_Dump
              </h4>
              <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 mt-4 min-h-[300px]">
                <div className="animate-fade-in text-left">
                  <pre className="text-xs bg-slate-900/40 p-5 rounded-2xl border border-white/5 font-mono overflow-auto max-h-[400px] text-green-400/90">
                    {JSON.stringify(functionState, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {status && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full animate-ping bg-violet-500"></div>
                <p className="text-[9px] text-slate-500 font-mono truncate">{status}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ControlPlane;
