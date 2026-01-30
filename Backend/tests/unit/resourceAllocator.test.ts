import { describe, test, expect } from '@jest/globals';
import { allocateResources, scaleResources } from '../../src/services/resourceAllocator';

describe('Resource Allocator Service', () => {
  test('should allocate resources successfully', async () => {
    const mockFunctionName = 'testFunction';
    const mockResources = { cpu: 2, memory: '4GB' };

    const result = await allocateResources(mockFunctionName, mockResources);

    expect(result).toHaveProperty('functionName', mockFunctionName);
    expect(result).toHaveProperty('status', 'allocated');
  });

  test('should scale resources successfully', async () => {
    const mockFunctionName = 'testFunction';
    const mockScale = 3;

    const result = await scaleResources(mockFunctionName, mockScale);

    expect(result).toHaveProperty('functionName', mockFunctionName);
    expect(result).toHaveProperty('status', `scaled_${mockScale}`);
  });
});