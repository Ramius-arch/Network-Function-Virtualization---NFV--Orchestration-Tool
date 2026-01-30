export const deployFunction = async (functionName: string, resources: unknown) => {
  console.log(`[MOCK] Deploying function: ${functionName} with resources:`, resources);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `[MOCK] Function ${functionName} deployed successfully.` });
    }, 500);
  });
};

export const scaleFunction = async (functionName: string, scale: number) => {
  console.log(`[MOCK] Scaling function: ${functionName} to scale: ${scale}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `[MOCK] Function ${functionName} scaled to ${scale}.` });
    }, 500);
  });
};
