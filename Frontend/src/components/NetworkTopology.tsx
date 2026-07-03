import React, { useCallback, useState } from 'react';
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

const initialNodes: Node[] = [
  // --- EXTERNAL DOMAIN ---
  {
    id: 'ext-ingress',
    position: { x: 0, y: 250 },
    data: {
      label: 'Public Internet',
      description: 'Untrusted external traffic entering from global transit providers.',
      status: 'active',
      metrics: { cpu: 'N/A', memory: 'N/A', traffic: '2.4Gb/s' }
    },
    style: { backgroundColor: '#050505', color: '#FF00FF', border: '2px solid #FF00FF', borderRadius: '4px', width: 140, fontSize: '10px', boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)' },
  },
  {
    id: 'ext-gw',
    position: { x: 200, y: 250 },
    data: {
      label: 'Edge Gateway',
      description: 'High-availability BGP peering and DDoS mitigation scrubbing center.',
      status: 'active',
      metrics: { cpu: '14%', memory: '4GB', traffic: '2.4Gb/s' }
    },
    style: { backgroundColor: '#111', color: '#FF00FF', border: '2px solid #FF00FF', borderRadius: '4px', width: 140, fontSize: '10px', boxShadow: '0 0 10px rgba(255, 0, 255, 0.1)' },
  },

  // --- CORE SECURITY DOMAIN ---
  {
    id: 'fw-v1',
    position: { x: 400, y: 150 },
    data: {
      label: 'Core Firewall-A',
      description: 'Stateful inspection and ACL enforcement for primary ingress.',
      status: 'active',
      metrics: { cpu: '32%', memory: '8GB', traffic: '1.2Gb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px solid #00FFFF', borderRadius: '50%', width: 120, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', textAlign: 'center', boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' },
  },
  {
    id: 'fw-v2',
    position: { x: 400, y: 350 },
    data: {
      label: 'Core Firewall-B',
      description: 'Redundant firewall node for high-availability failover.',
      status: 'standby',
      metrics: { cpu: '5%', memory: '8GB', traffic: '0b/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px dotted #00FFFF', borderRadius: '50%', width: 120, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', textAlign: 'center', opacity: 0.6 },
  },
  {
    id: 'ids-node',
    position: { x: 600, y: 250 },
    data: {
      label: 'IDS/IPS Cluster',
      description: 'Signature-based threat detection and flow analysis engine.',
      status: 'warning',
      metrics: { cpu: '82%', memory: '16GB', traffic: '2.1Gb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px solid #00FFFF', borderRadius: '50%', width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', textAlign: 'center' },
  },

  // --- DATA PROCESSING DOMAIN ---
  {
    id: 'lb-primary',
    position: { x: 800, y: 250 },
    data: {
      label: 'L7 Load Balancer',
      description: 'Application-aware distribution for internal microservices.',
      status: 'active',
      metrics: { cpu: '45%', memory: '4GB', traffic: '1.8Gb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px solid #00FFFF', borderRadius: '50%', width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', textAlign: 'center' },
  },
  {
    id: 'cache-layer',
    position: { x: 1000, y: 150 },
    data: {
      label: 'Global Cache',
      description: 'In-memory data acceleration and content distribution.',
      status: 'active',
      metrics: { cpu: '12%', memory: '128GB', traffic: '800Mb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px solid #00FFFF', borderRadius: '8px', width: 120, fontSize: '10px' },
  },
  {
    id: 'worker-v1',
    position: { x: 1000, y: 350 },
    data: {
      label: 'VNF-Worker-01',
      description: 'General purpose compute node for dynamic function chain tasks.',
      status: 'active',
      metrics: { cpu: '22%', memory: '4GB', traffic: '120Mb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FFFF', border: '2px solid #00FFFF', borderRadius: '8px', width: 120, fontSize: '10px' },
  },

  // --- EDGE BRIDGES ---
  {
    id: 'edge-bridge-east',
    position: { x: 1250, y: 100 },
    data: {
      label: 'East-Region-Bridge',
      description: 'Low-latency interconnect for distributed East Coast clusters.',
      status: 'active',
      metrics: { cpu: '8%', memory: '2GB', traffic: '1.1Gb/s' }
    },
    style: { backgroundColor: '#111', color: '#00FF00', border: '2px solid #00FF00', borderRadius: '4px', width: 140, fontSize: '10px' },
  },
  {
    id: 'edge-bridge-west',
    position: { x: 1250, y: 400 },
    data: {
      label: 'West-Region-Bridge',
      description: 'Redundant fiber bridge for West Coast infrastructure peering.',
      status: 'error',
      metrics: { cpu: '0%', memory: '0GB', traffic: 'OFFLINE' }
    },
    style: { backgroundColor: '#111', color: '#FF0000', border: '2px solid #FF0000', borderRadius: '4px', width: 140, fontSize: '10px', boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)' },
  },

  // --- INTERNAL STORAGE ---
  {
    id: 'storage-db',
    position: { x: 800, y: 500 },
    data: {
      label: 'Policy Database',
      description: 'Distributed persistence layer for network-wide ACLs and logs.',
      status: 'active',
      metrics: { cpu: '15%', memory: '64GB', traffic: '45Mb/s' }
    },
    style: { backgroundColor: '#111', color: '#FFFF00', border: '2px solid #FFFF00', borderRadius: '8px', width: 120, fontSize: '10px' },
  },

  // --- EGRESS ---
  {
    id: 'egress-node',
    position: { x: 1500, y: 250 },
    data: {
      label: 'Core Egress',
      description: 'Internal-to-external NAT and logging for outgoing traffic.',
      status: 'active',
      metrics: { cpu: '5%', memory: '512MB', traffic: '2.2Gb/s' }
    },
    style: { backgroundColor: '#050505', color: '#00FF00', border: '2px solid #00FF00', borderRadius: '4px', width: 140, fontSize: '10px', boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)' },
  },
];

const initialEdges: Edge[] = [
  // Transit Path
  { id: 'e-ext-gw', source: 'ext-ingress', target: 'ext-gw', animated: true, style: { stroke: '#FF00FF', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF00FF' } },
  { id: 'e-gw-fw1', source: 'ext-gw', target: 'fw-v1', animated: true, style: { stroke: '#00FFFF', strokeWidth: 2 } },
  { id: 'e-gw-fw2', source: 'ext-gw', target: 'fw-v2', style: { stroke: '#00FFFF', strokeWidth: 1, strokeDasharray: '5,5' } },

  // Core Security Chain
  { id: 'e-fw1-ids', source: 'fw-v1', target: 'ids-node', animated: true, style: { stroke: '#00FFFF', strokeWidth: 2 } },
  { id: 'e-fw2-ids', source: 'fw-v2', target: 'ids-node', style: { stroke: '#00FFFF', strokeWidth: 1 } },
  { id: 'e-ids-lb', source: 'ids-node', target: 'lb-primary', animated: true, style: { stroke: '#00FFFF', strokeWidth: 3 } },

  // Distribution
  { id: 'e-lb-cache', source: 'lb-primary', target: 'cache-layer', animated: true, style: { stroke: '#00FFFF', strokeWidth: 2 } },
  { id: 'e-lb-worker', source: 'lb-primary', target: 'worker-v1', animated: true, style: { stroke: '#00FFFF', strokeWidth: 2 } },
  { id: 'e-lb-db', source: 'lb-primary', target: 'storage-db', style: { stroke: '#FFFF00', strokeWidth: 1, strokeDasharray: '2,2' } },

  // Bridges
  { id: 'e-cache-east', source: 'cache-layer', target: 'edge-bridge-east', animated: true, style: { stroke: '#00FF00', strokeWidth: 2 } },
  { id: 'e-worker-west', source: 'worker-v1', target: 'edge-bridge-west', style: { stroke: '#FF0000', strokeWidth: 1 } },

  // Exit Path
  { id: 'e-east-exit', source: 'edge-bridge-east', target: 'egress-node', animated: true, style: { stroke: '#00FF00', strokeWidth: 2 } },
  { id: 'e-db-exit', source: 'storage-db', target: 'egress-node', style: { stroke: '#FFFF00', strokeWidth: 1 } },
];

const NetworkTopology = () => {
  const { isDemo } = useEnvironment();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<{ node: Node; x: number; y: number } | null>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), [setEdges]);

  const onNodeMouseEnter = (_: React.MouseEvent, node: Node) => {
    setHoveredNode({
      node,
      x: _.clientX,
      y: _.clientY,
    });
  };

  const onNodeMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="h-full w-full relative flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black/40 border-b border-primary/20 backdrop-blur-md">
        <div className="flex flex-col">
          <h2 className={`text-xl font-bold font-orbitron tracking-widest ${isDemo ? 'text-amber-500' : 'text-primary'}`}>
            {isDemo ? 'SIMULATED_TOPOLOGY' : 'Network Topology'}
          </h2>
          <span className="text-[10px] text-text/40 font-mono uppercase tracking-[0.2em]">
            {isDemo ? 'DEMO_ENVIRONMENT_V1.0' : 'Global_Infrastructure_View_v2.1'}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDemo ? 'bg-amber-500 shadow-[0_0_8px_#F59E0B]' : 'bg-primary shadow-[0_0_8px_#00FFFF]'}`}></span>
            <span className={`text-[10px] font-mono uppercase ${isDemo ? 'text-amber-500/60' : 'text-primary/60'}`}>
              {isDemo ? 'SIM_SYNC' : 'Live_Sync'}
            </span>
          </div>
          <div className="h-6 w-px bg-primary/20"></div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-[#FF00FF]"></div>
              <span className="text-[9px] text-text/40 uppercase">External</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-[#00FFFF]"></div>
              <span className="text-[9px] text-text/40 uppercase">VNF_Core</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-[#00FF00]"></div>
              <span className="text-[9px] text-text/40 uppercase">Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-[#010B13]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          fitView
          colorMode="dark"
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Controls className="bg-black/80 border border-primary/30 text-primary shadow-xl" />
          <MiniMap
            className="bg-black/60 border border-primary/20 rounded-lg overflow-hidden"
            nodeStrokeColor={(n) => (n.style?.border as string)?.split(' ')[2] || '#00FFFF'}
            nodeColor="#050505"
            maskColor="rgba(0, 0, 0, 0.8)"
          />
          <Background color="#00FFFF" gap={30} size={1} variant={BackgroundVariant.Lines} style={{ opacity: 0.03 }} />
        </ReactFlow>
      </div>

      <div className="p-2 px-6 flex justify-between items-center text-[10px] text-text/30 font-fira-code bg-black/40 border-t border-primary/10">
        <div className="flex gap-6">
          <span>DOMAIN_COUNT: 4</span>
          <span>TOTAL_NODES: {nodes.length}</span>
          <span>ACTIVE_TRAFFIC: 12.4 Gb/s</span>
        </div>
        <div className="flex gap-6">
          <span className="text-secondary/60">SYSTEM_STABILITY: OPTIMAL</span>
          <span className="animate-pulse">SIGNAL: 100%_SECURE</span>
        </div>
      </div>

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

      {isDemo && (
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-500/10 overflow-hidden">
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-amber-500/80 backdrop-blur-md text-black text-[10px] font-bold px-6 py-2 uppercase tracking-[0.3em] rounded-full shadow-2xl animate-fade-in z-50">
            Interactive_Demo_Simulation_Active
          </div>
          <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,158,11,0.05)_100%)]"></div>
        </div>
      )}
    </div>
  );
};

// End of component

export default NetworkTopology;
