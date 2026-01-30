import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction /* eslint-disable-line @typescript-eslint/no-unused-vars */,
) => {
  const error = err as Error;
  logger.error(`Error: ${error.message}, Stack: ${error.stack}, Path: ${req.path}`);

  let statusCode = 500;
  if (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    typeof (err as { statusCode: number }).statusCode === 'number'
  ) {
    statusCode = (err as { statusCode: number }).statusCode;
  }
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export default errorMiddleware;
