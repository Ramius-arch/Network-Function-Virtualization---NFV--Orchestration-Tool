export const deployRedundantInstance = async (functionName: string, image: string) => {
  console.log(`[MOCK] Deploying redundant instance for ${functionName} with image: ${image}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        image,
        instanceId: `mock-redundant-${functionName}-1`,
        status: 'deployed',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const failoverToRedundantInstance = async (functionName: string) => {
  console.log(`[MOCK] Performing failover for ${functionName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        status: 'failover_complete',
        oldInstance: `mock-${functionName}-primary`,
        newInstance: `mock-redundant-${functionName}-1`,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const loadBalanceInstances = async (instances: string[]) => {
  console.log(`[MOCK] Load balancing instances:`, instances);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        instances,
        status: 'load_balanced',
        strategy: 'mock_round_robin',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
