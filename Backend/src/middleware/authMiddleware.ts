import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // This should match the one in auth.ts

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    req.user = decoded;
    next();
  } catch (err: unknown) {
    const error = err as Error;
    logger.error(`Token verification failed: ${error.message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
