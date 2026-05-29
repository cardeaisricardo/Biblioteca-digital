import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authorSchema } from '../schemas/library.schema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const authors = await prisma.author.findMany({ include: { _count: { select: { books: true } } } });
  res.json(authors);
});

router.get('/:id', async (req: Request, res: Response) => {
  const author = await prisma.author.findUnique({
    where: { id: req.params.id },
    include: { books: true },
  });
  if (!author) return res.status(404).json({ message: 'Autor não encontrado' });
  res.json(author);
});

router.post('/', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const result = authorSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.errors });

  const author = await prisma.author.create({ data: result.data });
  res.status(201).json(author);
});

router.put('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const result = authorSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.errors });

  try {
    const author = await prisma.author.update({
      where: { id: req.params.id },
      data: result.data,
    });
    res.json(author);
  } catch (error) {
    res.status(404).json({ message: 'Autor não encontrado' });
  }
});

router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await prisma.author.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Autor não encontrado' });
  }
});

export default router;
