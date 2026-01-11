# Wiki Initiology

## Overview

Wiki Initiology is a Russian-language knowledge base application about Initiology (Инициология) - an energy-information wellness system. The application follows a Wikipedia-style interface with articles, categories, search functionality, and an AI-powered chat assistant. Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure with shared components. Pages include MainPage (homepage), ArticlePage (individual articles), and AllArticlesPage (article listings/categories). A ChatWidget component provides AI assistant functionality.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js with HTTP server for potential WebSocket support
- **API Design**: RESTful JSON API at `/api/*` endpoints
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

The backend uses a storage abstraction layer (`IStorage` interface) implemented by `DatabaseStorage` class, enabling clean separation between business logic and data access.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `db:push` command
- **Core Entities**: 
  - `users` - User accounts
  - `articles` - Wiki articles with JSON sections and infobox
  - `categories` - Article categorization
  - `conversations` / `messages` - Chat history

### AI Integration
- **Provider**: OpenAI-compatible API via Replit AI Integrations
- **Features**:
  - Chat assistant with streaming responses (`/api/chat/quick`)
  - Image generation capability (`gpt-image-1` model)
  - Batch processing utilities with rate limiting and retries
- **Configuration**: Uses `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables

### User Article System
- **User article creation**: Authenticated users can create articles via `/article/new` editor page
- **Moderation workflow**: Articles submitted by users have status "pending" and are invisible on public pages
- **Admin approval**: Admin can view pending articles at `/admin` and approve/reject them
- **My articles page**: Users can view their submitted articles and statuses at `/my-articles`
- **Security**: All public endpoints filter articles by `status="published"` only

### Build System
- **Client Build**: Vite outputs to `dist/public`
- **Server Build**: esbuild bundles server to `dist/index.cjs` with selective dependency bundling
- **Production**: Single command builds both client and server

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Connection**: pg Pool with Drizzle ORM wrapper
- **Session Store**: connect-pg-simple for Express sessions

### AI Services
- **OpenAI API**: Accessed through Replit AI Integrations proxy
- **Environment Variables**:
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Third-Party Libraries
- **Zod**: Schema validation with drizzle-zod integration
- **date-fns**: Date formatting and manipulation
- **p-limit / p-retry**: Rate limiting for batch API operations

### Replit-Specific
- **Vite Plugins**: Runtime error overlay, cartographer, dev banner
- **Meta Images Plugin**: Custom plugin for OpenGraph image handling