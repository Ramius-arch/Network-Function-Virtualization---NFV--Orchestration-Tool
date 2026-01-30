import type { ResourceAllocation } from '../models/networkFunction.js'; // Use the NetworkFunction's ResourceAllocation

interface InternalResourceAllocation {
  // Internal interface to manage in-memory state
  functionName: string;
  allocatedCpu: string;
  allocatedMemory: string;
  allocatedStorage: string;
  status: string;
  timestamp: string;
}

// In-memory database for resource allocations
const allocations: InternalResourceAllocation[] = [];

export const allocateResources = async (
  functionName: string,
  resources: Record<string, unknown>,
): Promise<ResourceAllocation> => {
  try {
    const allocation: InternalResourceAllocation = {
      functionName,
      allocatedCpu: (resources.cpu as string) || '2 Cores',
      allocatedMemory: (resources.memory as string) || '4GB',
      allocatedStorage: (resources.storage as string) || '100GB',
      status: 'allocated',
      timestamp: new Date().toISOString(),
    };
    allocations.push(allocation);
    return allocation;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error allocating resources:', error);
    throw error;
  }
};

export const scaleResources = async (functionName: string, scale: 'up' | 'down'): Promise<ResourceAllocation> => {
  try {
    const allocation = allocations.find((a) => a.functionName === functionName);
    if (allocation) {
      allocation.allocatedCpu = scale === 'up' ? '4 Cores' : '2 Cores';
      allocation.allocatedMemory = scale === 'up' ? '8GB' : '4GB';
      allocation.allocatedStorage = scale === 'up' ? '200GB' : '100GB';
      allocation.status = `scaled_${scale}`;
      allocation.timestamp = new Date().toISOString();
      return allocation;
    }
    throw new Error('Allocation not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error scaling resources:', error);
    throw error;
  }
};
