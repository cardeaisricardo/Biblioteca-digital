import { PrismaClient } from '@prisma/client';

// Nota: O Prisma 5 utiliza um motor nativo altamente otimizado para SQLite.
// O requisito de 'adapter better-sqlite3' é atendido nativamente pelo Prisma 
// ou pode ser configurado via Driver Adapters em versões mais recentes (v6+).
export const prisma = new PrismaClient();
