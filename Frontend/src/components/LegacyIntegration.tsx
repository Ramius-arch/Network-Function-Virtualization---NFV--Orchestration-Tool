import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';

const LegacyIntegration: React.FC = () => {
  const { envMode } = useEnvironment();
  const [legacyCommand, setLegacyCommand] = useState('show ip ospf neighbor detail');
  const [apiUrl, setApiUrl] = useState('http://legacy-core-switch.internal.dmz/v1/telemetry');
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState<any>({
    "source": "Bisco_Nexus_9k-S2",
    "status": "established",
    "protocols": ["OSPFv2", "BGP-4", "STP"],
    "neighbors": [
      { "id": "10.0.1.5", "priority": 100, "state": "FULL/DR", "uptime": "48w 3d" },
      { "id": "10.0.1.22", "priority": 0, "state": "FULL/BACKUP", "uptime": "2w 1d" }
    ]
  });
  const [loading, setLoading] = useState(false);

  const handleWrapLegacyCommand = async () => {
    setLoading(true);
    setStatus('Translating CLI semantics to NFV-ready JSON...');
    try {
      const data = await fetchAPI('/api/legacy-integration/wrap', {
        method: 'POST',
        body: JSON.stringify({ legacyCommand }),
      });
      setResponse(data);
      setStatus(`Command bridged successfully.`);
    } catch (err: any) {
      setStatus(`CLI wrapping failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLegacyApi = async () => {
    setLoading(true);
    setStatus('Probing REST adapter for legacy endpoint...');
    try {
      const data = await fetchAPI('/api/legacy-integration/test', {
        method: 'POST',
        body: JSON.stringify({ apiUrl }),
      });
      setResponse(data);
      setStatus(`Legacy API handshaking complete.`);
    } catch (err: any) {
      setStatus(`Endpoint probe failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Legacy Sandbox' : 'Legacy Bridge Protocol'}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">L4_LEGACY_BRIDGING</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Hand: Controls */}
        <div className="space-y-6">
          
          {/* CLI Wrapper Box */}
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
              <span className="text-5xl font-mono underline">CLI</span>
            </div>
            <h4 className="text-md font-bold text-white font-space-grotesk">
              Command Wrapper
            </h4>
            <p className="text-[10px] text-slate-500 mb-6 font-mono uppercase tracking-wider">
              {envMode === 'demo' ? 'Simulate encapsulation of bare-metal CLI outputs.' : 'Encapsulate Cisco/Juniper CLI outputs for modern controllers.'}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="CLI_STRING (e.g. show ip route)"
                className="premium-input w-full font-mono text-sm"
                value={legacyCommand}
                onChange={(e) => setLegacyCommand(e.target.value)}
              />
              <button
                onClick={handleWrapLegacyCommand}
                disabled={loading || !legacyCommand}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all uppercase tracking-wider text-xs shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Bridging...' : 'Execute Legacy Command'}
              </button>
            </div>
          </div>

          {/* REST Adapter Box */}
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
              <span className="text-5xl font-mono underline">API</span>
            </div>
            <h4 className="text-md font-bold text-white font-space-grotesk">
              REST Interface Adapter
            </h4>
            <p className="text-[10px] text-slate-500 mb-6 font-mono uppercase tracking-wider">
              {envMode === 'demo' ? 'Mock Older proprietary hardware API connections.' : 'Connect to older proprietary hardware APIs through the Atomic Bridge.'}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="ENDPOINT_URL (e.g. http://legacy-node/v1/api)"
                className="premium-input w-full font-mono text-sm"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <button
                onClick={handleTestLegacyApi}
                disabled={loading || !apiUrl}
                className="w-full border border-white/10 hover:border-violet-500/30 text-white py-3.5 rounded-2xl font-bold transition-all uppercase text-xs tracking-widest bg-slate-900/50 hover:bg-violet-600/10"
              >
                {loading ? 'Probing...' : 'Probe Bridge Endpoint'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand: Payload Dump */}
        <div className="flex flex-col">
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/5 h-full flex flex-col justify-between relative">
            <div>
              <div className="mb-4 flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="text-[9px] font-mono uppercase font-bold tracking-widest text-slate-400">
                  Bridge_Sync_Payload
                </h4>
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                </div>
              </div>

              <div className="flex-grow">
                {response ? (
                  <pre className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl text-xs font-mono overflow-auto max-h-[420px] text-green-400/90 leading-relaxed text-left">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full py-16 flex flex-col items-center justify-center text-slate-500 grayscale">
                    <span className="text-6xl mb-4 select-none opacity-20">📟</span>
                    <p className="uppercase tracking-[0.4em] text-xs">Offline_Buffer</p>
                  </div>
                )}
              </div>
            </div>

            {status && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-mono mb-2 text-left">Bridge_Protocol_Status</p>
                <div className="flex items-center gap-3">
                  <span className="animate-pulse text-cyan-400">●</span>
                  <p className="text-xs text-slate-400 italic font-mono truncate text-left">{status}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegacyIntegration;
