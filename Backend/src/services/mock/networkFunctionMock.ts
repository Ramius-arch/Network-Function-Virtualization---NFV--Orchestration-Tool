import type { NetworkFunction } from '../../models/networkFunction.js';

const mockFunctions: NetworkFunction[] = [
  { functionName: 'mockNFV1', specs: { cpu: '1 core', memory: '2GB' } },
  { functionName: 'mockNFV2', specs: { cpu: '2 core', memory: '4GB' } },
];

export const getAllFunctions = async () => {
  console.log(`[MOCK] Getting all network functions.`);
  return new Promise<NetworkFunction[]>((resolve) => {
    setTimeout(() => {
      resolve(mockFunctions);
    }, 500);
  });
};

export const addFunction = async (functionName: string, specs: Record<string, unknown>) => {
  console.log(`[MOCK] Adding network function: ${functionName}`);
  return new Promise<NetworkFunction>((resolve) => {
    setTimeout(() => {
      const newFunction: NetworkFunction = { functionName, specs }; // Explicitly type newFunction
      mockFunctions.push(newFunction);
      resolve(newFunction);
    }, 500);
  });
};

export const updateFunction = async (functionName: string, specs: Record<string, unknown>) => {
  console.log(`[MOCK] Updating network function: ${functionName}`);
  return new Promise<NetworkFunction>((resolve, reject) => {
    setTimeout(() => {
      const funcIndex = mockFunctions.findIndex((f) => f.functionName === functionName);
      if (funcIndex !== -1) {
        const existingFunc = mockFunctions[funcIndex];
        if (!existingFunc) {
          // Added explicit check for undefined
          reject(new Error('[MOCK] Existing function not found at index.'));
          return;
        }
        const updatedFunc: NetworkFunction = {
          functionName: existingFunc.functionName,
          specs: specs,
          ...(existingFunc.config !== undefined && { config: existingFunc.config }),
          ...(existingFunc.state !== undefined && { state: existingFunc.state }),
          ...(existingFunc.version !== undefined && { version: existingFunc.version }),
          ...(existingFunc.patches !== undefined && { patches: existingFunc.patches }),
        };
        mockFunctions[funcIndex] = updatedFunc;
        resolve(updatedFunc); // Resolve with the updated object
      } else {
        reject(new Error('[MOCK] Function not found for update.'));
      }
    }, 500);
  });
};
