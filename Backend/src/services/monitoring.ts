interface PerformanceMetric {
  functionName: string;
  metrics: Record<string, unknown>;
  timestamp: Date;
}

// In-memory database for performance metrics
const metrics: PerformanceMetric[] = [];

export const logPerformanceMetrics = async (functionName: string, newMetrics: Record<string, unknown>) => {
  try {
    const metric: PerformanceMetric = {
      functionName,
      metrics: newMetrics,
      timestamp: new Date(),
    };
    metrics.push(metric);
    return metric;
  } catch (error) {
    console.error('Error logging performance metrics:', error);
    throw error;
  }
};

export const getPerformanceMetrics = async (functionName: string) => {
  try {
    return metrics.filter((m) => m.functionName === functionName);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};
