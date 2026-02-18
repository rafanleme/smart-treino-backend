# SmartTreino Backend (Node.js)

Backend API em Node.js/Express/TypeScript/Prisma para o SmartTreino.

## Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Linguagem**: TypeScript (strict mode)
- **ORM**: Prisma 5.22
- **Database**: MySQL
- **Autenticação**: JWT + Google OAuth2
- **Validação**: Zod
- **Testes**: Jest + Supertest

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="mysql://user:password@host:3306/database"

JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1h

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

ANTHROPIC_API_KEY=your-anthropic-api-key

FRONTEND_URL=http://localhost:5173
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Rodar migrations

```bash
npm run prisma:migrate
```

### 5. Popular banco de dados (seeds)

```bash
npm run seed
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:8000`.

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento com hot reload
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em produção (requer build primeiro)
- `npm test` - Roda testes com Jest
- `npm run lint` - Verifica código com ESLint
- `npm run format` - Formata código com Prettier
- `npm run prisma:migrate` - Roda migrations do Prisma
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:studio` - Abre Prisma Studio (GUI do banco)
- `npm run seed` - Popula banco com dados iniciais

## Estrutura de Pastas

```
backend-node/
├── src/
│   ├── config/          # Configurações (env, database, jwt, passport)
│   ├── middlewares/     # Middlewares (auth, errorHandler, cors, validate)
│   ├── modules/         # Módulos por domínio
│   │   ├── auth/
│   │   ├── exercises/
│   │   ├── workouts/
│   │   ├── sessions/
│   │   ├── assessments/
│   │   ├── gamification/
│   │   └── ai/
│   ├── events/          # Event emitter setup
│   ├── listeners/       # Event listeners
│   ├── utils/           # Utilitários (errors, asyncHandler, response)
│   ├── types/           # Type definitions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── prisma/
│   ├── schema.prisma    # Prisma schema
│   └── seeds/           # Database seeds
├── tests/               # Testes
└── package.json
```

## Endpoints da API

### Autenticação

- `POST /api/v1/auth/google` - Login com Google OAuth2
- `GET /api/v1/auth/me` - Obter perfil do usuário autenticado
- `PUT /api/v1/auth/me` - Atualizar perfil
- `POST /api/v1/auth/refresh` - Renovar token JWT
- `POST /api/v1/auth/logout` - Logout

### Exercícios

- `GET /api/v1/exercises` - Listar exercícios (com filtros)
- `POST /api/v1/exercises` - Criar exercício customizado
- `GET /api/v1/exercises/:id` - Obter detalhes do exercício
- `PUT /api/v1/exercises/:id` - Atualizar exercício customizado
- `DELETE /api/v1/exercises/:id` - Deletar exercício customizado

### Treinos

- `GET /api/v1/workouts` - Listar treinos do usuário
- `POST /api/v1/workouts` - Criar treino
- `GET /api/v1/workouts/:id` - Obter detalhes do treino
- `PUT /api/v1/workouts/:id` - Atualizar treino
- `DELETE /api/v1/workouts/:id` - Deletar treino
- `POST /api/v1/workouts/:id/duplicate` - Duplicar treino

### Sessões de Treino

- `GET /api/v1/sessions` - Listar sessões
- `POST /api/v1/sessions` - Iniciar sessão
- `GET /api/v1/sessions/:id` - Obter detalhes da sessão
- `PUT /api/v1/sessions/:id` - Finalizar/abandonar sessão
- `DELETE /api/v1/sessions/:id` - Deletar sessão

### Avaliações Físicas

- `GET /api/v1/assessments` - Listar avaliações
- `POST /api/v1/assessments` - Criar avaliação
- `GET /api/v1/assessments/:id` - Obter detalhes da avaliação
- `PUT /api/v1/assessments/:id` - Atualizar avaliação
- `DELETE /api/v1/assessments/:id` - Deletar avaliação
- `GET /api/v1/assessments/compare` - Comparar avaliações
- `GET /api/v1/assessments/progress` - Progresso ao longo do tempo

### Gamificação

- `GET /api/v1/gamification/achievements` - Listar conquistas
- `GET /api/v1/gamification/achievements/recent` - Conquistas recentes
- `GET /api/v1/gamification/personal-records` - Recordes pessoais
- `GET /api/v1/gamification/streaks` - Sequências de atividade
- `GET /api/v1/gamification/stats/dashboard` - Estatísticas do dashboard

### IA

- `POST /api/v1/ai/generate-workout` - Gerar treino com IA
- `POST /api/v1/ai/suggest-progression` - Sugerir progressão

## Desenvolvimento

### Rodando testes

```bash
npm test
```

### Acessando o banco de dados

```bash
npm run prisma:studio
```

### Criando migrations

```bash
npx prisma migrate dev --name nome_da_migration
```

## Produção

### Build

```bash
npm run build
```

### Iniciar

```bash
npm start
```

## License

MIT
