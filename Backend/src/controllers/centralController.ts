import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/centralControllerService.js';
import * as mockService from '../services/mock/centralControllerMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const centralService = isMockingEnabled ? mockService : realService;

export const deployFunction = async (req: Request, res: Response) => {
  const { functionName, resources } = req.body;

  if (!functionName || !resources) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await centralService.deployFunction(functionName, resources);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const scaleFunction = async (req: Request, res: Response) => {
  const { functionName, scale } = req.body;

  if (!functionName || typeof scale !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await centralService.scaleFunction(functionName, scale);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
