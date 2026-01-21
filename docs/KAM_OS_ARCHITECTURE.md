# KAM OS - Architecture Documentation

## System Overview

KAM OS is a multi-tenant SaaS application built with a modern microservices-ready architecture. The system consists of a FastAPI backend with PostgreSQL database and a React frontend with Vite build system.

## Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL with asyncpg
- **ORM/Query:** Raw SQL with asyncpg (no ORM)
- **Authentication:** JWT (python-jose) with bcrypt password hashing
- **AI Integration:** OpenAI API (GPT-4o-mini, Whisper)
- **Email:** Resend API
- **Hosting:** Railway

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix primitives)
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Context + Local State
- **Excel Export:** xlsx library

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React     │  │   Vite      │  │  Tailwind   │              │
│  │   Router    │  │   Build     │  │    CSS      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Service Layer                     │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │ authAPI │ │accountsAPI│ │kamPlanAPI│ │reportsAPI│     │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                    Axios + Interceptors                          │
│                    (Auto Token Refresh)                          │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    FastAPI Application                   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │  Auth   │ │ Accounts│ │KAM Plans│ │ Reports │       │    │
│  │  │ Router  │ │ Router  │ │ Router  │ │ Router  │       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Service Layer                         │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐              │    │
│  │  │ AI Meeting│ │   Email   │ │   Auth    │              │    │
│  │  │  Service  │ │  Service  │ │  Service  │              │    │
│  │  └───────────┘ └───────────┘ └───────────┘              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Repository Layer                       │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │  User   │ │ Account │ │ Contact │ │ Meeting │       │    │
│  │  │  Repo   │ │  Repo   │ │  Repo   │ │  Repo   │       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                      asyncpg Pool                                │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PostgreSQL                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Database Schema                       │    │
│  │  organizations │ users │ accounts │ contacts │ meetings │    │
│  │  opportunities │ activities │ kam_plans │ value_matrix  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Multi-Tenancy Architecture

KAM OS implements multi-tenancy at the database level using `org_id` column filtering.

### Tenant Isolation
- Every data table includes an `org_id` foreign key
- All queries filter by the authenticated user's `org_id`
- JWT tokens include `org_id` claim for request-level isolation
- No cross-tenant data access is possible

### Organization Hierarchy
```
Organization (org_id)
├── Users (role: admin, manager, kam)
├── Accounts
│   ├── Contacts
│   ├── Opportunities
│   ├── Activities
│   ├── Meetings
│   │   └── AI Insights
│   ├── KAM Plans
│   │   ├── Diagnostics
│   │   ├── Stakeholders
│   │   ├── Wallet Share
│   │   ├── Actions
│   │   ├── Risks
│   │   ├── Competitors
│   │   └── Pillars
│   └── Value Matrix
│       └── Attributes
└── Categories
```

## Database Schema

### Core Tables

#### organizations
```sql
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'kam',
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### accounts
```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    org_id INTEGER REFERENCES organizations(id),
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    website VARCHAR(255),
    industry VARCHAR(100),
    segment VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    estimated_revenue DECIMAL(15,2),
    employee_count INTEGER,
    category_id INTEGER REFERENCES categories(id),
    status VARCHAR(50) DEFAULT 'active',
    is_strategic BOOLEAN DEFAULT FALSE,
    notes TEXT,
    kam_stage VARCHAR(50) DEFAULT 'discovery',
    prioritization_score DECIMAL(5,2),
    abc_category VARCHAR(1),
    kam_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### KAM Plan Tables

