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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#EC4899', // Pink
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
    position: { x: 200, y: 250 },
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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#8B5CF6', // Violet
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
    position: { x: 400, y: 350 },
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
    position: { x: 600, y: 250 },
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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#06B6D4', // Cyan
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
    position: { x: 1000, y: 150 },
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
    position: { x: 1000, y: 350 },
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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#10B981', // Emerald
      border: '1.5px solid rgba(16, 185, 129, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#EF4444', // Red
      border: '1.5px solid rgba(239, 68, 68, 0.4)', 
      borderRadius: '16px', 
      width: 140, 
      fontSize: '10px', 
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
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
    style: { 
      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: '#F59E0B', // Amber
      border: '1.5px solid rgba(245, 158, 11, 0.4)', 
      borderRadius: '16px', 
      width: 120, 
      fontSize: '10px',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '8px'
    },
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

const initialEdges: Edge[] = [
  // Transit Path
  { id: 'e-ext-gw', source: 'ext-ingress', target: 'ext-gw', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC4899' } },
  { id: 'e-gw-fw1', source: 'ext-gw', target: 'fw-v1', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },
  { id: 'e-gw-fw2', source: 'ext-gw', target: 'fw-v2', style: { stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4,4' } },

  // Core Security Chain
  { id: 'e-fw1-ids', source: 'fw-v1', target: 'ids-node', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },
  { id: 'e-fw2-ids', source: 'fw-v2', target: 'ids-node', style: { stroke: '#8B5CF6', strokeWidth: 1 } },
  { id: 'e-ids-lb', source: 'ids-node', target: 'lb-primary', animated: true, style: { stroke: '#06B6D4', strokeWidth: 2 } },

  // Distribution
  { id: 'e-lb-cache', source: 'lb-primary', target: 'cache-layer', animated: true, style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: 'e-lb-worker', source: 'lb-primary', target: 'worker-v1', animated: true, style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: 'e-lb-db', source: 'lb-primary', target: 'storage-db', style: { stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '2,2' } },

  // Bridges
  { id: 'e-cache-east', source: 'cache-layer', target: 'edge-bridge-east', animated: true, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'e-worker-west', source: 'worker-v1', target: 'edge-bridge-west', style: { stroke: '#EF4444', strokeWidth: 1 } },

  // Exit Path
  { id: 'e-east-exit', source: 'edge-bridge-east', target: 'egress-node', animated: true, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'e-db-exit', source: 'storage-db', target: 'egress-node', style: { stroke: '#F59E0B', strokeWidth: 1 } },
];

const NetworkTopology = () => {
  const { envMode } = useEnvironment();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<{ node: Node; x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchDynamicNodes = async () => {
      try {
        const functions = await fetchAPI('/api/network-function');
        const dynamicNodes = functions.map((fn: any, index: number) => {
          const xOffset = 300 + (index * 150);
          const yOffset = 100 + (index % 2 === 0 ? 50 : -50);
          return {
            id: `dynamic-${fn.functionName}`,
            position: { x: xOffset, y: yOffset },
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
          };
        });

        setNodes((prevNodes) => {
          const baseNodes = prevNodes.filter(n => !n.id.startsWith('dynamic-'));
          return [...baseNodes, ...dynamicNodes];
        });

        setEdges((prevEdges) => {
          const baseEdges = prevEdges.filter(e => !e.id.startsWith('dynamic-edge-'));
          const dynamicEdges = dynamicNodes.map((node: any) => ({
            id: `dynamic-edge-${node.id}`,
            source: 'ids-node',
            target: node.id,
            animated: true,
            style: { stroke: '#8B5CF6', strokeWidth: 1.5 }
          }));
          return [...baseEdges, ...dynamicEdges];
        });
      } catch (err) {
        console.warn('API error fetching dynamic nodes, staying with baseline.', err);
      }
    };

    fetchDynamicNodes();
    const interval = setInterval(fetchDynamicNodes, 5000);
    return () => clearInterval(interval);
  }, [setNodes, setEdges]);

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
      <div className="flex justify-between items-center p-4 bg-slate-950/75 border-b border-white/5 backdrop-blur-md">
        <div className="flex flex-col text-left">
          <h2 className="text-xl font-bold font-space-grotesk text-white">
            {envMode === 'demo' ? 'Simulated Topology' : 'Network Topology'}
          </h2>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">
            {envMode === 'demo' ? 'DEMO_ENVIRONMENT_V1.0' : 'Global_Infrastructure_View_v2.1'}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Live_Sync
            </span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-lg bg-[#EC4899]"></div>
              <span className="text-[9px] text-slate-400 uppercase font-mono">External</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-lg bg-[#8B5CF6]"></div>
              <span className="text-[9px] text-slate-400 uppercase font-mono">VNF_Core</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-lg bg-[#10B981]"></div>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full min-h-[550px] bg-[#030712] relative">
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

      <div className="p-3 px-6 flex justify-between items-center text-[10px] text-slate-500 font-mono bg-slate-950/75 border-t border-white/5">
        <div className="flex gap-6">
          <span>DOMAIN_COUNT: 4</span>
          <span>TOTAL_NODES: {nodes.length}</span>
          <span>ACTIVE_TRAFFIC: 12.4 Gb/s</span>
        </div>
        <div className="flex gap-6">
          <span className="text-green-500/80 font-bold">SYSTEM_STABILITY: OPTIMAL</span>
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

      {envMode === 'demo' && (
        <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/10 overflow-hidden">
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-6 py-2 uppercase tracking-[0.3em] rounded-full shadow-2xl z-50">
            Interactive_Demo_Simulation_Active
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopology;
