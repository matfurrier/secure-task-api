# API REST JWT

[🇬🇧 English Version](#english-version) | [🇧🇷 Versão em Português](#versão-em-português)

---
<a name="english-version"></a>

## 🇬🇧 English Version

A REST API for task management featuring JWT authentication and Role-Based Access Control (RBAC). Built with Node.js, Express, Prisma, and PostgreSQL. Includes Docker support for development & production, and automated tests with Jest & Supertest.

### ✨ Features

-   JWT Authentication (Register, Login)
-   Route protection middleware
-   Full CRUD for Tasks (linked to the authenticated user)
-   Simple RBAC (admin can delete any task, regular users only their own)
-   API Documentation with Swagger
-   Dockerized for development and production environments
-   Automated tests with Jest & Supertest
-   Database seeding for pre-populating test users

### 🛠️ Technologies Used

-   Node.js
-   Express.js
-   PostgreSQL
-   Prisma ORM
-   JSON Web Tokens (JWT) for authentication
-   `bcryptjs` for password hashing
-   Docker & Docker Compose
-   Jest for testing framework
-   Supertest for HTTP assertion
-   Swagger (`swagger-jsdoc`, `swagger-ui-express`) for API documentation
-   `dotenv` for environment variable management
-   `cross-env` for cross-platform environment variable setting

### 🚀 Getting Started with Docker

1.  **Prerequisites:** Ensure you have Docker and Docker Compose installed.
2.  **Clone:** Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd api-rest-jwt
    ```
3.  **Environment File:** Create a `.env` file in the project root. You can copy `.env.example` if provided, or use this template:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@db:5432/api_rest_jwt?schema=public"
    JWT_SECRET="your-very-strong-and-secret-key"
    PORT=3120 # Host port where the app will be accessible
    ```
    Replace `your-very-strong-and-secret-key` with a secure secret. `PORT` is the host machine port that will map to the container's port 3000 (or the port defined in `src/index.js`).
4.  **Build & Run:**
    ```bash
    docker compose up -d --build
    ```
5.  **Access:** The API will be available at `http://localhost:<PORT_FROM_ENV>`. (e.g., `http://localhost:3120`).
6.  **Seed Database (Optional):** To populate the database with initial test users:
    ```bash
    docker compose exec app npx prisma db seed
    ```

### 🧪 Running Tests

1.  **Install Dependencies:** If you haven't already, install project dependencies (mainly for local test development if not using Docker for tests):
    ```bash
    npm install
    ```
2.  **Test Environment File:** Create a `.env.test` file in the project root:
    ```env
    DATABASE_URL="file:./test.db"
    JWT_SECRET="test-secret-for-jest-do-not-use-in-prod"
    PORT=3121 # Using a different port for tests
    ```
3.  **Run Tests:**
    ```bash
    npm test
    ```
    This command will also generate a coverage report in the `coverage/` directory.

### 📊 Test Coverage

[![Test Coverage](https://img.shields.io/badge/coverage-0%25-red)](#)
<!-- After running `npm test`, update the badge URL with the percentage from `coverage/coverage-summary.json` and shields.io. Link to `coverage/lcov-report/index.html` -->

### 🔑 Seed User Credentials

The seed script creates the following users for testing (password is the same for simpler manual testing):

-   **Common User:**
    -   Username: `testuser`
    -   Password: `password123`
-   **Admin User:**
    -   Username: `adminuser`
    -   Password: `adminpass123`

### 📄 API Documentation (Swagger)

Once the application is running, Swagger documentation is available at:
[`/api-docs`](http://localhost:3120/api-docs) (Assuming `PORT` is 3120)

---
<a name="versão-em-português"></a>

## 🇧🇷 Versão em Português

Uma API REST para gerenciamento de tarefas com autenticação JWT e Controle de Acesso Baseado em Função (RBAC). Construída com Node.js, Express, Prisma e PostgreSQL. Inclui suporte a Docker para desenvolvimento e produção, e testes automatizados com Jest & Supertest.

### ✨ Funcionalidades

-   Autenticação JWT (Registro, Login)
-   Middleware de proteção de rotas
-   CRUD completo de Tarefas (vinculadas ao usuário autenticado)
-   RBAC simples (administrador pode deletar qualquer tarefa, usuários comuns apenas as suas)
-   Documentação da API com Swagger
-   Docker para ambientes de desenvolvimento e produção
-   Testes automatizados com Jest & Supertest
-   Seed do banco de dados para pré-popular usuários de teste

### 🛠️ Tecnologias Utilizadas

-   Node.js
-   Express.js
-   PostgreSQL
-   Prisma ORM
-   JSON Web Tokens (JWT) para autenticação
-   `bcryptjs` para hash de senhas
-   Docker & Docker Compose
-   Jest para framework de testes
-   Supertest para asserções HTTP
-   Swagger (`swagger-jsdoc`, `swagger-ui-express`) para documentação da API
-   `dotenv` para gerenciamento de variáveis de ambiente
-   `cross-env` para configuração de variáveis de ambiente multi-plataforma

### 🚀 Começando com Docker

1.  **Pré-requisitos:** Certifique-se de que você possui Docker e Docker Compose instalados.
2.  **Clonar:** Clone o repositório:
    ```bash
    git clone <url-do-seu-repositorio>
    cd api-rest-jwt
    ```
3.  **Arquivo de Ambiente:** Crie um arquivo `.env` na raiz do projeto. Você pode copiar o `.env.example` se fornecido, ou usar este template:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@db:5432/api_rest_jwt?schema=public"
    JWT_SECRET="sua-chave-super-secreta"
    PORT=3120 # Porta do host onde a aplicação estará acessível
    ```
    Substitua `sua-chave-super-secreta` por uma chave segura. `PORT` é a porta da máquina host que mapeará para a porta 3000 do container (ou a porta definida em `src/index.js`).
4.  **Construir & Executar:**
    ```bash
    docker compose up -d --build
    ```
5.  **Acesso:** A API estará disponível em `http://localhost:<PORTA_DO_ENV>`. (ex: `http://localhost:3120`).
6.  **Popular Banco (Opcional):** Para popular o banco de dados com usuários de teste iniciais:
    ```bash
    docker compose exec app npx prisma db seed
    ```

### 🧪 Executando Testes

1.  **Instalar Dependências:** Se ainda não o fez, instale as dependências do projeto (principalmente para desenvolvimento de testes locais se não estiver usando Docker para testes):
    ```bash
    npm install
    ```
2.  **Arquivo de Ambiente para Testes:** Crie um arquivo `.env.test` na raiz do projeto:
    ```env
    DATABASE_URL="file:./test.db"
    JWT_SECRET="test-secret-para-jest-nao-usar-em-prod"
    PORT=3121 # Usando uma porta diferente para os testes
    ```
3.  **Executar Testes:**
    ```bash
    npm test
    ```
    Este comando também gerará um relatório de cobertura no diretório `coverage/`.

### 📊 Cobertura de Testes

[![Test Coverage](https://img.shields.io/badge/coverage-0%25-red)](#)
<!-- Após executar `npm test`, atualize a URL do badge com a porcentagem de `coverage/coverage-summary.json` e shields.io. Link para `coverage/lcov-report/index.html` -->

### 🔑 Credenciais dos Usuários de Seed

O script de seed cria os seguintes usuários para teste (a senha é a mesma para facilitar testes manuais):

-   **Usuário Comum:**
    -   Username: `testuser`
    -   Password: `password123`
-   **Usuário Admin:**
    -   Username: `adminuser`
    -   Password: `adminpass123`

### 📄 Documentação da API (Swagger)

Com a aplicação em execução, a documentação Swagger está disponível em:
[`/api-docs`](http://localhost:3120/api-docs) (Assumindo que `PORT` seja 3120) 