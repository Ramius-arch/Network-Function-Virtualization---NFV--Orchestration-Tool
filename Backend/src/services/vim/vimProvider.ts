export interface VNFDescriptor {
  cpu: string;
  memory: string;
  storage?: string;
}

export interface VNFStatus {
  functionName: string;
  image: string;
  instanceId: string;
  status: 'deployed' | 'error' | 'removed';
  timestamp: string;
  details?: string;
}

export interface VIMProvider {
  deployVNF(functionName: string, image: string, descriptor?: VNFDescriptor): Promise<VNFStatus>;
  terminateVNF(functionName: string): Promise<VNFStatus>;
  queryVNF(functionName: string): Promise<VNFStatus>;
}
