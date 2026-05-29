# Biblioteca Digital API — Projeto C2

API REST completa desenvolvida em **Node.js + TypeScript** para gestão de uma biblioteca digital, com suporte a autenticação, controle de acesso e testes automatizados.

## 📚 Domínio
O sistema gerencia quatro entidades principais:
- **Usuários**: Cadastro e autenticação com papéis `USER` e `ADMIN`.
- **Autores**: Cadastro de escritores com biografia e data de nascimento.
- **Livros**: Títulos vinculados a autores, identificados por ISBN.
- **Empréstimos**: Registro de retirada e devolução de livros por usuários.

## 🛠️ Stack Tecnológica
- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript (ES Modules)
- **Framework**: Express.js
- **Banco de Dados**: SQLite (via Prisma ORM)
- **Autenticação**: JWT & bcryptjs
- **Validação**: Zod
- **Testes**: Vitest & Supertest

## 🚀 Como rodar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` baseado no `.env.example`.

3. **Configurar o banco de dados**:
   ```bash
   npx prisma migrate dev
   ```

4. **Iniciar o servidor**:
   ```bash
   npm run dev
   ```

## 🧪 Testes
Para rodar a suíte de testes:
```bash
npm test
```

## 🛣️ Rotas Principais

### Autenticação
- `POST /auth/register`: Registro de usuário.
- `POST /auth/login`: Login e geração de token.
- `GET /auth/me`: Dados do usuário logado.

### Autores & Livros
- `GET /authors`: Listar autores.
- `POST /authors`: Criar autor (Apenas ADMIN).
- `GET /books`: Listar livros.
- `POST /books`: Criar livro (Apenas ADMIN).

### Empréstimos
- `POST /loans`: Realizar empréstimo de um livro disponível.
- `PATCH /loans/:id/return`: Devolver um livro.
- `GET /loans`: Listar empréstimos (Usuário vê os seus, ADMIN vê todos).
