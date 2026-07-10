import type { VIMProvider } from './vimProvider.js';
import { MockVIMProvider } from './mockVIM.js';
import { DockerVIMProvider } from './dockerVIM.js';
import dotenv from 'dotenv';

dotenv.config();

export class VIMFactory {
  private static instance: VIMProvider;

  public static getProvider(): VIMProvider {
    if (!this.instance) {
      const isMock = process.env.MOCK_DATA === 'true' || process.env.VIM_PROVIDER === 'mock';
      if (isMock) {
        this.instance = new MockVIMProvider();
      } else {
        this.instance = new DockerVIMProvider();
      }
      console.log(`[VIMFactory] Loaded VIM provider: ${this.instance.constructor.name}`);
    }
    return this.instance;
  }
}
