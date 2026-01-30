import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useEnvironment } from '../context/EnvironmentContext';
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
  Filler,
);

interface Metric {
  functionName: string;
  cpuUsage?: string;
  memoryUsage?: string;
  networkThroughput?: string;
  timestamp: string;
}

// VNF Profiles for realistic data generation
const VNF_PROFILES: Record<string, { cpuRange: [number, number], memRange: [number, number], trafficRange: [number, number] }> = {
  'Firewall': { cpuRange: [20, 45], memRange: [4000, 8000], trafficRange: [800, 1200] },
  'DPI Engine': { cpuRange: [70, 95], memRange: [12000, 16000], trafficRange: [1500, 2500] },
  'Load Balancer': { cpuRange: [10, 25], memRange: [2000, 4000], trafficRange: [2000, 3500] },
  'Transcoder': { cpuRange: [85, 99], memRange: [8000, 12000], trafficRange: [400, 800] },
  'Edge Bridge': { cpuRange: [5, 15], memRange: [1000, 2000], trafficRange: [5000, 8000] }
};

const generateMockChartData = (funcName: string, count: number = 20) => {
  const profile = VNF_PROFILES[funcName] || { cpuRange: [10, 50], memRange: [1000, 5000], trafficRange: [100, 1000] };
  const data = [];
  for (let i = 0; i < count; i++) {
    const cpu = Math.floor(Math.random() * (profile.cpuRange[1] - profile.cpuRange[0])) + profile.cpuRange[0];
    const memory = Math.floor(Math.random() * (profile.memRange[1] - profile.memRange[0])) + profile.memRange[0];
    const network = Math.floor(Math.random() * (profile.trafficRange[1] - profile.trafficRange[0])) + profile.trafficRange[0];
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

const Monitoring: React.FC = () => {
  const { isDemo } = useEnvironment();
  const [functionName, setFunctionName] = useState('Firewall');
  const [chartData, setChartData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [tacticalLogs, setTacticalLogs] = useState<string[]>([]);

  useEffect(() => {
    setChartData(generateMockChartData(functionName));

    // Generate initial tactical logs
    const initialLogs = [
      `[INFO] Target function context switched to ${functionName}`,
      `[OK] Secure handshaking completed with ${functionName}_VNF_NODE`,
      `[OK] Telemetry stream established at 10s resolution`,
      `[INFO] Baselining traffic patterns for current cycle...`
    ];
    setTacticalLogs(initialLogs);

    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newDataPoint = generateMockChartData(functionName, 1)[0];
        return [...prevData.slice(1), newDataPoint];
      });

      // Randomized log entries
      if (Math.random() > 0.7) {
        const randomEvents = [
          `[OK] Heartbeat received from cluster primary`,
          `[INFO] Minor jitter detected but corrected by bridge`,
          `[WARN] Cache hit rate dropped to 85%`,
          `[OK] Policy sync complete across 4 nodes`
        ];
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        setTacticalLogs(prev => [event, ...prev.slice(0, 15)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [functionName]);

  const fetchMetrics = async () => {
    setLoading(true);
    setStatus(`Force syncing ${functionName} telemetry...`);
    setTimeout(() => {
      setStatus('Live sync successful.');
      setLoading(false);
    }, 800);
  };

  const chartJsData = {
    labels: chartData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: chartData.map((d) => parseInt(d.cpuUsage || '0')),
        borderColor: '#00FFFF',
        backgroundColor: 'rgba(0, 255, 255, 0.15)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Memory Intensity',
        data: chartData.map((d) => parseFloat(d.memoryUsage || '0') * (d.memoryUsage?.includes('GB') ? 10 : 0.01)),
        borderColor: '#00FF00',
        backgroundColor: 'rgba(0, 255, 0, 0.05)',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Traffic Flow',
        data: chartData.map((d) => parseFloat(d.networkThroughput || '0') * (d.networkThroughput?.includes('Gbps') ? 10 : 1)),
        borderColor: '#FF00FF',
        backgroundColor: 'rgba(255, 0, 255, 0.05)',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#E0FFFF', font: { family: 'Orbitron', size: 10 } } },
      tooltip: { backgroundColor: 'rgba(1, 11, 19, 0.9)', borderColor: '#00FFFF', borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 9 } } },
    },
  };

  return (
    <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl flex flex-col h-[700px] hover-glow transition-all">
      <div className="flex justify-between items-end mb-8 border-b border-primary/10 pb-4">
        <div>
          <h2 className={`text-3xl font-bold font-orbitron uppercase tracking-widest ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
            {isDemo ? 'Simulation HUB' : 'Telemetry HUB'}
          </h2>
          <p className="text-[10px] text-text/30 font-mono mt-1">
            {isDemo ? 'MODE: SIMULATED_PLAYGROUND_ACTIVE' : 'MODE: REAL_TIME_INFRASTRUCTURE_STREAM'}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            className="bg-primary/10 border border-primary/30 rounded px-4 py-2 text-xs font-bold text-primary outline-none hover:bg-primary/20 cursor-pointer transition-all uppercase font-orbitron"
          >
            {Object.keys(VNF_PROFILES).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <button
            onClick={fetchMetrics}
            className="p-2 border border-primary/30 rounded hover:bg-primary/20 text-primary transition-all"
            title="Force Refresh"
          >
            <span className={loading ? 'animate-spin block' : ''}>🔄</span>
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        {/* Left Column: Metrics & Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-primary/10 bg-primary/5 rounded-xl">
              <p className="text-[9px] text-primary/60 font-mono uppercase mb-1">CPU_LOAD</p>
              <p className="text-2xl font-bold font-orbitron">{chartData[chartData.length - 1]?.cpuUsage}</p>
            </div>
            <div className="p-4 border border-secondary/10 bg-secondary/5 rounded-xl">
              <p className="text-[9px] text-secondary/60 font-mono uppercase mb-1">MEM_ALLOC</p>
              <p className="text-2xl font-bold font-orbitron">{chartData[chartData.length - 1]?.memoryUsage}</p>
            </div>
          </div>

          {/* Tactical Logs */}
          <div className="flex-grow flex flex-col bg-black/40 rounded-xl border border-primary/5 overflow-hidden">
            <div className="bg-primary/10 p-2 px-4 flex justify-between items-center">
              <span className="text-[10px] font-bold text-primary font-mono lowercase">tactical_events.log</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            </div>
            <div className="flex-grow p-4 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar">
              {tacticalLogs.map((log, i) => (
                <div key={i} className={`animate-fade-in ${log.includes('[OK]') ? 'text-secondary/70' : log.includes('[WARN]') ? 'text-accent' : 'text-text/50'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {status && <div className="text-[9px] text-primary font-mono animate-pulse uppercase tracking-widest">{status}</div>}
        </div>

        {/* Right Column: High Res Chart */}
        <div className="lg:col-span-8 bg-black/20 rounded-2xl border border-primary/5 p-6 relative flex flex-col">
          <div className="absolute top-4 right-6 text-[8px] text-text/20 font-mono">
            REFRESH_RATE: 5000MS // ENCRYPTION: GCM-A
          </div>
          <div className="flex-grow">
            <Line data={chartJsData} options={chartJsOptions} />
          </div>
          <div className="mt-4 flex justify-between items-center text-[9px] text-text/30 font-mono uppercase border-t border-primary/5 pt-4">
            <span>Historical_Buffer: 2hrs</span>
            <span>X-Axis: Real_Time_Standard</span>
            <span>Y-Axis: Relative_Intensity [0-100]</span>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 bg-amber-500 text-black text-[10px] font-bold px-4 py-1 uppercase tracking-widest animate-pulse">
            Demo Section // Showing All Components
          </div>
          <div className="absolute inset-0 bg-amber-500/5 [background:repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(245,158,11,0.05)_20px,rgba(245,158,11,0.05)_40px)]"></div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
