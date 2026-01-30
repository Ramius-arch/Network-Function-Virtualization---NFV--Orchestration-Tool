import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/dataPlane.js';
import * as mockService from '../services/mock/dataPlaneMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const dataPlaneService = isMockingEnabled ? mockService : realService;

export const route = async (req: Request, res: Response) => {
  const { source, destination } = req.body;
  try {
    const result = await dataPlaneService.routeTraffic(source, destination);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const clear = async (req: Request, res: Response) => {
  try {
    const result = await dataPlaneService.clearTrafficRules();
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
