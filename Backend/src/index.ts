import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

dotenv.config();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  if (process.env.MOCK_DATA !== 'true') {
    // Conditionally connect to DB
    connectDB();
  }
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default app;
