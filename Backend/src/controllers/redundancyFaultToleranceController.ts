import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/redundancyFaultTolerance.js';
import * as mockService from '../services/mock/redundancyFaultToleranceMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const redundancyService = isMockingEnabled ? mockService : realService;

export const deployRedundant = async (req: Request, res: Response) => {
  const { functionName, image } = req.body;
  try {
    const result = await redundancyService.deployRedundantInstance(functionName, image);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const failover = async (req: Request, res: Response) => {
  const { functionName } = req.body;
  try {
    const result = await redundancyService.failoverToRedundantInstance(functionName);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const loadBalance = async (req: Request, res: Response) => {
  const { instances } = req.body;
  try {
    const result = await redundancyService.loadBalanceInstances(instances);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
