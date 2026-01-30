export const deployVirtualFunction = async (functionName: string, image: string) => {
  console.log(`[MOCK] Deploying virtual function: ${functionName} with image: ${image}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        image,
        instanceId: `mock-vf-${functionName}-1`,
        status: 'deployed',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const removeVirtualFunction = async (functionName: string) => {
  console.log(`[MOCK] Removing virtual function: ${functionName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        status: 'removed',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
