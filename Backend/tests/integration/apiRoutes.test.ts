import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import app from '../../src/app';
import { __resetUsers } from '../../src/models/user';

describe('Protected API Routes Integration Tests', () => {
  let authToken: string;

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

  it('should allow access to /api/resource-allocator/allocate with a valid token', async () => {
    const response = await request(app)
      .post('/api/resource-allocator/allocate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ functionName: 'testFunction', resources: { cpu: '2 Cores' } });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('status', 'allocated');
    expect(response.body).toHaveProperty('functionName', 'testFunction');
  });

  it('should allow access to /api/resource-allocator/scale with a valid token', async () => {
    const response = await request(app)
      .post('/api/resource-allocator/scale')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ functionName: 'testFunction', scale: 'up' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'scaled_up');
    expect(response.body).toHaveProperty('functionName', 'testFunction');
  });

  it('should allow access to /api/control-plane/configure with a valid token', async () => {
    const response = await request(app)
      .post('/api/control-plane/configure')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ functionName: 'centralFunc', config: { mem: '1GB' } });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'configured');
    expect(response.body).toHaveProperty('functionName', 'centralFunc');
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
