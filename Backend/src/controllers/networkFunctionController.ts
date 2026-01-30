import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as realService from '../models/networkFunction.js';
import * as mockService from '../services/mock/networkFunctionMock.js';

dotenv.config();

const isMockingEnabled = process.env.MOCK_DATA === 'true';
const networkFunctionService = isMockingEnabled ? mockService : realService;

export const getAll = async (req: Request, res: Response) => {
  try {
    const functions = await networkFunctionService.getAllFunctions();
    res.status(200).json(functions);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const add = async (req: Request, res: Response) => {
  const { functionName, specs } = req.body;
  try {
    const result = await networkFunctionService.addFunction(functionName, specs);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { functionName, specs } = req.body;
  try {
    const result = await networkFunctionService.updateFunction(functionName, specs);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
