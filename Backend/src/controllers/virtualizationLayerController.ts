import type { Request, Response } from 'express';
import * as virtualizationLayerService from '../services/virtualizationLayer.js';

export const deploy = async (req: Request, res: Response) => {
  const { functionName, image } = req.body;
  if (!functionName || !image || typeof functionName !== 'string' || typeof image !== 'string') {
    return res.status(400).json({ message: 'Valid functionName and image parameters are required' });
  }
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
  if (!functionName || typeof functionName !== 'string') {
    return res.status(400).json({ message: 'Valid functionName parameter is required' });
  }
  try {
    const result = await virtualizationLayerService.removeVirtualFunction(functionName);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
