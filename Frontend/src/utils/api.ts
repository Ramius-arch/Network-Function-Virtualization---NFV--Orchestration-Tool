export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const envMode = localStorage.getItem('atomic_env_mode') || 'demo';

  // ── CENTRALIZED DEMO MODE INTERCEPTOR ──────────────────────────────────────
  // If the sandbox is in Demo Mode, bypass the backend endpoints entirely.
  // This solves console clutter (401 Unauthorized errors) and keeps the demo
  // completely robust and operational client-side.
  if (envMode === 'demo') {
    await new Promise((resolve) => setTimeout(resolve, 300)); // simulate network latency

    if (endpoint.includes('/api/monitoring/metrics')) {
      const parts = endpoint.split('/');
      const funcName = parts[parts.length - 1] || 'Firewall';
      return {
        functionName: funcName,
        cpuUsage: `${Math.floor(Math.random() * 30 + 15)}%`,
        memoryUsage: `${(Math.random() * 4 + 2).toFixed(1)}GB`,
        networkThroughput: `${Math.floor(Math.random() * 400 + 800)}Mbps`,
        timestamp: new Date().toISOString(),
      };
    }

    if (endpoint.includes('/api/virtualization-layer/deploy')) {
      let body: any = {};
      try { body = JSON.parse(options.body as string); } catch (e) {}
      return {
        functionName: body.functionName || 'vnf-instance',
        status: 'deployed',
        instanceId: `inst-${Math.floor(Math.random() * 9000 + 1000)}`,
      };
    }

    if (endpoint.includes('/api/virtualization-layer/remove')) {
      let body: any = {};
      try { body = JSON.parse(options.body as string); } catch (e) {}
      return {
        functionName: body.functionName || 'vnf-instance',
        status: 'removed',
      };
    }

    if (endpoint.includes('/api/resource-allocator/allocate')) {
      let body: any = {};
      try { body = JSON.parse(options.body as string); } catch (e) {}
      return {
        functionName: body.functionName || 'edge-node',
        allocatedCpu: `${body.resources?.cpu || '2'} Cores`,
        allocatedMemory: `${body.resources?.memory || '4'}GB`,
        status: 'active',
      };
    }

    if (endpoint.includes('/api/resource-allocator/scale')) {
      let body: any = {};
      try { body = JSON.parse(options.body as string); } catch (e) {}
      return {
        functionName: body.functionName || 'edge-node',
        allocatedCpu: body.scale === 'up' ? '16 Cores' : '4 Cores',
        allocatedMemory: body.scale === 'up' ? '64GB' : '16GB',
        status: 'scaled',
      };
    }

    if (endpoint.includes('/api/control-plane/configure')) {
      let body: any = {};
      try { body = JSON.parse(options.body as string); } catch (e) {}
      return {
        functionName: body.functionName || 'control-node',
        status: 'configured',
      };
    }

    if (endpoint.includes('/api/control-plane/state')) {
      const parts = endpoint.split('/');
      const funcName = parts[parts.length - 1] || 'firewall-v1';
      return {
        state: {
          node_id: `${funcName}-primary`,
          uptime: '12d 4h 11m',
          policy_version: '3.1.2-sandbox',
          active_sessions: Math.floor(Math.random() * 800 + 200),
          last_sync: new Date().toISOString(),
        },
      };
    }

    if (endpoint.includes('/api/data-plane/route')) {
      return { message: 'SDN Flow table updated. Gateways peered.' };
    }

    if (endpoint.includes('/api/data-plane/clear')) {
      return { message: 'All dynamic packet filter rules flushed.' };
    }

    if (endpoint.includes('/api/legacy-integration/wrap')) {
      return {
        source: 'Legacy_IOS_Switch',
        status: 'bridged',
        protocols: ['OSPF', 'BGP'],
        wrappedCommand: 'show ip ospf neighbors',
      };
    }

    if (endpoint.includes('/api/legacy-integration/test')) {
      return { status: 'peered', latency: '6ms' };
    }

    if (endpoint.includes('/api/network-function')) {
      return [];
    }
  }

  // ── PRODUCTION LIVE MODE ───────────────────────────────────────────────────
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
};
