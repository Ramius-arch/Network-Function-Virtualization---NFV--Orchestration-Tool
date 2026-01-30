export const configureFunction = async (functionName: string, config: unknown) => {
  console.log(`[MOCK] Configuring function: ${functionName} with config:`, config);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        status: 'configured',
        configApplied: config,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const getFunctionState = async (functionName: string) => {
  console.log(`[MOCK] Getting state for function: ${functionName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        state: 'running',
        lastHeartbeat: new Date().toISOString(),
        metrics: { cpu: '20%', memory: '30%' },
      });
    }, 500);
  });
};

export const updateFunctionState = async (functionName: string, state: unknown) => {
  console.log(`[MOCK] Updating state for function: ${functionName} with state:`, state);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        status: 'state_updated',
        newState: state,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
