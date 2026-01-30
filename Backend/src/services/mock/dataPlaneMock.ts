export const routeTraffic = async (source: string, destination: string) => {
  console.log(`[MOCK] Routing traffic from ${source} to ${destination}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `[MOCK] Traffic routed from ${source} to ${destination}.`,
        status: 'routed',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const clearTrafficRules = async () => {
  console.log(`[MOCK] Clearing all traffic rules.`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `[MOCK] All traffic rules cleared.`,
        status: 'cleared',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
