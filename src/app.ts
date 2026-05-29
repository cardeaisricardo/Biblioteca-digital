import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import authorRoutes from './routes/authors.js';
import bookRoutes from './routes/books.js';
import loanRoutes from './routes/loans.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API da Biblioteca Digital — Projeto C2' });
  });

  app.use('/auth', authRoutes);
  app.use('/authors', authorRoutes);
  app.use('/books', bookRoutes);
  app.use('/loans', loanRoutes);

  // Tratamento de erros global
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  });

  return app;
}
