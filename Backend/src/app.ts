import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import api from './routes/api.js';
import auth from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js'; // Import error middleware

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', auth);
app.use('/api', authMiddleware, api);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

export default app;
