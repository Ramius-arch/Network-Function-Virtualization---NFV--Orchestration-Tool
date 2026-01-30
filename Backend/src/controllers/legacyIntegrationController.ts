import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../services/legacyIntegration.js';
import * as mockService from '../services/mock/legacyIntegrationMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const legacyIntegrationService = isMockingEnabled ? mockService : realService;

export const wrap = async (req: Request, res: Response) => {
  const { legacyCommand } = req.body;
  try {
    const result = await legacyIntegrationService.wrapLegacyFunction(legacyCommand);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const test = async (req: Request, res: Response) => {
  const { apiUrl } = req.body;
  try {
    const result = await legacyIntegrationService.testLegacyAPI(apiUrl);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
