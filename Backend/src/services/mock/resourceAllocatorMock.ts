import type { ResourceAllocation } from '../../models/networkFunction.js';

export const allocateResources = async (
  functionName: string,
  resources: { cpu?: string; memory?: string; storage?: string },
): Promise<ResourceAllocation> => {
  console.log(`[MOCK] Allocating resources for ${functionName}:`, resources);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        allocatedCpu: resources.cpu || '2 Cores',
        allocatedMemory: resources.memory || '4GB',
        allocatedStorage: resources.storage || '100GB',
        status: 'allocated',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const scaleResources = async (functionName: string, scale: 'up' | 'down'): Promise<ResourceAllocation> => {
  console.log(`[MOCK] Scaling resources for ${functionName} ${scale}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        allocatedCpu: scale === 'up' ? '4 Cores' : '2 Cores',
        allocatedMemory: scale === 'up' ? '8GB' : '4GB',
        allocatedStorage: scale === 'up' ? '200GB' : '100GB',
        status: `scaled_${scale}`,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
