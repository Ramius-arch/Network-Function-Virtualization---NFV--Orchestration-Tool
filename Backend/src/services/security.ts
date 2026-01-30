import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const enhanceSecurity = (app: express.Application) => {
  // Use Helmet for setting secure HTTP headers
  app.use(helmet());

  // Rate limiting to prevent brute force attacks
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  console.log('Security measures applied.');
};
