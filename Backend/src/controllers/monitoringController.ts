import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/monitoring.js';
import * as mockService from '../services/mock/monitoringMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const monitoringService = isMockingEnabled ? mockService : realService;

export const logMetrics = async (req: Request, res: Response) => {
  const { functionName, metrics } = req.body;
  try {
    const result = await monitoringService.logPerformanceMetrics(functionName, metrics);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const getMetrics = async (req: Request, res: Response) => {
  const { functionName } = req.params;
  if (typeof functionName !== 'string') {
    return res.status(400).json({ message: 'Invalid functionName provided' });
  }
  try {
    const result = await monitoringService.getPerformanceMetrics(functionName);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
