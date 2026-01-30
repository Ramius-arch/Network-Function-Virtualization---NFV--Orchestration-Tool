export interface ResourceAllocation {
  functionName: string;
  allocatedCpu: string;
  allocatedMemory: string;
  allocatedStorage: string;
  status: string;
  timestamp: string;
}

export interface NetworkFunction {
  functionName: string;
  specs: Record<string, unknown>;
  config?: Record<string, unknown>; // Added for controlPlaneService
  state?: Record<string, unknown>; // Added for controlPlaneService
  version?: string; // Added for updateMaintenanceService
  patches?: Record<string, unknown>[]; // Added for updateMaintenanceService
}

// In-memory database for network functions
const functions: NetworkFunction[] = [];

export const getAllFunctions = async () => {
  try {
    return functions;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching network functions:', error);
    throw error;
  }
};

export const addFunction = async (functionName: string, specs: Record<string, unknown>) => {
  try {
    const newFunction: NetworkFunction = { functionName, specs };
    functions.push(newFunction);
    return newFunction;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error adding network function:', error);
    throw error;
  }
};

export const updateFunction = async (functionName: string, specs: Record<string, unknown>) => {
  try {
    const func = functions.find((f) => f.functionName === functionName);
    if (func) {
      func.specs = specs;
      return func;
    }
    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating network function:', error);
    throw error;
  }
};
