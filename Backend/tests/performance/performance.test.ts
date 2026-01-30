import { logPerformanceMetrics, getPerformanceMetrics } from '../../src/services/monitoring';

describe('Performance Monitoring Tests', () => {
  test('should log performance metrics successfully', async () => {
    const mockFunctionName = 'testFunction';
    const mockMetrics = { latency: 10, throughput: 100 };

    const result = await logPerformanceMetrics(mockFunctionName, mockMetrics);

    expect(result).toHaveProperty('functionName', mockFunctionName);
    expect(result).toHaveProperty('metrics', mockMetrics);
  });

  test('should retrieve performance metrics successfully', async () => {
    const mockFunctionName = 'testFunction';

    const result = await getPerformanceMetrics(mockFunctionName);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('functionName', mockFunctionName);
  });
});