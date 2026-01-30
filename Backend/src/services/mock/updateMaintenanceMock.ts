export const updateFunctionVersion = async (functionName: string, newVersion: string) => {
  console.log(`[MOCK] Updating function ${functionName} to version ${newVersion}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        oldVersion: '1.0.0', // Mock old version
        newVersion,
        status: 'updated',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const rollbackFunctionVersion = async (functionName: string, previousVersion: string) => {
  console.log(`[MOCK] Rolling back function ${functionName} to version ${previousVersion}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        rolledBackToVersion: previousVersion,
        status: 'rolled_back',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const applyPatch = async (functionName: string, patchDetails: unknown) => {
  console.log(`[MOCK] Applying patch to function ${functionName} with details:`, patchDetails);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        patchDetails,
        status: 'patch_applied',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
