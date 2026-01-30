import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const LegacyIntegration: React.FC = () => {
  const { isDemo } = useEnvironment();
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
    setTimeout(() => {
      setResponse({
        "translated_command": legacyCommand,
        "orchestrator_hook": "cli_gateway_v2",
        "execution_status": "proxy_success",
        "raw_output_buffer": "Neighbor 10.1.1.5 (Port 1/2) is UP. State: FULL. Adj: 450s"
      });
      setStatus(`Command bridged successfully. Mapping schema v1.4 active.`);
      setLoading(false);
    }, 1100);
  };

  const handleTestLegacyApi = async () => {
    setLoading(true);
    setStatus('Probing REST adapter for legacy endpoint...');
    setTimeout(() => {
      setResponse({
        "endpoint": apiUrl,
        "latency": "14ms",
        "auth_type": "None",
        "health": "accessible",
        "response_snippet": "{\"system_status\": \"nominal\", \"fan_rpm\": 4500}"
      });
      setStatus(`Legacy API handshaking complete. Data parity maintained.`);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="relative">
      <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl transition-all">
        <h2 className={`text-3xl font-bold mb-8 font-orbitron uppercase tracking-widest text-center border-b border-primary/10 pb-4 ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
          {isDemo ? 'Legacy Sandbox' : 'Legacy Bridge Protocol'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {/* CLI Wrapper Section */}
            <div className={`p-8 rounded-3xl border relative overflow-hidden group ${isDemo ? 'bg-amber-500/5 border-amber-500/10' : 'bg-primary/5 border-primary/10'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-6xl font-mono underline select-none">CLI</span>
              </div>
              <h3 className={`text-lg font-bold mb-2 uppercase tracking-tighter ${isDemo ? 'text-amber-500' : 'text-secondary'}`}>
                Command Wrapper
              </h3>
              <p className="text-[10px] text-text/40 mb-6 font-mono leading-relaxed uppercase tracking-widest">
                {isDemo ? 'Simulate encapsulation of bare-metal CLI outputs.' : 'Encapsulate bare-metal Cisco/Juniper CLI outputs for modern NFV controllers.'}
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="CLI_STRING (e.g. show ip route)"
                  className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono text-sm"
                  value={legacyCommand}
                  onChange={(e) => setLegacyCommand(e.target.value)}
                />
                <button
                  onClick={handleWrapLegacyCommand}
                  disabled={loading || !legacyCommand}
                  className={`w-full py-4 rounded-xl font-bold disabled:opacity-50 transition-all uppercase tracking-widest shadow-lg ${isDemo ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/10' : 'bg-primary text-background hover:bg-secondary shadow-primary/20'
                    }`}
                >
                  {loading ? 'Bridging...' : isDemo ? 'Simulate CLI Bridge' : 'Execute Legacy Command'}
                </button>
              </div>
            </div>

            {/* REST Adapter Section */}
            <div className={`p-8 rounded-3xl border relative overflow-hidden group ${isDemo ? 'bg-amber-500/5 border-amber-500/10' : 'bg-primary/5 border-primary/10'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-6xl font-mono underline select-none">API</span>
              </div>
              <h3 className={`text-lg font-bold mb-2 uppercase tracking-tighter ${isDemo ? 'text-amber-500' : 'text-secondary'}`}>
                REST Interface Adapter
              </h3>
              <p className="text-[10px] text-text/40 mb-6 font-mono leading-relaxed uppercase tracking-widest">
                {isDemo ? 'Mock Older proprietary hardware API connections.' : 'Connect to older proprietary hardware APIs through the Atomic Bridge.'}
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ENDPOINT_URL (e.g. http://legacy-node/v1/api)"
                  className="p-4 border border-primary/20 rounded-xl bg-background/50 text-text w-full focus:border-primary outline-none transition-all font-mono text-sm"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
                <button
                  onClick={handleTestLegacyApi}
                  disabled={loading || !apiUrl}
                  className={`w-full border py-4 rounded-xl font-bold transition-all uppercase tracking-widest ${isDemo ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10' : 'border-primary text-primary hover:bg-primary/10'
                    }`}
                >
                  {loading ? 'Probing...' : 'Probe Bridge Endpoint'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <div className="p-8 bg-black/60 rounded-3xl border border-primary/5 h-full flex flex-col relative">
              <div className="mb-6 flex justify-between items-center border-b border-primary/10 pb-4">
                <h3 className={`text-xs font-mono uppercase font-bold tracking-widest ${isDemo ? 'text-amber-500' : 'text-secondary'}`}>
                  Bridge_Sync_Payload
                </h3>
                <div className="flex gap-1">
                  <div className={`w-1 h-1 ${isDemo ? 'bg-amber-500' : 'bg-secondary'}`}></div>
                  <div className={`w-1 h-3 ${isDemo ? 'bg-amber-500/50' : 'bg-secondary/50'}`}></div>
                </div>
              </div>

              <div className="flex-grow">
                {response ? (
                  <pre className={`p-6 border rounded-2xl text-xs font-mono overflow-auto max-h-[450px] custom-scrollbar scrollbar-thin ${isDemo ? 'bg-amber-500/5 border-amber-500/10 text-amber-500/90' : 'bg-secondary/5 border-secondary/10 text-secondary/90'}`}>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-text/10 grayscale">
                    <span className="text-8xl mb-4 select-none opacity-20">📟</span>
                    <p className="uppercase tracking-[0.4em] text-sm">Offline_Buffer</p>
                  </div>
                )}
              </div>

              {status && (
                <div className="mt-8 pt-6 border-t border-primary/10">
                  <p className="text-[10px] text-primary/40 uppercase font-mono mb-2">Bridge_Protocol_Status</p>
                  <div className="flex items-center gap-3">
                    <span className={`animate-pulse ${isDemo ? 'text-amber-500' : 'text-primary'}`}>●</span>
                    <p className="text-xs text-text/70 italic font-mono truncate">{status}</p>
                  </div>
                </div>
              )}

              <div className={`absolute bottom-2 right-8 opacity-5 font-mono text-[80px] pointer-events-none select-none ${isDemo ? 'text-amber-500' : ''}`}>SYNC</div>
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="absolute inset-x-0 bottom-[-20px] pointer-events-none flex justify-center">
          <div className="bg-amber-500 text-black text-[10px] font-black px-12 py-1 uppercase tracking-[0.8em] rounded-b-2xl shadow-2xl">
            Legacy_Sandbox
          </div>
        </div>
      )}
    </div>
  );
};

export default LegacyIntegration;
