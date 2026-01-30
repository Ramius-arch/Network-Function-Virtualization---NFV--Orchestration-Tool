export const wrapLegacyFunction = async (legacyCommand: string) => {
  console.log(`[MOCK] Wrapping legacy function with command: ${legacyCommand}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `[MOCK] Legacy command '${legacyCommand}' wrapped successfully.`,
        wrappedOutput: `Mocked output for ${legacyCommand}`,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const testLegacyAPI = async (apiUrl: string) => {
  console.log(`[MOCK] Testing legacy API at: ${apiUrl}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `[MOCK] Legacy API at '${apiUrl}' tested successfully.`,
        status: 'connected',
        mockResponse: { data: 'mocked legacy data' },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
