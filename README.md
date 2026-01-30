# NFV Orchestration Tool "Atomic"

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](.)
[![Tests](https://img.shields.io/badge/tests-24%20passing-brightgreen)](.)
[![License](https://img.shields.io/badge/license-MIT-blue)](.)

An NFV (Network Function Virtualization) orchestration tool designed to deploy and manage virtual network functions across telecom infrastructure. Enables telecom operators to virtualize network functions such as firewalls, NATs, and load balancers on scalable resources while ensuring high availability and performance.

## Quick Start

```bash
# Install all dependencies
npm install

# Run the full application
npm run start-all

# Run all tests
npm run test-all

# Run all linting
npm run lint-all
```

## Project Structure

```
NFV-Orchestration-Tool/
├── Backend/          # Express.js API server
├── Frontend/         # React + Vite application  
└── package.json      # Monorepo workspace configuration
```

## Features

### Backend
- **Mock Services** - Simulation mode via `MOCK_DATA=true` environment variable
- **JWT Authentication** - Secure `/auth/register` and `/auth/login` endpoints
- **Protected API Routes** - All `/api` routes require valid JWT tokens
- **Winston Logging** - Centralized error handling and logging

### Frontend
- **Tailwind CSS** - Modern, responsive UI with custom color palette
- **React Flow** - Interactive network topology visualization
- **Chart.js** - Real-time monitoring dashboards
- **Auth Context** - Global authentication state management
- **Error Boundaries** - Graceful error handling

## Development

### Prerequisites
- Node.js (LTS version recommended)
- npm (Node Package Manager)

### Workspace Commands

| Command | Description |
|---------|-------------|
| `npm run start-all` | Start both Backend and Frontend |
| `npm run build-all` | Build both workspaces |
| `npm run lint-all` | Lint both workspaces |
| `npm run test-all` | Run all tests (Backend: Jest, Frontend: Vitest) |

### Individual Workspace Commands

```bash
# Backend
cd Backend
npm install
npm start        # Start server on http://localhost:3000
npm test         # Run Jest tests
npm run lint     # Run ESLint

# Frontend  
cd Frontend
npm install
npm run dev      # Start dev server on http://localhost:5173
npm test         # Run Vitest tests
npm run lint     # Run ESLint
npm run build    # Production build
```

### Environment Variables

Create a `.env` file in the Backend directory:

```env
MOCK_DATA=true          # Enable mock services
JWT_SECRET=your-secret  # JWT signing secret
PORT=3000               # Server port
```

## Testing

| Workspace | Framework | Tests |
|-----------|-----------|-------|
| Backend | Jest | 21 tests (5 suites) |
| Frontend | Vitest | 3 tests (1 suite) |

```bash
# Run all tests
npm run test-all

# Backend tests with coverage
cd Backend && npm test -- --coverage

# Frontend tests in watch mode
cd Frontend && npx vitest
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |

### Protected Routes (require JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resource-allocator/allocate` | Allocate resources |
| POST | `/api/resource-allocator/scale` | Scale resources |
| POST | `/api/control-plane/configure` | Configure VNF |
| GET | `/api/control-plane/state/:name` | Get VNF state |
| GET | `/api/monitoring/metrics` | Get performance metrics |

## Tech Stack

**Backend:** Node.js, Express, TypeScript, Jest, JWT, Winston

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Flow, Chart.js, Vitest

## Author

**Ramius_arch** - *Lead Architect & Developer*

## License

MIT License