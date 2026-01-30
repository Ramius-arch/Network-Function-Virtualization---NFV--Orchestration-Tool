import { getAllFunctions } from '../models/networkFunction.js';
import type { NetworkFunction } from '../models/networkFunction.js';

export const configureFunction = async (
  functionName: string,

  config: Record<string, unknown>,
) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();

    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);

    if (func) {
      func.config = config;

      return func;
    }

    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error configuring function:', error);
    throw error;
  }
};

export const getFunctionState = async (functionName: string) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();

    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);

    if (func) {
      return { state: func.state };
    }

    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching function state:', error);
    throw error;
  }
};

export const updateFunctionState = async (functionName: string, state: Record<string, unknown>) => {
  try {
    const functions: NetworkFunction[] = await getAllFunctions();

    const func = functions.find((f: NetworkFunction) => f.functionName === functionName);

    if (func) {
      func.state = state;

      return func;
    }

    throw new Error('Function not found');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating function state:', error);
    throw error;
  }
};
