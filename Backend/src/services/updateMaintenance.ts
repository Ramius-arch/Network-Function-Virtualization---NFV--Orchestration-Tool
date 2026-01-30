import { getAllFunctions } from '../models/networkFunction.js';
import type { NetworkFunction } from '../models/networkFunction.js';

export const updateFunctionVersion = async (functionName: string, newVersion: string) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();
    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);
    if (func) {
      func.version = newVersion;
      return func;
    }
    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating function version:', error);
    throw error;
  }
};

export const rollbackFunctionVersion = async (functionName: string, previousVersion: string) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();
    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);
    if (func) {
      func.version = previousVersion;
      return func;
    }
    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error rolling back function version:', error);
    throw error;
  }
};

export const applyPatch = async (functionName: string, patchDetails: Record<string, unknown>) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();
    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);
    if (func) {
      if (!func.patches) {
        func.patches = [];
      }
      func.patches.push(patchDetails);
      return func;
    }
    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error applying patch:', error);
    throw error;
  }
};
