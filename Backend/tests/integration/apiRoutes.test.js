import request from 'supertest';
import app from '../../src/app'; // Import the configured Express app
import { __resetUsers } from '../../src/models/user'; // To reset users for auth tests
import * as resourceAllocatorService from '../../src/services/resourceAllocator';
import * as controlPlaneService from '../../src/services/controlPlane';
// Mock actual service calls so tests are isolated from real service logic
jest.mock('../../src/services/resourceAllocator');
jest.mock('../../src/services/controlPlane');
describe('Protected API Routes Integration Tests', () => {
    let authToken;
    beforeAll(async () => {
        // Register and login a user to get an auth token for all tests
        __resetUsers(); // Ensure a clean state for user registration
        await request(app)
            .post('/auth/register')
            .send({ username: 'apitestuser', password: 'password123' });
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ username: 'apitestuser', password: 'password123' });
        authToken = loginRes.body.token;
    });
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks(); // Clear all mocks
    });
    it('should allow access to /api/resource-allocator/allocate with a valid token', async () => {
        resourceAllocatorService.allocateResources.mockResolvedValueOnce({
            functionName: 'testFunction',
            status: 'allocated',
        });
        const response = await request(app)
            .post('/api/resource-allocator/allocate')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ functionName: 'testFunction', resources: { cpu: '2 Cores' } });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('status', 'allocated');
        expect(resourceAllocatorService.allocateResources).toHaveBeenCalledWith('testFunction', { cpu: '2 Cores' });
    });
    it('should allow access to /api/resource-allocator/scale with a valid token', async () => {
        resourceAllocatorService.scaleResources.mockResolvedValueOnce({
            functionName: 'testFunction',
            status: 'scaled_up',
        });
        const response = await request(app)
            .post('/api/resource-allocator/scale')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ functionName: 'testFunction', scale: 'up' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'scaled_up');
        expect(resourceAllocatorService.scaleResources).toHaveBeenCalledWith('testFunction', 'up');
    });
    it('should allow access to /api/control-plane/configure with a valid token', async () => {
        controlPlaneService.configureFunction.mockResolvedValueOnce({
            message: 'Function configured successfully.',
            functionName: 'centralFunc',
            configApplied: { mem: '1GB' }
        });
        const response = await request(app)
            .post('/api/control-plane/configure')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ functionName: 'centralFunc', config: { mem: '1GB' } }); // Use 'config' as per controller
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Function configured successfully.');
        expect(controlPlaneService.configureFunction).toHaveBeenCalledWith('centralFunc', { mem: '1GB' });
    });
    it('should deny access to /api/resource-allocator/allocate without a token', async () => {
        const response = await request(app)
            .post('/api/resource-allocator/allocate')
            .send({ functionName: 'testFunction', resources: { cpu: '2 Cores' } });
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });
    it('should deny access to /api/control-plane/configure with an invalid token', async () => {
        const response = await request(app)
            .post('/api/control-plane/configure')
            .set('Authorization', `Bearer invalidtoken`)
            .send({ functionName: 'centralFunc', config: { mem: '1GB' } });
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Token is not valid');
    });
});
//# sourceMappingURL=apiRoutes.test.js.map