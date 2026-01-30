import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/updateMaintenance.js';
import * as mockService from '../services/mock/updateMaintenanceMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const updateMaintenanceService = isMockingEnabled ? mockService : realService;

export const updateVersion = async (req: Request, res: Response) => {
  const { functionName, newVersion } = req.body;
  try {
    const result = await updateMaintenanceService.updateFunctionVersion(functionName, newVersion);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const rollbackVersion = async (req: Request, res: Response) => {
  const { functionName, previousVersion } = req.body;
  try {
    const result = await updateMaintenanceService.rollbackFunctionVersion(functionName, previousVersion);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const patch = async (req: Request, res: Response) => {
  const { functionName, patchDetails } = req.body;
  try {
    const result = await updateMaintenanceService.applyPatch(functionName, patchDetails);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
