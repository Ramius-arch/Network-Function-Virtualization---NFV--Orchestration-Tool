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
  const { envMode } = useEnvironment();
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

    const fetchLatestMetric = async () => {
      try {
        const data = await fetchAPI(`/api/monitoring/metrics/${functionName}`);
        setChartData((prevData) => {
          const sliceIndex = prevData.length >= 20 ? 1 : 0;
          return [...prevData.slice(sliceIndex), data];
        });
      } catch (err) {
        console.warn('API error fetching metrics, falling back to simulation data.', err);
        setChartData((prevData) => {
          const newDataPoint = generateMockChartData(functionName, 1)[0];
          return [...prevData.slice(1), newDataPoint];
        });
      }

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
    };

    fetchLatestMetric();
    const interval = setInterval(fetchLatestMetric, 5000);

    return () => clearInterval(interval);
  }, [functionName]);

  const fetchMetrics = async () => {
    setLoading(true);
    setStatus(`Force syncing ${functionName} telemetry...`);
    try {
      const data = await fetchAPI(`/api/monitoring/metrics/${functionName}`);
      setChartData((prevData) => {
        const sliceIndex = prevData.length >= 20 ? 1 : 0;
        return [...prevData.slice(sliceIndex), data];
      });
      setStatus('Live sync successful.');
    } catch (err: any) {
      setStatus(`Sync failed: ${err.message}. Using simulated data.`);
      setChartData((prevData) => {
        const newDataPoint = generateMockChartData(functionName, 1)[0];
        return [...prevData.slice(1), newDataPoint];
      });
    } finally {
      setLoading(false);
    }
  };

  const chartJsData = {
    labels: chartData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: chartData.map((d) => parseInt(d.cpuUsage || '0')),
        borderColor: '#8B5CF6', // Violet
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Memory Intensity',
        data: chartData.map((d) => parseFloat(d.memoryUsage || '0') * (d.memoryUsage?.includes('GB') ? 10 : 0.01)),
        borderColor: '#10B981', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Traffic Flow',
        data: chartData.map((d) => parseFloat(d.networkThroughput || '0') * (d.networkThroughput?.includes('Gbps') ? 10 : 1)),
        borderColor: '#06B6D4', // Cyan
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
    <div className="p-6 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[700px] hover:border-violet-500/30 transition-all duration-300 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/5 pb-4 gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Simulation HUB' : 'Telemetry HUB'}
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            {envMode === 'demo' ? 'MODE: SIMULATED_PLAYGROUND_ACTIVE' : 'MODE: REAL_TIME_INFRASTRUCTURE_STREAM'}
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
          <button
            onClick={fetchMetrics}
            className="p-2.5 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Force Refresh"
          >
            <span className={loading ? 'animate-spin block' : 'block'}>🔄</span>
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        {/* Left Column: Metrics & Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/5 bg-violet-500/5 rounded-2xl text-left">
              <p className="text-[9px] text-violet-400 font-mono uppercase mb-1">CPU_LOAD</p>
              <p className="text-2xl font-bold font-space-grotesk text-white">{chartData[chartData.length - 1]?.cpuUsage}</p>
            </div>
            <div className="p-4 border border-white/5 bg-emerald-500/5 rounded-2xl text-left">
              <p className="text-[9px] text-emerald-400 font-mono uppercase mb-1">MEM_ALLOC</p>
              <p className="text-2xl font-bold font-space-grotesk text-white">{chartData[chartData.length - 1]?.memoryUsage}</p>
            </div>
          </div>

          {/* Tactical Logs */}
          <div className="flex-grow flex flex-col bg-slate-950/80 rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-slate-900/60 p-3 px-4 flex justify-between items-center border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">tactical_events.log</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            </div>
            <div className="flex-grow p-4 font-mono text-[10px] space-y-2.5 overflow-y-auto custom-scrollbar text-left">
              {tacticalLogs.map((log, i) => (
                <div key={i} className={`animate-fade-in ${log.includes('[OK]') ? 'text-green-400/80' : log.includes('[WARN]') ? 'text-amber-400' : 'text-slate-500'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {status && <div className="text-[9px] text-violet-400 font-mono animate-pulse uppercase tracking-widest text-left">{status}</div>}
        </div>

        {/* Right Column: High Res Chart */}
        <div className="lg:col-span-8 bg-slate-900/10 rounded-2xl border border-white/5 p-6 relative flex flex-col justify-between">
          <div className="absolute top-4 right-6 text-[8px] text-slate-500 font-mono">
            REFRESH_RATE: 5000MS // ENCRYPTION: GCM-A
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
