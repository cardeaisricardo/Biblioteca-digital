import { z } from 'zod';

export const authorSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  birthDate: z.string().datetime().optional().or(z.string().transform(val => new Date(val))),
});

export const bookSchema = z.object({
  title: z.string().min(1),
  isbn: z.string().min(10),
  summary: z.string().optional(),
  publishedAt: z.string().datetime().optional().or(z.string().transform(val => new Date(val))),
  authorId: z.string(),
});

export const loanSchema = z.object({
  bookId: z.string(),
  dueDate: z.string().datetime().or(z.string().transform(val => new Date(val))),
});
