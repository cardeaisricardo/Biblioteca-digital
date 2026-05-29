import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { bookSchema } from '../schemas/library.schema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const books = await prisma.book.findMany({ include: { author: true } });
  res.json(books);
});

router.get('/:id', async (req: Request, res: Response) => {
  const book = await prisma.book.findUnique({
    where: { id: req.params.id },
    include: { author: true },
  });
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' });
  res.json(book);
});

router.post('/', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const result = bookSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.errors });

  const book = await prisma.book.create({ data: result.data });
  res.status(201).json(book);
});

router.put('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const result = bookSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.errors });

  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: result.data,
    });
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

export default router;
