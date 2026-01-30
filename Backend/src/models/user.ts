import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

// In-memory database for users
let users: User[] = []; // Changed to 'let' to allow reassignment

export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  return users.find((user) => user.username === username);
};

export const createUser = async (username: string, password: string): Promise<User> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = { id: (users.length + 1).toString(), username, passwordHash };
  users.push(newUser);
  return newUser;
};

export const validatePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

// For testing purposes only: reset the in-memory users array
export const __resetUsers = () => {
  users = [];
};
