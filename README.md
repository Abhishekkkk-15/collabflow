
## 🧩 Monorepo Setup & Installation
Collabflow uses a **monorepo workspace architecture** to manage frontend, backend, and worker services in a single repository.

### 📦 Requirements
Make sure you have the following installed:

- **Node.js** ≥ 20
- **pnpm** ≥ 8
- **PostgreSQL**
- **Redis**
- **Docker** (optional, for local DB & Redis)

## 📂 Repository Structure

```bash
.
├── apps/
│   ├── api/        # Backend API ( Nest server)
│   ├── web/        # Frontend web application (Nextjs)
│   └── workers/    # Background workers (BullMQ / Redis)
│
├── packages/
│   ├── db/         # Database layer (Prisma / ORM / schema)
│   └── types/      # Shared TypeScript types
│
├── node_modules/
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── turbo.json
```

## ⚙️ Environment Configuration
    
Each service has its own `.env` file.

### Backend (`apps/api/.env`)
 ```env
 NEXT_PUBLIC_API_URL=
NEXTAUTH_SECRET=
NODE_ENV=
PORT=
REDIS_URL=
RESEND_API_KEY=
```    

### Frontend (`apps/web/.env`)
```env
NEXT_PUBLIC_API_URL=
AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
DATABASE_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_WORKER_URL=
```

### Worker (`apps/workers/.env`)
```env 
REDIS_URL=
RESEND_API_KEY=
NEXT_PUBLIC_API_URL=
PORT=
```

### Database (`packages/db/.env`)
```env
DATABASE_URL=
RESEND_API_KEY=
```

## Installation Steps
- Clone the repository
``` bash
git clone https://github.com/abhishekkkk.in/collabflow.git
cd collabflow
```

- Install dependencies (workspace-wide)
```bash
pnpm install
```
> This installs dependencies for all apps and shared packages.

### Database Setup
``` bash
pnpm --filter @collabflow/db prisma generate
pnpm --filter @collabflow/db prisma migrate dev
```

(Optional) Open Prisma Studio:

```bash
pnpm --filter @collabflow/db prisma studio
```

### Start Services (Development)
``` 
pnpm dev
```

OR start individually
```bash 
# Backend API
pnpm --filter api dev

# Frontend
pnpm --filter web dev

# Workers
pnpm --filter workers dev

# Shared packages
pnpm --filter @collabflow/types build
pnpm --filter @collabflow/db build
```

### Background Workers
```bash
pnpm --filter workers start
```

### Production Build
```bash
pnpm build
```