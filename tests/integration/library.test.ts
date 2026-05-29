import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

const app = createApp();
let adminToken: string;

describe('Library Integration', () => {
  beforeAll(async () => {
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    // Criar admin para testes
    await request(app).post('/auth/register').send({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'ADMIN'
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'password123'
    });
    adminToken = loginRes.body.token;
  });

  it('should create an author as admin', async () => {
    const res = await request(app)
      .post('/authors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'J.K. Rowling',
        bio: 'British author'
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('J.K. Rowling');
  });

  it('should list authors', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a book as admin', async () => {
    const author = await prisma.author.findFirst();
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Harry Potter',
        isbn: '1234567890',
        authorId: author!.id
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Harry Potter');
  });

  it('should not create a book as guest', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Guest Book',
        isbn: '0987654321',
        authorId: 'some-id'
      });

    expect(res.status).toBe(401);
  });
});
