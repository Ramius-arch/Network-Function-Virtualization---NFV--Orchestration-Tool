import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Metric {
  functionName: string;
  cpuUsage?: string;
  memoryUsage?: string;
  networkThroughput?: string;
  timestamp: string;
}

const VNF_PROFILES: Record<string, { cpuRange: [number, number], memRange: [number, number], trafficRange: [number, number] }> = {
  'Firewall': { cpuRange: [20, 45], memRange: [4000, 8000], trafficRange: [800, 1200] },
  'DPI Engine': { cpuRange: [70, 95], memRange: [12000, 16000], trafficRange: [1500, 2500] },
  'Load Balancer': { cpuRange: [10, 25], memRange: [2000, 4000], trafficRange: [2000, 3500] },
  'Transcoder': { cpuRange: [85, 99], memRange: [8000, 12000], trafficRange: [400, 800] },
  'Edge Bridge': { cpuRange: [5, 15], memRange: [1000, 2000], trafficRange: [5000, 8000] }
};

const Monitoring: React.FC = () => {
  const { envMode } = useEnvironment();
  const [functionName, setFunctionName] = useState('Firewall');
  const [chartData, setChartData] = useState<Metric[]>([]);
  const [status, setStatus] = useState('');
  const [tacticalLogs, setTacticalLogs] = useState<string[]>([]);

  // Simulation controls state (for custom scenarios)
  const [activeScenario, setActiveScenario] = useState<'nominal' | 'ddos' | 'failover'>('nominal');
  const [customCpuMultiplier, setCustomCpuMultiplier] = useState<number>(1);
  const [customTrafficMultiplier, setCustomTrafficMultiplier] = useState<number>(1);
  const [customMemoryLimit, setCustomMemoryLimit] = useState<number>(1);

  // Generate mock chart data incorporating multipliers
  const generateRealisticChartData = (funcName: string, count: number = 20) => {
    const profile = VNF_PROFILES[funcName] || { cpuRange: [10, 50], memRange: [1000, 5000], trafficRange: [100, 1000] };
    const data = [];
    
    // Set variables based on active scenario
    let cpuScale = customCpuMultiplier;
    let trafficScale = customTrafficMultiplier;
    let memScale = customMemoryLimit;

    if (activeScenario === 'ddos') {
      cpuScale = 2.2;
      trafficScale = 5.5;
    } else if (activeScenario === 'failover') {
      cpuScale = 0.15; // backup node active
      trafficScale = 0.05;
    }

    for (let i = 0; i < count; i++) {
      let cpu = Math.floor(Math.random() * (profile.cpuRange[1] - profile.cpuRange[0])) + profile.cpuRange[0];
      let memory = Math.floor(Math.random() * (profile.memRange[1] - profile.memRange[0])) + profile.memRange[0];
      let network = Math.floor(Math.random() * (profile.trafficRange[1] - profile.trafficRange[0])) + profile.trafficRange[0];

      // Apply scales
      cpu = Math.min(Math.floor(cpu * cpuScale), 100);
      memory = Math.floor(memory * memScale);
      network = Math.floor(network * trafficScale);

      data.push({
        functionName: funcName,
        cpuUsage: `${cpu}%`,
        memoryUsage: memory > 1024 ? `${(memory / 1024).toFixed(1)}GB` : `${memory}MB`,
        networkThroughput: network > 1000 ? `${(network / 1000).toFixed(1)}Gbps` : `${network}Mbps`,
        timestamp: new Date(Date.now() - (count - 1 - i) * 10 * 1000).toISOString(),
      });
    }
    return data;
  };

  useEffect(() => {
    setChartData(generateRealisticChartData(functionName));

    // Initial log setups
    const initialLogs = [
      `[INFO] Target function context switched to ${functionName}`,
      `[OK] Secure peering established with VIM controller`,
      `[OK] Real-time metrics streaming initialized successfully`,
      `[INFO] Baselining environment metrics...`
    ];
    setTacticalLogs(initialLogs);

    const fetchLatestMetric = async () => {
      try {
        const data = await fetchAPI(`/api/monitoring/metrics/${functionName}`);
        
        // Scale live metrics if multipliers are active
        let cpu = parseInt(data.cpuUsage || '0');
        let network = parseFloat(data.networkThroughput || '0');

        let cpuScale = customCpuMultiplier;
        let trafficScale = customTrafficMultiplier;

        if (activeScenario === 'ddos') {
          cpuScale = 2.2;
          trafficScale = 5.5;
        } else if (activeScenario === 'failover') {
          cpuScale = 0.15;
          trafficScale = 0.05;
        }

        cpu = Math.min(Math.floor(cpu * cpuScale), 100);
        network = Math.floor(network * trafficScale);

        const scaledData: Metric = {
          functionName,
          cpuUsage: `${cpu}%`,
          memoryUsage: data.memoryUsage,
          networkThroughput: data.networkThroughput?.includes('Gb') ? `${network}Gbps` : `${network}Mbps`,
          timestamp: new Date().toISOString()
        };

        setChartData((prevData) => {
          const sliceIndex = prevData.length >= 20 ? 1 : 0;
          return [...prevData.slice(sliceIndex), scaledData];
        });
      } catch (err) {
        setChartData((prevData) => {
          const newDataPoint = generateRealisticChartData(functionName, 1)[0];
          return [...prevData.slice(1), newDataPoint];
        });
      }

      // Scenario dynamic logs
      if (Math.random() > 0.6) {
        let event = '';
        if (activeScenario === 'ddos') {
          const alertEvents = [
            `[ALERT] Massive traffic spike: packet count exceeded limit!`,
            `[ALERT] Core Ingress interface experiencing packet drops`,
            `[WARN] CPU Core temperature throttling triggered!`,
            `[ALERT] Anti-DDoS rate limiter engaged on Edge Firewall`
          ];
          event = alertEvents[Math.floor(Math.random() * alertEvents.length)];
        } else if (activeScenario === 'failover') {
          const failoverEvents = [
            `[WARN] Heartbeat missing on Primary VNF node.`,
            `[INFO] Running local network failover routing checks...`,
            `[OK] Standby secondary interface loaded. Peering OK.`,
            `[OK] Redirected 100% of egress traffic to virtualized backup`
          ];
          event = failoverEvents[Math.floor(Math.random() * failoverEvents.length)];
        } else {
          const normalEvents = [
            `[OK] Heartbeat received from target virtualization node`,
            `[INFO] Cache hit intensity stable at 94%`,
            `[OK] Flow tables synchronized across clusters`,
            `[INFO] Average latency jitter within limits (4.2ms)`
          ];
          event = normalEvents[Math.floor(Math.random() * normalEvents.length)];
        }
        setTacticalLogs(prev => [event, ...prev.slice(0, 15)]);
      }
    };

    fetchLatestMetric();
    const interval = setInterval(fetchLatestMetric, 4000);

    return () => clearInterval(interval);
  }, [functionName, activeScenario, customCpuMultiplier, customTrafficMultiplier, customMemoryLimit]);

  const triggerScenario = (scenario: 'nominal' | 'ddos' | 'failover') => {
    setActiveScenario(scenario);
    if (scenario === 'nominal') {
      setCustomCpuMultiplier(1);
      setCustomTrafficMultiplier(1);
      setCustomMemoryLimit(1);
      setStatus('Scenario updated: Nominal Operations.');
    } else if (scenario === 'ddos') {
      setStatus('Alert! Simulating DDoS Stress Test...');
    } else if (scenario === 'failover') {
      setStatus('Warning! Simulating Core Node Outage Failover...');
    }
  };

  const chartJsData = {
    labels: chartData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: chartData.map((d) => parseInt(d.cpuUsage || '0')),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Memory Intensity',
        data: chartData.map((d) => parseFloat(d.memoryUsage || '0') * (d.memoryUsage?.includes('GB') ? 10 : 0.1)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Traffic Flow',
        data: chartData.map((d) => parseFloat(d.networkThroughput || '0') * (d.networkThroughput?.includes('Gb') ? 10 : 1)),
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.05)',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#F8FAFC', font: { family: 'Space Grotesk', size: 10 } } },
      tooltip: { backgroundColor: 'rgba(3, 7, 18, 0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 9 } } },
    },
  };

  return (
    <div className="p-6 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl flex flex-col min-h-[850px] hover:border-violet-500/30 transition-all duration-300 relative text-left">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Simulation Control Panel' : 'Telemetry HUB'}
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            {envMode === 'demo' ? 'MODE: LIVE_SIMULATOR_SANDBOX' : 'MODE: REAL_TIME_INFRASTRUCTURE_STREAM'}
          </p>
        </div>
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <select
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 outline-none hover:bg-slate-800 cursor-pointer transition-all uppercase font-space-grotesk"
          >
            {Object.keys(VNF_PROFILES).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>

      {/* ── TOP: Interactive Simulation Scenarios (Demo mode) ──────────────── */}
      {envMode === 'demo' && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-6">
          <button
            onClick={() => triggerScenario('nominal')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'nominal' ? 'bg-violet-600/10 border-violet-500/40 text-violet-300' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-850'
            }`}
          >
            <span className="text-md block mb-1">🟢 Nominal State</span>
            <span className="text-[9px] font-mono block">Standard network flows and baseline resource workloads.</span>
          </button>
          <button
            onClick={() => triggerScenario('ddos')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'ddos' ? 'bg-red-600/10 border-red-500/40 text-red-300' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-850'
            }`}
          >
            <span className="text-md block mb-1">🔥 DDoS Stress Test</span>
            <span className="text-[9px] font-mono block">Inbound traffic spikes to 5x, throttling CPU and triggering alert logs.</span>
          </button>
          <button
            onClick={() => triggerScenario('failover')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'failover' ? 'bg-amber-600/10 border-amber-500/40 text-amber-300' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-850'
            }`}
          >
            <span className="text-md block mb-1">⚠️ Failover Recovery</span>
            <span className="text-[9px] font-mono block">Simulate primary core node outage and check standby failover.</span>
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        
        {/* Left Column: Metrics & Sliders */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/5 bg-violet-500/5 rounded-2xl">
              <p className="text-[9px] text-violet-400 font-mono uppercase mb-1">CPU_LOAD</p>
              <p className="text-2xl font-bold font-space-grotesk text-white">{chartData[chartData.length - 1]?.cpuUsage}</p>
            </div>
            <div className="p-4 border border-white/5 bg-emerald-500/5 rounded-2xl">
              <p className="text-[9px] text-emerald-400 font-mono uppercase mb-1">MEM_ALLOC</p>
              <p className="text-2xl font-bold font-space-grotesk text-white">{chartData[chartData.length - 1]?.memoryUsage}</p>
            </div>
          </div>

          {/* Interactive Workload Sliders (Demo Mode) */}
          {envMode === 'demo' && activeScenario === 'nominal' && (
            <div className="p-5 border border-white/5 bg-slate-900/30 rounded-2xl space-y-4">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest border-b border-white/5 pb-2">Manual Workload Injection</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>TRAFFIC INFLOW</span>
                  <span>{customTrafficMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range" min="1" max="10" step="0.5"
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  value={customTrafficMultiplier}
                  onChange={(e) => setCustomTrafficMultiplier(parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>CPU WORKLOAD</span>
                  <span>{customCpuMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range" min="1" max="3" step="0.1"
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  value={customCpuMultiplier}
                  onChange={(e) => setCustomCpuMultiplier(parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>MEMORY PRESSURE</span>
                  <span>{customMemoryLimit.toFixed(1)}x</span>
                </div>
                <input
                  type="range" min="1" max="2" step="0.1"
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  value={customMemoryLimit}
                  onChange={(e) => setCustomMemoryLimit(parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Tactical Logs */}
          <div className="flex-grow flex flex-col bg-slate-950/80 rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-slate-900/60 p-3 px-4 flex justify-between items-center border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">tactical_events.log</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            </div>
            <div className="flex-grow p-4 font-mono text-[10px] space-y-2.5 overflow-y-auto max-h-[220px] custom-scrollbar">
              {tacticalLogs.map((log, i) => (
                <div key={i} className={`animate-fade-in ${log.includes('[ALERT]') ? 'text-red-400 font-bold' : log.includes('[WARN]') ? 'text-amber-400' : log.includes('[OK]') ? 'text-green-400/80' : 'text-slate-500'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {status && <div className="text-[9px] text-violet-400 font-mono animate-pulse uppercase tracking-widest">{status}</div>}
        </div>

        {/* Right Column: High Res Chart */}
        <div className="lg:col-span-8 bg-slate-900/10 rounded-2xl border border-white/5 p-6 relative flex flex-col justify-between">
          <div className="absolute top-4 right-6 text-[8px] text-slate-500 font-mono">
            REFRESH_RATE: 4000MS // ENCRYPTION: SECURE
          </div>
          <div className="flex-grow h-full min-h-[350px]">
            <Line data={chartJsData} options={chartJsOptions} />
          </div>
          <div className="mt-4 flex justify-between items-center text-[9px] text-slate-500 font-mono uppercase border-t border-white/5 pt-4">
            <span>Historical_Buffer: 2hrs</span>
            <span>X-Axis: Real_Time_Standard</span>
            <span>Y-Axis: Relative_Intensity [0-100]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
