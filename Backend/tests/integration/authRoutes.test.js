import request from 'supertest';
import app from '../../src/app'; // Adjust path as necessary
import { __resetUsers } from '../../src/models/user';
describe('Auth Routes', () => {
    beforeEach(() => {
        __resetUsers(); // Reset users before each test
    });
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            username: 'testuser',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
    it('should not register a user with missing credentials', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            username: 'testuser',
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Username and password are required');
    });
    it('should not register an already existing user', async () => {
        await request(app)
            .post('/auth/register')
            .send({
            username: 'testuser',
            password: 'password123',
        });
        const res = await request(app)
            .post('/auth/register')
            .send({
            username: 'testuser',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });
    it('should log in an existing user successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
            username: 'loginuser',
            password: 'password123',
        });
        const res = await request(app)
            .post('/auth/login')
            .send({
            username: 'loginuser',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
    it('should not log in with invalid credentials', async () => {
        await request(app)
            .post('/auth/register')
            .send({
            username: 'invalidlogin',
            password: 'password123',
        });
        const res = await request(app)
            .post('/auth/login')
            .send({
            username: 'invalidlogin',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
    it('should protect an API route with authentication', async () => {
        // Register and login a user
        await request(app)
            .post('/auth/register')
            .send({
            username: 'protecteduser',
            password: 'password123',
        });
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
            username: 'protecteduser',
            password: 'password123',
        });
        const token = loginRes.body.token;
        // Access a protected API route
        const res = await request(app)
            .get('/api/network-function') // Using an existing API route for testing
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
    it('should not allow access to protected API route without token', async () => {
        const res = await request(app)
            .get('/api/network-function');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
});
//# sourceMappingURL=authRoutes.test.js.map