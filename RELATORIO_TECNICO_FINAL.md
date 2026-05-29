# Relatório Técnico Final — Biblioteca Digital (API REST)

Este documento detalha as decisões de engenharia, a arquitetura do sistema e o papel de cada componente no projeto da Biblioteca Digital. O projeto foi otimizado para ser executado no Windows com Node.js v24+, garantindo estabilidade e alta cobertura de testes.

---

## 1. Arquitetura e Decisões de Design

### Por que Node.js com TypeScript?
O **Node.js** foi escolhido por sua eficiência em operações de I/O (entrada e saída de dados), ideal para APIs REST. O **TypeScript** foi adicionado para trazer segurança ao código. Através da tipagem estática, conseguimos evitar erros comuns (como tentar ler uma propriedade que não existe) antes mesmo de rodar o código.

### Por que Express.js?
O **Express** é o framework mais estável e flexível do ecossistema Node.js. Ele permite organizar as rotas de forma modular, facilitando a manutenção e o crescimento do projeto.

### Por que Prisma ORM em vez de SQL puro?
O **Prisma** atua como uma ponte inteligente entre o código e o banco de dados.
*   **Segurança de Tipos**: Ele gera automaticamente tipos TypeScript baseados no banco de dados.
*   **Migrações**: O Prisma gerencia as mudanças no banco (criar tabelas, adicionar colunas) de forma versionada, garantindo que o banco de dados em sua máquina seja idêntico ao de produção.
*   **Estabilidade no Windows**: Optamos pelo motor nativo do Prisma para SQLite, removendo o `better-sqlite3` para evitar problemas de compilação em ambientes Windows sem ferramentas de C++ instaladas.

---

## 2. Dependências e seus Objetivos

| Dependência | Objetivo | Por que é necessária? |
| :--- | :--- | :--- |
| **bcryptjs** | Criptografia de senhas | **Nunca** salvamos senhas em texto puro. O bcrypt transforma a senha em um "hash" impossível de reverter. |
| **jsonwebtoken (JWT)** | Autenticação sem estado | Permite que o servidor saiba quem é o usuário sem precisar salvar "sessões" na memória, usando um token assinado digitalmente. |
| **zod** | Validação de esquemas | Garante que os dados enviados pelo usuário (como e-mail e data) estejam no formato correto antes de processá-los. |
| **cors** | Segurança de acesso | Permite (ou bloqueia) que outros sites ou aplicativos acessem a sua API. |
| **dotenv** | Configuração de ambiente | Protege informações sensíveis (como a chave secreta do JWT) mantendo-as em um arquivo `.env` separado do código. |

---

## 3. Extensões do VS Code e seus Papéis

*   **REST Client**: Transforma o VS Code em uma ferramenta de testes. O arquivo `api.http` permite simular requisições de forma visual e rápida, sem precisar de softwares externos.
*   **Prisma**: Oferece autocompletar e realce de cores no arquivo `schema.prisma`, evitando erros de sintaxe no banco de dados.
*   **SQLite Viewer**: Permite que você abra o arquivo `dev.db` e veja seus dados como uma planilha, facilitando a depuração.
*   **ESLint/Prettier**: Mantêm o código limpo e padronizado automaticamente sempre que você salva o arquivo.

---

## 4. Estrutura de Pastas e Fluxo

1.  **`src/lib`**: Contém as configurações centrais (Prisma, lógica de Token). É o "coração" técnico.
2.  **`src/schemas`**: Onde definimos as "regras" do que pode entrar no sistema (via Zod).
3.  **`src/middlewares`**: Os "seguranças" da API. Eles verificam se o token é válido (`authenticate`) e se o usuário tem permissão (`authorize`) antes de deixar a requisição passar.
4.  **`src/routes`**: Onde a lógica de negócio acontece. Cada arquivo gerencia uma entidade (Livros, Autores, etc.).

---

## 5. Qualidade e Testes

Implementamos uma suíte de testes com **Vitest** e **Supertest** atingindo **88% de cobertura**.
*   **Testes Unitários**: Testam funções isoladas (ex: criptografia).
*   **Testes de Integração**: Testam o fluxo completo (ex: registrar -> logar -> criar livro).
*   **Objetivo**: Garantir que, se você mudar uma linha de código no futuro, o sistema avisará imediatamente se algo parou de funcionar.

---

## 6. Ajustes Específicos para Windows/Node v24

*   **`import type`**: Usamos esta sintaxe para evitar que o Node.js tente executar tipos do TypeScript como se fossem funções, resolvendo o erro de `NextFunction`.
*   **Remoção de dependências nativas**: Retiramos o `better-sqlite3` para garantir que o `npm install` funcione em qualquer computador sem exigir Python ou compiladores C++.
*   **CUIDs**: Usamos identificadores CUID em vez de IDs numéricos simples, o que é uma prática recomendada para sistemas modernos e seguros.
