import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/resourceAllocator.js';
import * as mockService from '../services/mock/resourceAllocatorMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const resourceAllocatorService = isMockingEnabled ? mockService : realService;

export const allocate = async (req: Request, res: Response) => {
  const { functionName, resources } = req.body;
  try {
    const result = await resourceAllocatorService.allocateResources(functionName, resources);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const scale = async (req: Request, res: Response) => {
  const { functionName, scale } = req.body;
  if (scale !== 'up' && scale !== 'down') {
    return res.status(400).json({ message: 'Invalid scale direction. Must be "up" or "down".' });
  }
  try {
    const result = await resourceAllocatorService.scaleResources(functionName, scale as 'up' | 'down');
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
