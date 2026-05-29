import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

const app = createApp();
let userToken: string;
let userId: string;
let bookId: string;

describe('Loans Integration', () => {
  beforeAll(async () => {
    // Limpar e preparar dados
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    const userRes = await request(app).post('/auth/register').send({
      name: 'User',
      email: 'user@test.com',
      password: 'password123'
    });
    userId = userRes.body.id;

    const loginRes = await request(app).post('/auth/login').send({
      email: 'user@test.com',
      password: 'password123'
    });
    userToken = loginRes.body.token;

    const author = await prisma.author.create({ data: { name: 'Author' } });
    const book = await prisma.book.create({
      data: { title: 'Book', isbn: '111222333', authorId: author.id }
    });
    bookId = book.id;
  });

  it('should create a loan', async () => {
    const res = await request(app)
      .post('/loans')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bookId: bookId,
        dueDate: new Date(Date.now() + 86400000).toISOString()
      });

    expect(res.status).toBe(201);
    expect(res.body.bookId).toBe(bookId);
    
    const updatedBook = await prisma.book.findUnique({ where: { id: bookId } });
    expect(updatedBook?.available).toBe(false);
  });

  it('should not loan an unavailable book', async () => {
    const res = await request(app)
      .post('/loans')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bookId: bookId,
        dueDate: new Date().toISOString()
      });

    expect(res.status).toBe(400);
  });

  it('should return a book', async () => {
    const loan = await prisma.loan.findFirst({ where: { userId } });
    const res = await request(app)
      .patch(`/loans/${loan!.id}/return`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('RETURNED');

    const updatedBook = await prisma.book.findUnique({ where: { id: bookId } });
    expect(updatedBook?.available).toBe(true);
  });
});
