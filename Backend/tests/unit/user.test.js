import { createUser, findUserByUsername, validatePassword, __resetUsers } from '../../src/models/user';
import bcrypt from 'bcryptjs';
describe('User Model', () => {
    beforeEach(() => {
        // Clear the in-memory users array before each test
        // This is a simplified way to reset state for in-memory models
        // In a real application, you might mock the database or use a test database
        __resetUsers(); // Correctly calling the reset function
    });
    it('should create a new user and hash the password', async () => {
        const username = 'testuser';
        const password = 'password123';
        const user = await createUser(username, password);
        expect(user).toBeDefined();
        expect(user.username).toBe(username);
        expect(user.passwordHash).toBeDefined();
        expect(user.passwordHash).not.toBe(password); // Password should be hashed
    });
    it('should find a user by username', async () => {
        const username = 'findme';
        const password = 'securepassword';
        await createUser(username, password);
        const foundUser = await findUserByUsername(username);
        expect(foundUser).toBeDefined();
        expect(foundUser?.username).toBe(username);
    });
    it('should return undefined if user is not found', async () => {
        const foundUser = await findUserByUsername('nonexistent');
        expect(foundUser).toBeUndefined();
    });
    it('should validate a correct password', async () => {
        const username = 'validuser';
        const password = 'correcthorsebatterystaple';
        const user = await createUser(username, password);
        const isValid = await validatePassword(password, user.passwordHash);
        expect(isValid).toBe(true);
    });
    it('should invalidate an incorrect password', async () => {
        const username = 'invaliduser';
        const password = 'wrongpassword';
        const user = await createUser(username, password);
        const isValid = await validatePassword('incorrect', user.passwordHash);
        expect(isValid).toBe(false);
    });
});
//# sourceMappingURL=user.test.js.map