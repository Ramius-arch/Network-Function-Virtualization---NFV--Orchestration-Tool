import type { VIMProvider, VNFStatus, VNFDescriptor } from './vimProvider.js';

export class MockVIMProvider implements VIMProvider {
  async deployVNF(functionName: string, image: string, descriptor?: VNFDescriptor): Promise<VNFStatus> {
    console.log(`[MockVIM] Deploying VNF: ${functionName} using image: ${image}`);
    return {
      functionName,
      image,
      instanceId: `mock-uuid-${functionName}-${Math.floor(Math.random() * 1000)}`,
      status: 'deployed',
      timestamp: new Date().toISOString(),
      details: `Simulated reserve: CPU: ${descriptor?.cpu || '2 Cores'}, Memory: ${descriptor?.memory || '4GB'}`
    };
  }

  async terminateVNF(functionName: string): Promise<VNFStatus> {
    console.log(`[MockVIM] Terminating VNF: ${functionName}`);
    return {
      functionName,
      image: 'N/A',
      instanceId: `mock-uuid-${functionName}-terminated`,
      status: 'removed',
      timestamp: new Date().toISOString(),
    };
  }

  async queryVNF(functionName: string): Promise<VNFStatus> {
    return {
      functionName,
      image: 'N/A',
      instanceId: `mock-uuid-${functionName}`,
      status: 'deployed',
      timestamp: new Date().toISOString(),
      details: 'Healthy mock VNF node'
    };
  }
}
