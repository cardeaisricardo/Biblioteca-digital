# Guia Passo a Passo: Rodando a Biblioteca Digital no VS Code

Este guia ajudará você a configurar e executar o projeto diretamente no seu VS Code.

## 1. Preparação Inicial
1. **Extraia o arquivo**: Descompacte o arquivo `biblioteca-digital.zip` em uma pasta de sua preferência.
2. **Abra no VS Code**:
   - Abra o VS Code.
   - Vá em `File > Open Folder...` (Arquivo > Abrir Pasta).
   - Selecione a pasta `biblioteca-digital`.

## 2. Instalando as Extensões (Opcional, mas Recomendado)
Para uma melhor experiência, instale estas extensões na aba de extensões (`Ctrl+Shift+X`):
- **Prisma**: Para ver o banco de dados.
- **REST Client**: Para testar a API.
- **SQLite Viewer**: Para visualizar os dados.

## 3. Instalando as Dependências
1. Abra o terminal integrado do VS Code (`Ctrl + '` ou `Terminal > New Terminal`).
2. Digite o comando abaixo e aperte Enter:
   ```bash
   npm install
   ```
   *Isso baixará todas as bibliotecas necessárias (Express, Prisma, JWT, etc.).*

## 4. Configurando o Banco de Dados
No mesmo terminal, você precisa criar o banco de dados SQLite e as tabelas:
1. Execute o comando de migração:
   ```bash
   npx prisma migrate dev --name init
   ```
   *Este comando criará um arquivo chamado `dev.db` dentro da pasta `prisma`.*

## 5. Rodando o Servidor
Agora, inicie o projeto em modo de desenvolvimento:
1. No terminal, digite:
   ```bash
   npm run dev
   ```
2. Você verá uma mensagem: `Servidor rodando em http://localhost:3000`.
   *Mantenha este terminal aberto enquanto estiver usando a API.*

## 6. Testando a API (O Caminho Mais Fácil)
O projeto inclui um arquivo chamado `api.http`. Se você instalou a extensão **REST Client**:
1. Abra o arquivo `api.http` no VS Code.
2. Você verá um texto pequeno escrito `Send Request` acima de cada rota (ex: acima de `POST http://localhost:3000/auth/register`).
3. **Siga esta ordem para testar**:
   - **Passo A**: Clique em `Send Request` no registro do ADMIN.
   - **Passo B**: Clique em `Send Request` no login do ADMIN. Isso vai gerar um token.
   - **Passo C**: Agora você pode testar as outras rotas (Criar Autor, Livro, etc.).
   *Nota: No arquivo `api.http`, lembre-se de substituir o ID do autor gerado no Passo C quando for criar um livro no Passo D.*

## 7. Verificando os Testes
Se quiser garantir que tudo está 100% correto:
1. Abra um novo terminal (clique no ícone `+` no terminal do VS Code).
2. Digite:
   ```bash
   npm test
   ```
   *Todos os testes devem aparecer com um check verde (✓).*

---
**Dica**: Se você fechar o VS Code e voltar depois, basta abrir o terminal e digitar `npm run dev` novamente!
