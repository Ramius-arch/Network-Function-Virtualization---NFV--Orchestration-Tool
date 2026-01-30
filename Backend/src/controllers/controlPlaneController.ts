import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/controlPlane.js';
import * as mockService from '../services/mock/controlPlaneMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const controlPlaneService = isMockingEnabled ? mockService : realService;

export const configure = async (req: Request, res: Response) => {
  const { functionName, config } = req.body;
  try {
    const result = await controlPlaneService.configureFunction(functionName, config);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const getState = async (req: Request, res: Response) => {
  const { functionName } = req.params;
  if (typeof functionName !== 'string') {
    return res.status(400).json({ message: 'Invalid functionName provided' });
  }
  try {
    const result = await controlPlaneService.getFunctionState(functionName);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const updateState = async (req: Request, res: Response) => {
  const { functionName, state } = req.body;
  try {
    const result = await controlPlaneService.updateFunctionState(functionName, state);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
