import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/virtualizationLayer.js';
import * as mockService from '../services/mock/virtualizationLayerMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const virtualizationLayerService = isMockingEnabled ? mockService : realService;

export const deploy = async (req: Request, res: Response) => {
  const { functionName, image } = req.body;
  try {
    const result = await virtualizationLayerService.deployVirtualFunction(functionName, image);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { functionName } = req.body;
  try {
    const result = await virtualizationLayerService.removeVirtualFunction(functionName);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
