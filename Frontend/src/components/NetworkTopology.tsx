import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeTooltip from './NodeTooltip';
import { useEnvironment } from '../context/EnvironmentContext';
import { fetchAPI } from '../utils/api';
import { useNotifications } from '../context/NotificationContext';

// --- BASELINE NETWORK NODES ---
const baselineNodes: Node[] = [
  {
    id: 'ext-ingress',
    position: { x: 50, y: 250 },
    data: {
      label: 'Public Internet',
      description: 'Untrusted external traffic entering from global transit providers.',
      status: 'active',
      metrics: { cpu: 'N/A', memory: 'N/A', traffic: '2.4Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#EC4899', 
      border: '1.5px solid rgba(236, 72, 153, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px', 
      boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
  {
    id: 'ext-gw',
    position: { x: 250, y: 250 },
    data: {
      label: 'Edge Gateway',
      description: 'High-availability BGP peering and DDoS mitigation scrubbing center.',
      status: 'active',
      metrics: { cpu: '14%', memory: '4GB', traffic: '2.4Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#EC4899', 
      border: '1.5px solid rgba(236, 72, 153, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px', 
      boxShadow: '0 8px 32px rgba(236, 72, 153, 0.05)',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
  {
    id: 'fw-v1',
    position: { x: 450, y: 150 },
    data: {
      label: 'Core Firewall-A',
      description: 'Stateful inspection and ACL enforcement for primary ingress.',
      status: 'active',
      metrics: { cpu: '32%', memory: '8GB', traffic: '1.2Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#8B5CF6', 
      border: '1.5px solid rgba(139, 92, 246, 0.4)', 
      borderRadius: '50%', 
      width: 120, 
      height: 120, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: '10px', 
      textAlign: 'center', 
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '6px'
    },
  },
  {
    id: 'fw-v2',
    position: { x: 450, y: 350 },
    data: {
      label: 'Core Firewall-B',
      description: 'Redundant firewall node for high-availability failover.',
      status: 'standby',
      metrics: { cpu: '5%', memory: '8GB', traffic: '0b/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#8B5CF6', 
      border: '1.5px dashed rgba(139, 92, 246, 0.2)', 
      borderRadius: '50%', 
      width: 120, 
      height: 120, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: '10px', 
      textAlign: 'center', 
      opacity: 0.6,
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '6px'
    },
  },
  {
    id: 'ids-node',
    position: { x: 650, y: 250 },
    data: {
      label: 'IDS/IPS Cluster',
      description: 'Signature-based threat detection and flow analysis engine.',
      status: 'warning',
      metrics: { cpu: '82%', memory: '16GB', traffic: '2.1Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#8B5CF6', 
      border: '1.5px solid rgba(139, 92, 246, 0.4)', 
      borderRadius: '50%', 
      width: 100, 
      height: 100, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: '10px', 
      textAlign: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '6px'
    },
  },
  {
    id: 'lb-primary',
    position: { x: 850, y: 250 },
    data: {
      label: 'L7 Load Balancer',
      description: 'Application-aware distribution for internal microservices.',
      status: 'active',
      metrics: { cpu: '45%', memory: '4GB', traffic: '1.8Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#06B6D4', 
      border: '1.5px solid rgba(6, 182, 212, 0.4)', 
      borderRadius: '50%', 
      width: 100, 
      height: 100, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontSize: '10px', 
      textAlign: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '6px'
    },
  },
  {
    id: 'cache-layer',
    position: { x: 1050, y: 150 },
    data: {
      label: 'Global Cache',
      description: 'In-memory data acceleration and content distribution.',
      status: 'active',
      metrics: { cpu: '12%', memory: '128GB', traffic: '800Mb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#06B6D4', 
      border: '1.5px solid rgba(6, 182, 212, 0.4)', 
      borderRadius: '16px', 
      width: 120, 
      fontSize: '10px',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
  {
    id: 'worker-v1',
    position: { x: 1050, y: 350 },
    data: {
      label: 'VNF-Worker-01',
      description: 'General purpose compute node for dynamic function chain tasks.',
      status: 'active',
      metrics: { cpu: '22%', memory: '4GB', traffic: '120Mb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#06B6D4', 
      border: '1.5px solid rgba(6, 182, 212, 0.4)', 
      borderRadius: '16px', 
      width: 120, 
      fontSize: '10px',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
  {
    id: 'edge-bridge-east',
    position: { x: 1300, y: 150 },
    data: {
      label: 'East-Region-Bridge',
      description: 'Distributed fiber bridge for East Coast infrastructure peering.',
      status: 'active',
      metrics: { cpu: '8%', memory: '2GB', traffic: '1.1Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#10B981', 
      border: '1.5px solid rgba(16, 185, 129, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
  {
    id: 'egress-node',
    position: { x: 1550, y: 250 },
    data: {
      label: 'Core Egress',
      description: 'Internal-to-external NAT and logging for outgoing traffic.',
      status: 'active',
      metrics: { cpu: '5%', memory: '512MB', traffic: '2.2Gb/s' }
    },
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#10B981', 
      border: '1.5px solid rgba(16, 185, 129, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px', 
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
  },
];

const baselineEdges: Edge[] = [
  { id: 'e-ext-gw', source: 'ext-ingress', target: 'ext-gw', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC4899' } },
  { id: 'e-gw-fw1', source: 'ext-gw', target: 'fw-v1', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },
  { id: 'e-gw-fw2', source: 'ext-gw', target: 'fw-v2', style: { stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4,4' } },
  { id: 'e-fw1-ids', source: 'fw-v1', target: 'ids-node', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },
  { id: 'e-fw2-ids', source: 'fw-v2', target: 'ids-node', style: { stroke: '#8B5CF6', strokeWidth: 1 } },
  { id: 'e-ids-lb', source: 'ids-node', target: 'lb-primary', animated: true, style: { stroke: '#06B6D4', strokeWidth: 2 } },
  { id: 'e-lb-cache', source: 'lb-primary', target: 'cache-layer', animated: true, style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: 'e-lb-worker', source: 'lb-primary', target: 'worker-v1', animated: true, style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: 'e-cache-east', source: 'cache-layer', target: 'edge-bridge-east', animated: true, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'e-east-exit', source: 'edge-bridge-east', target: 'egress-node', animated: true, style: { stroke: '#10B981', strokeWidth: 1.5 } },
];

const NetworkTopology: React.FC = () => {
  const { envMode } = useEnvironment();
  const { addAlert } = useNotifications();
  
  // States
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(baselineNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(baselineEdges);
  const [hoveredNode, setHoveredNode] = useState<{ node: Node; x: number; y: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Floating Spawn Form
  const [spawnType, setSpawnType] = useState<'Firewall' | 'Router' | 'Cache' | 'Balancer'>('Firewall');
  const [spawnName, setSpawnName] = useState('vnf-custom-edge');
  const [spawnCpu, setSpawnCpu] = useState('2 Cores');
  const [spawnMem, setSpawnMem] = useState('4GB');

  // Load custom network functions from localStorage (matches Provisioning UI state)
  const syncCustomInstances = useCallback(() => {
    try {
      const saved = localStorage.getItem('atomic_network_functions');
      if (saved) {
        const instances = JSON.parse(saved);
        setNodes((prevNodes) => {
          // Keep baseline nodes
          const baselineIds = baselineNodes.map(n => n.id);
          const filteredPrev = prevNodes.filter(n => baselineIds.includes(n.id) || n.id.startsWith('custom-'));
          
          // Generate node positions for custom instances
          const updatedNodes = [...filteredPrev];
          instances.forEach((inst: any, idx: number) => {
            const nodeId = `custom-${inst.name}`;
            if (!updatedNodes.some(n => n.id === nodeId)) {
              updatedNodes.push({
                id: nodeId,
                position: { x: 750 + (idx * 60), y: 100 + (idx * 80) },
                data: {
                  label: inst.name,
                  description: `Custom deployed function. Image: ${inst.image}`,
                  status: inst.status || 'active',
                  metrics: { cpu: inst.cpu || '2 Cores', memory: inst.memory || '4GB', traffic: '120Mb/s' }
                },
                style: {
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  color: '#8B5CF6',
                  border: '1.5px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '16px',
                  width: 130,
                  fontSize: '10px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  padding: '8px',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
                }
              });
            }
          });
          return updatedNodes;
        });
      }
    } catch (e) {
      console.warn('Error synchronizing local storage nodes:', e);
    }
  }, [setNodes]);

  useEffect(() => {
    syncCustomInstances();
    
    // Periodically fetch custom instances and dynamic nodes
    const interval = setInterval(() => {
      syncCustomInstances();
      
      // If we are in Live Mode, call backend
      if (envMode === 'live') {
        fetchAPI('/api/network-function')
          .then((functions: any) => {
            const dynamicNodes = functions.map((fn: any, index: number) => ({
              id: `dynamic-${fn.functionName}`,
              position: { x: 600 + (index * 150), y: 150 + (index % 2 === 0 ? 40 : -40) },
              data: {
                label: fn.functionName,
                description: `Dynamic VNF. Specs: ${JSON.stringify(fn.specs)}`,
                status: fn.state?.status || 'active',
                metrics: { cpu: fn.specs?.cpu || '2 Cores', memory: fn.specs?.memory || '4GB', traffic: '100Mb/s' }
              },
              style: { 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                color: '#8B5CF6', 
                border: '1.5px dashed rgba(139, 92, 246, 0.4)', 
                borderRadius: '16px', 
                width: 120, 
                fontSize: '10px',
                fontFamily: 'Space Grotesk, sans-serif',
                padding: '8px'
              },
            }));

            setNodes((prevNodes) => {
              const cleaned = prevNodes.filter(n => !n.id.startsWith('dynamic-'));
              return [...cleaned, ...dynamicNodes];
            });
          })
          .catch(err => console.warn('Syncing live node feed failed:', err));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [envMode, syncCustomInstances, setNodes]);

  // Connect edges interactively
  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const color = sourceNode?.style?.color || '#8B5CF6';
      
      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        animated: true,
        style: { stroke: color, strokeWidth: 1.5 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, setEdges]
  );

  // Spawning custom nodes from the Floating Console
  const handleSpawnNode = () => {
    if (!spawnName.trim()) return;
    const nodeId = `custom-${spawnName.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Check duplication
    if (nodes.some(n => n.id === nodeId)) {
      alert('Node with this ID already exists!');
      return;
    }

    const color = spawnType === 'Firewall' ? '#8B5CF6' : spawnType === 'Balancer' ? '#06B6D4' : spawnType === 'Router' ? '#EC4899' : '#10B981';
    const borderRadius = spawnType === 'Firewall' || spawnType === 'Balancer' ? '50%' : '16px';
    const width = 120;
    const height = borderRadius === '50%' ? 120 : undefined;

    const newNode: Node = {
      id: nodeId,
      position: { x: 400 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: {
        label: spawnName,
        description: `Custom ${spawnType} provisioned on hypervisor sandbox.`,
        status: 'active',
        metrics: { cpu: spawnCpu, memory: spawnMem, traffic: '120Mb/s' }
      },
      style: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        color,
        border: `1.5px solid ${color}80`,
        borderRadius,
        width,
        height,
        display: height ? 'flex' : undefined,
        justifyContent: height ? 'center' : undefined,
        alignItems: height ? 'center' : undefined,
        textAlign: 'center',
        fontSize: '10px',
        fontFamily: 'Space Grotesk, sans-serif',
        padding: '8px',
        boxShadow: `0 8px 32px ${color}10`
      }
    };

    setNodes(prev => [...prev, newNode]);

    // Save to localStorage as a sync mock
    try {
      const saved = localStorage.getItem('atomic_network_functions');
      const instances = saved ? JSON.parse(saved) : [];
      instances.push({
        id: `inst-${Math.floor(Math.random() * 900 + 100)}`,
        name: spawnName,
        image: `atomic/vnf-${spawnType.toLowerCase()}:v1.0`,
        status: 'running',
        uptime: '0h 01m',
        cpu: spawnCpu,
        memory: spawnMem
      });
      localStorage.setItem('atomic_network_functions', JSON.stringify(instances));
    } catch (e) {}

    // Reset Name
    setSpawnName(`vnf-${spawnType.toLowerCase()}-${Math.floor(Math.random() * 90 + 10)}`);

    addAlert({
      title: `${spawnType} Spawned Successfully`,
      type: 'success',
      cause: `Operator action: Dynamic VNF [${spawnName}] provisioned onto the localized edge hypervisor.`,
      nextStep: 'Drag network flow links on the topology screen to route active traffic through this node.',
      link: '/topology',
      linkText: 'Inspect Live Links'
    });
  };

  // Node actions (Inject Fault / Terminate)
  const handleToggleFault = () => {
    if (!selectedNode) return;
    const isError = (selectedNode.data as any).status === 'error';
    const newStatus = isError ? 'active' : 'error';

    // Dispatch toast alert
    if (newStatus === 'error') {
      addAlert({
        title: 'VNF Service Health Failure',
        type: 'error',
        cause: `Manual fault injection: [${(selectedNode.data as any).label}] has transitioned to an error state. Packet loss is active.`,
        nextStep: 'Configure routing policy parameters in the Control Plane or scale up core hypervisor nodes.',
        link: '/operations',
        linkText: 'Apply Control Policies'
      });
    } else {
      addAlert({
        title: 'VNF Service Restored',
        type: 'success',
        cause: `Manual restoration: [${(selectedNode.data as any).label}] health state was successfully recovered.`,
        nextStep: 'Review real-time CPU and throughput flow metrics inside the Telemetry Hub.',
        link: '/monitoring',
        linkText: 'Open Telemetry Hub'
      });
    }

    // Update Node State
    setNodes(prevNodes => 
      prevNodes.map(n => {
        if (n.id === selectedNode.id) {
          const color = newStatus === 'error' ? '#EF4444' : (n.style?.color || '#8B5CF6');
          return {
            ...n,
            data: {
              ...n.data,
              status: newStatus,
              metrics: {
                ...(n.data.metrics as any),
                traffic: newStatus === 'error' ? 'OFFLINE' : '120Mb/s'
              }
            },
            style: {
              ...n.style,
              color,
              border: `1.5px solid ${color}80`,
              boxShadow: newStatus === 'error' ? '0 8px 32px rgba(239, 68, 68, 0.15)' : n.style?.boxShadow
            }
          };
        }
        return n;
      })
    );

    // Freeze or style connected edges
    setEdges(prevEdges => 
      prevEdges.map(e => {
        if (e.source === selectedNode.id || e.target === selectedNode.id) {
          return {
            ...e,
            animated: newStatus !== 'error',
            style: {
              ...e.style,
              stroke: newStatus === 'error' ? '#EF4444' : '#38bdf8',
              strokeWidth: newStatus === 'error' ? 2 : 1.5
            }
          };
        }
        return e;
      })
    );

    // Update selection ref
    setSelectedNode(null);
  };

  const handleTerminateNode = () => {
    if (!selectedNode) return;

    // Filter node out
    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));

    // Clear connected edges
    setEdges(prev => prev.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));

    // Clear VNF from local storage registry
    try {
      const saved = localStorage.getItem('atomic_network_functions');
      if (saved) {
        const instances = JSON.parse(saved);
        const filtered = instances.filter((i: any) => i.name !== selectedNode.data.label);
        localStorage.setItem('atomic_network_functions', JSON.stringify(filtered));
      }
    } catch (e) {}

    addAlert({
      title: 'VNF Resource Terminated',
      type: 'warning',
      cause: `Operator directive: container instances and network bridge gateways released for [${(selectedNode.data as any).label}].`,
      nextStep: 'Instantiate replacement virtual functions on the Provisioning page if capacity is degraded.',
      link: '/provisioning',
      linkText: 'Provision New VNF'
    });

    // Update selection ref
    setSelectedNode(null);
  };

  const onNodeMouseEnter = (_: React.MouseEvent, node: Node) => {
    setHoveredNode({ node, x: _.clientX, y: _.clientY });
  };

  return (
    <div className="h-full w-full relative flex flex-col md:flex-row min-h-[640px]">
      
      {/* ── LEFT: Topology Canvas ────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col relative bg-[#030712]">
        
        {/* Sub Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950/75 border-b border-white/5 backdrop-blur-md gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-bold font-space-grotesk text-white">
              {envMode === 'demo' ? 'Simulated Topology Sandbox' : 'Network Topology'}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">
              {envMode === 'demo' ? 'SANDBOX_ENVIRONMENT_ACTIVE' : 'Global_Infrastructure_View_v2.1'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 items-center">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400">Live_Sync</span>
            </div>
            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex flex-wrap gap-3">
              {[['#EC4899', 'Ingress'], ['#8B5CF6', 'Security'], ['#06B6D4', 'Data_Core'], ['#10B981', 'Egress']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-lg" style={{ backgroundColor: c }} />
                  <span className="text-[9px] text-slate-400 uppercase font-mono">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-grow w-full min-h-[550px] relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={() => setHoveredNode(null)}
            onNodeClick={(_, node) => setSelectedNode(node)}
            fitView
            colorMode="dark"
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls className="bg-slate-900 border border-white/10 text-white shadow-2xl rounded-xl" />
            <MiniMap
              className="bg-slate-900/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md"
              nodeStrokeColor={(n) => (n.style?.border as string)?.split(' ')[2] || '#8B5CF6'}
              nodeColor="#0b0f19"
              maskColor="rgba(3, 7, 18, 0.75)"
            />
            <Background color="#8B5CF6" gap={30} size={1} variant={BackgroundVariant.Dots} style={{ opacity: 0.05 }} />
          </ReactFlow>
        </div>

        {/* Bottom bar */}
        <div className="p-3 px-6 flex justify-between items-center text-[10px] text-slate-500 font-mono bg-slate-950/75 border-t border-white/5">
          <div className="flex gap-6">
            <span>STATIC_DOMAINS: 4</span>
            <span>TOTAL_NODES: {nodes.length}</span>
            <span>ACTIVE_FLOWS: {edges.filter(e => e.animated).length}</span>
          </div>
          <div className="flex gap-6">
            <span className="text-green-500/80 font-bold">SYSTEM_STABILITY: OPTIMAL</span>
            <span className="animate-pulse text-violet-400">DRAG CONNECTIONS TO LINK NODES</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Interactive Control Console (Demo Mode) ──────────────── */}
      {envMode === 'demo' && (
        <div className="w-full md:w-80 bg-slate-950/90 border-l border-white/5 p-6 flex flex-col justify-between backdrop-blur-xl shrink-0 text-left">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-[0.2em] uppercase">Simulation Console</span>
            </div>

            {/* Selected Node Panel */}
            {selectedNode ? (
              <div className="space-y-6 bg-slate-900/50 p-4 border border-white/5 rounded-2xl animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white font-space-grotesk">{(selectedNode.data as any).label}</h3>
                    <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5 block">{selectedNode.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-[9px] font-bold text-slate-500 hover:text-white"
                  >
                    CLOSE
                  </button>
                </div>
                
                <div className="space-y-1.5 text-xs font-mono text-slate-400">
                  <p>Status: <span className={(selectedNode.data as any).status === 'error' ? 'text-red-400 font-bold' : 'text-green-400'}>{((selectedNode.data as any).status as string)?.toUpperCase()}</span></p>
                  <p>CPU allocation: {(selectedNode.data as any).metrics?.cpu || 'N/A'}</p>
                  <p>Memory allocation: {(selectedNode.data as any).metrics?.memory || 'N/A'}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleToggleFault}
                    className="w-full py-2.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/25 text-amber-300 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all"
                  >
                    {(selectedNode.data as any).status === 'error' ? 'Restore Node State' : 'Inject Fault / Crash'}
                  </button>
                  <button
                    onClick={handleTerminateNode}
                    className="w-full py-2.5 bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all"
                  >
                    Terminate Node
                  </button>
                </div>
              </div>
            ) : (
              /* Spawn Node Form */
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Spawn Virtual Function</h3>
                  <p className="text-[9px] text-slate-500 font-mono mt-1 leading-relaxed">Dynamically allocate dynamic sandboxed functions directly into the running map topology.</p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase font-bold">Function Type</label>
                    <select
                      value={spawnType}
                      onChange={(e: any) => {
                        setSpawnType(e.target.value);
                        setSpawnName(`${e.target.value.toLowerCase()}-${Math.floor(Math.random() * 90 + 10)}`);
                      }}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none"
                    >
                      <option value="Firewall">Firewall Node</option>
                      <option value="Router">Access Router</option>
                      <option value="Cache">Content Cache</option>
                      <option value="Balancer">Load Balancer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase font-bold">Function Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                      value={spawnName}
                      onChange={(e) => setSpawnName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">CPU Core Allocation</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                        value={spawnCpu}
                        onChange={(e) => setSpawnCpu(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">Memory RAM Reserved</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                        value={spawnMem}
                        onChange={(e) => setSpawnMem(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSpawnNode}
                  className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all"
                >
                  Spawn Virtual Node
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Sandbox Operations</h4>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 border border-white/5 bg-slate-900/50 rounded-xl">
                <span className="text-[8px] text-slate-500 font-mono uppercase">Fault count</span>
                <p className="text-md font-bold text-white font-space-grotesk mt-0.5">
                  {nodes.filter(n => n.data.status === 'error').length} Nodes
                </p>
              </div>
              <div className="p-3 border border-white/5 bg-slate-900/50 rounded-xl">
                <span className="text-[8px] text-slate-500 font-mono uppercase">Custom VNFs</span>
                <p className="text-md font-bold text-white font-space-grotesk mt-0.5">
                  {nodes.filter(n => n.id.startsWith('custom-')).length} Active
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {hoveredNode && (
        <NodeTooltip
          label={(hoveredNode.node.data.label as string) || ''}
          description={(hoveredNode.node.data.description as string) || ''}
          status={(hoveredNode.node.data.status as any) || 'idle'}
          metrics={hoveredNode.node.data.metrics as any}
          visible={!!hoveredNode}
          position={{ x: hoveredNode.x, y: hoveredNode.y }}
        />
      )}
    </div>
  );
};

export default NetworkTopology;
