import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername, validatePassword } from '../models/user.js';
import logger from '../config/logger.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // In a real app, this should be from env

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = await createUser(username, password);
    logger.info(`User registered: ${newUser.username}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await validatePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User logged in: ${user.username}`);
    res.status(200).json({ token });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
