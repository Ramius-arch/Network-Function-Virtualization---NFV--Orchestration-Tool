export const logPerformanceMetrics = async (functionName: string, metrics: unknown) => {
  console.log(`[MOCK] Logging metrics for ${functionName}:`, metrics);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `[MOCK] Metrics for ${functionName} logged successfully.`,
        loggedMetrics: metrics,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const getPerformanceMetrics = async (functionName: string) => {
  console.log(`[MOCK] Getting metrics for ${functionName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        functionName,
        cpuUsage: `${Math.floor(Math.random() * 50) + 10}%`,
        memoryUsage: `${Math.floor(Math.random() * 50) + 20}MB`,
        networkThroughput: `${Math.floor(Math.random() * 100) + 50}Mbps`,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};
