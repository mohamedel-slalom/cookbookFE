# CookbookFE

React + Vite frontend for the Cookbook recipe discovery app. Integrates with Spring Boot backend.

## What is included

- **Vite + React 18** - Fast build tool and modern UI library
- **Tailwind CSS** - Utility-first styling (no component-scoped CSS)
- **React Router** - Client-side routing
- **Recipe Feed** - Landing page with Netflix-style horizontal recipe carousel
- **Vitest + React Testing Library** - Unit tests with 8 passing tests
- **ESLint** - Code quality and prop-types validation
- **CI/CD Pipeline** - GitHub Actions for automated testing and builds
- **Documentation** - Architecture, coding standards, development, and testing guides

## Quick Start

```bash
cd CookbookFE
npm install
npm run dev              # http://localhost:5173
```

## Available Scripts

```bash
npm run dev              # Start Vite dev server
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Check code quality
npm run build            # Production build
npm run preview          # Preview production build locally
```

## Backend Integration

The frontend connects to a Spring Boot backend:

```bash
# Set environment variable or create .env file
VITE_API_BASE_URL=http://localhost:8080
```

The app fetches recipes from: `GET /api/recipes`

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed setup and development guidelines.

## Development

For development best practices, architecture details, and testing patterns, see the [docs/frontend](docs/frontend) directory:

- [Architecture](docs/frontend/architecture.md) - System design and project structure
- [Coding Standards](docs/frontend/coding-standards.md) - Code style and patterns
- [Development Guide](docs/frontend/development-guide.md) - Building features
- [Testing Practices](docs/frontend/testing-practices.md) - Testing patterns
