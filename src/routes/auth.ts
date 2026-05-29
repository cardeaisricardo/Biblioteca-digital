import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword, generateToken } from '../lib/auth.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { authenticate } from '../middlewares/authenticate.js';
import type { AuthRequest } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { name, email, password, role } = result.data;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: 'Email já cadastrado' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || 'USER' },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
});

router.post('/login', async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = generateToken({ id: user.id, role: user.role });
  res.json({ token });
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

export default router;
