import { VIMFactory } from './vim/vimFactory.js';
import { addFunction, getAllFunctions } from '../models/networkFunction.js';

export const deployVirtualFunction = async (functionName: string, image: string) => {
  try {
    // 1. Persist the metadata into the database catalog model
    const specs = { cpu: '2 Cores', memory: '4GB', image };
    await addFunction(functionName, specs);

    // 2. Delegate deployment to the configured active VIM provider
    const provider = VIMFactory.getProvider();
    const status = await provider.deployVNF(functionName, image, {
      cpu: '2 Cores',
      memory: '4GB'
    });

    return status;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[VirtualizationLayer] Deployment failed:', error.message);
    throw error;
  }
};

export const removeVirtualFunction = async (functionName: string) => {
  try {
    // 1. Delegate termination to the active VIM provider
    const provider = VIMFactory.getProvider();
    const status = await provider.terminateVNF(functionName);

    // 2. Clean up metadata by removing it from the network functions catalog array
    const functions = await getAllFunctions();
    const funcIndex = functions.findIndex((f) => f.functionName === functionName);
    if (funcIndex !== -1) {
      functions.splice(funcIndex, 1);
    }

    return status;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[VirtualizationLayer] Removal failed:', error.message);
    throw error;
  }
};