#### kam_plan_diagnostics
```sql
CREATE TABLE kam_plan_diagnostics (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    company_context TEXT,
    market_position TEXT,
    strategic_objectives TEXT,
    main_challenges TEXT,
    opportunities TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### kam_plan_stakeholders
```sql
CREATE TABLE kam_plan_stakeholders (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    contact_id INTEGER REFERENCES contacts(id),
    influence_level VARCHAR(50),
    support_level VARCHAR(50),
    relationship_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### kam_plan_wallet_share
```sql
CREATE TABLE kam_plan_wallet_share (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    business_line VARCHAR(255) NOT NULL,
    annual_potential DECIMAL(15,2),
    current_revenue DECIMAL(15,2),
    participation_percentage DECIMAL(5,2),
    gap DECIMAL(15,2),
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### kam_plan_actions
```sql
CREATE TABLE kam_plan_actions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    strategic_objective TEXT,
    action TEXT NOT NULL,
    action_type VARCHAR(50),
    main_stakeholder_id INTEGER REFERENCES contacts(id),
    responsible VARCHAR(255),
    planned_start_date DATE,
    planned_end_date DATE,
    status VARCHAR(50) DEFAULT 'planned',
    result TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### kam_plan_risks
```sql
CREATE TABLE kam_plan_risks (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    description TEXT NOT NULL,
    probability VARCHAR(50),
    impact VARCHAR(50),
    mitigation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### kam_plan_competitors
```sql
CREATE TABLE kam_plan_competitors (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    name VARCHAR(255) NOT NULL,
    strengths TEXT,
    weaknesses TEXT,
    strategy TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Architecture

### Endpoint Structure
```
/api/v1/
├── auth/
│   ├── POST /login          - Authenticate user
│   ├── POST /register       - Create new user
│   ├── POST /refresh        - Refresh access token
│   ├── POST /forgot-password - Request password reset
│   ├── POST /reset-password  - Reset password with token
│   └── GET  /me             - Get current user info
│
├── accounts/
│   ├── GET    /             - List accounts (paginated)
│   ├── POST   /             - Create account
│   ├── GET    /{id}         - Get account details
│   ├── PUT    /{id}         - Update account
│   ├── DELETE /{id}         - Delete account
│   └── GET    /{id}/contacts - Get account contacts
│
├── contacts/
│   ├── GET    /             - List contacts
│   ├── POST   /             - Create contact
│   ├── GET    /{id}         - Get contact
│   ├── PUT    /{id}         - Update contact
│   └── DELETE /{id}         - Delete contact
│
├── meetings/
│   ├── GET    /             - List meetings
│   ├── POST   /             - Create meeting
│   ├── GET    /{id}         - Get meeting
│   └── GET    /{id}/insights - Get AI insights
│
├── kam-plans/{account_id}/
│   ├── GET/PUT  /diagnostic   - Diagnostic data
│   ├── CRUD     /stakeholders - Stakeholder mapping
│   ├── CRUD     /wallet-share - Wallet share lines
│   ├── CRUD     /actions      - Action items
│   ├── CRUD     /risks        - Risk items
│   ├── CRUD     /competitors  - Competitor info
│   └── GET/PUT  /pillars      - Strategic pillars
│
├── value-matrix/{account_id}/
│   ├── GET    /attributes    - List value attributes
│   ├── POST   /attributes    - Create attribute
│   └── DELETE /attributes/{id} - Delete attribute
│
├── reports/
│   ├── GET /pipeline         - Pipeline report
│   ├── GET /forecast         - Forecast report
│   ├── GET /activities       - Activities report
│   ├── GET /account-health   - Health report
│   ├── GET /value-stakeholder - Value report
│   └── GET /kam-plan         - KAM plan report
│
└── admin/
    ├── CRUD /users           - User management
    └── CRUD /categories      - Category management
```

### Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │     │ Backend │     │   DB    │
└────┬────┘     └────┬────┘     └────┬────┘
     │               │               │
     │ POST /login   │               │
     │──────────────>│               │
     │               │ Verify user   │
     │               │──────────────>│
     │               │<──────────────│
     │               │               │
     │ access_token  │               │
     │ refresh_token │               │
     │<──────────────│               │
     │               │               │
     │ API Request   │               │
     │ + Bearer token│               │
     │──────────────>│               │
     │               │ Validate JWT  │
     │               │ Extract org_id│
     │               │ Query with    │
     │               │ org_id filter │
     │               │──────────────>│
     │               │<──────────────│
     │ Response      │               │
     │<──────────────│               │
     │               │               │
     │ 401 Expired   │               │
     │<──────────────│               │
     │               │               │
     │ POST /refresh │               │
     │──────────────>│               │
     │ New tokens    │               │
     │<──────────────│               │
     │               │               │
     │ Retry request │               │
     │──────────────>│               │
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # AppLayout, AppHeader, AppSidebar
│   └── kam/          # KAM-specific components
│       ├── PlanoKAM.tsx      # All KAM Plan sections
│       └── MatrizValor.tsx   # Value Matrix
│
├── contexts/
│   └── AuthContext.tsx       # Authentication state
│
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Accounts.tsx
│   ├── AccountDetail.tsx
│   ├── Meetings.tsx
│   ├── Reports.tsx
│   ├── Profile.tsx
│   ├── Settings.tsx
│   └── Admin.tsx
│
├── services/
│   └── api.ts        # All API calls + interceptors
│
├── types/
│   └── index.ts      # TypeScript interfaces
│
└── hooks/
    └── use-mobile.ts # Responsive hooks
```

### State Management

The application uses a hybrid state management approach:

1. **Authentication State** - React Context (AuthContext)
   - User object
   - Login/logout functions
   - Loading state

2. **Component State** - Local useState
   - Form data
   - Loading/saving states
   - UI state (dialogs, tabs)

3. **Server State** - Direct API calls
   - Data fetched on component mount
   - Refetched after mutations
   - No client-side caching

### API Service Pattern

All API calls follow this pattern:
```typescript
const loadData = async () => {
  setLoading(true);
  try {
    const data = await someAPI.getData(id);
    setData(data);
  } catch (error) {
    console.error('Error:', error);
    alert('Error message');
  } finally {
    setLoading(false);
  }
};
```

## Security Architecture

### Authentication
- JWT-based authentication
- Access tokens: 30 minute expiration
- Refresh tokens: 7 day expiration
- Automatic token refresh on 401

### Password Security
- bcrypt hashing with salt
- Minimum 8 character requirement
- Password reset via email with time-limited tokens

### API Security
- All endpoints require authentication (except auth routes)
- org_id filtering prevents cross-tenant access
- Rate limiting on auth endpoints

### CORS Configuration
- Configurable allowed origins
- Includes development and production domains

## Deployment Architecture

### Backend (Railway)
- Containerized FastAPI application
- PostgreSQL managed database
- Environment variables for configuration
- Auto-scaling based on load

### Frontend (Static Hosting)
- Vite build output
- Can be deployed to any static host
- Environment variables at build time

### Environment Variables

Backend:
```
DATABASE_URL=postgresql://...
SECRET_KEY=...
OPENAI_API_KEY=...
EMAIL_SENDER_KEY=...
EMAIL_SENDER_ADDRESS=...
FRONTEND_URL=...
CORS_ORIGINS=...
```

Frontend:
```
VITE_API_URL=https://backend-url
```

## Performance Considerations

### Database
- Connection pooling with asyncpg
- Indexed foreign keys
- Paginated list endpoints

### Frontend
- Code splitting with React Router
- Lazy loading for large components
- Optimistic UI updates where appropriate

### API
- Parallel data loading where possible
- Efficient SQL queries
- Response compression
