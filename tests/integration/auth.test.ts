import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

const app = createApp();

describe('Auth Integration', () => {
  beforeAll(async () => {
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();
});

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should not register user with existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
  });

  it('should login and return token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
