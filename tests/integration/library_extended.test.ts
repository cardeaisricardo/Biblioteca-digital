import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

const app = createApp();
let adminToken: string;
let authorId: string;
let bookId: string;

describe('Library Extended Integration', () => {
  beforeAll(async () => {
    const email = 'admin_extended_2@test.com';
    await request(app).post('/auth/register').send({
      name: 'Admin Extended',
      email: email,
      password: 'password123',
      role: 'ADMIN'
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: email,
      password: 'password123'
    });
    adminToken = loginRes.body.token;

    const author = await prisma.author.create({ data: { name: 'Test Author' } });
    authorId = author.id;
    const book = await prisma.book.create({ 
      data: { title: 'Test Book', isbn: '12345678901', authorId: authorId } 
    });
    bookId = book.id;
  });

  it('should get an author by id', async () => {
    const res = await request(app).get(`/authors/${authorId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(authorId);
  });

  it('should update an author as admin', async () => {
    const res = await request(app)
      .put(`/authors/${authorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'J.K. Rowling Updated',
        bio: 'Updated bio'
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('J.K. Rowling Updated');
  });

  it('should get a book by id', async () => {
    const res = await request(app).get(`/books/${bookId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(bookId);
  });

  it('should update a book as admin', async () => {
    const res = await request(app)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Harry Potter Updated',
        isbn: '12345678901',
        authorId: authorId
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Harry Potter Updated');
  });

  it('should delete a book as admin', async () => {
    const res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });

  it('should delete an author as admin', async () => {
  const author = await prisma.author.create({
    data: {
      name: 'Author To Delete'
    }
  });

  const res = await request(app)
    .delete(`/authors/${author.id}`)
    .set('Authorization', `Bearer ${adminToken}`);

  expect(res.status).toBe(204);
});
});
