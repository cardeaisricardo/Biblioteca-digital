import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { loanSchema } from '../schemas/library.schema.js';
import { authenticate } from '../middlewares/authenticate.js';
import type { AuthRequest } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const loans = req.user?.role === 'ADMIN' 
    ? await prisma.loan.findMany({ include: { user: true, book: true } })
    : await prisma.loan.findMany({ where: { userId: req.user?.id }, include: { book: true } });
  res.json(loans);
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const result = loanSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.errors });

  const { bookId, dueDate } = result.data;

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || !book.available) {
    return res.status(400).json({ message: 'Livro não disponível para empréstimo' });
  }

  const loan = await prisma.loan.create({
    data: {
      userId: req.user!.id,
      bookId,
      dueDate,
    },
  });

  await prisma.book.update({ where: { id: bookId }, data: { available: false } });

  res.status(201).json(loan);
});

router.patch('/:id/return', authenticate, async (req: AuthRequest, res: Response) => {
  const loan = await prisma.loan.findUnique({ where: { id: req.params.id } });
  
  if (!loan) return res.status(404).json({ message: 'Empréstimo não encontrado' });
  
  // Apenas o dono do empréstimo ou ADMIN pode devolver
  if (loan.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  if (loan.status === 'RETURNED') {
    return res.status(400).json({ message: 'Livro já devolvido' });
  }

  const updatedLoan = await prisma.loan.update({
    where: { id: req.params.id },
    data: { status: 'RETURNED', returnDate: new Date() },
  });

  await prisma.book.update({ where: { id: loan.bookId }, data: { available: true } });

  res.json(updatedLoan);
});

export default router;
