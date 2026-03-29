# CookbookFE Development Setup Checklist

Project setup and development guidelines for the CookbookFE React/Vite frontend.

## Completed Setup Steps

- [x] **Project Scaffolding** - Initialized Vite React app with TypeScript support
- [x] **Architecture** - Modular component structure with pages, services, config, constants
- [x] **Recipe Feed** - Landing page with Netflix-style horizontal scrollable recipe cards
- [x] **Styling** - Tailwind CSS + global styling approach (no component-scoped CSS)
- [x] **API Integration** - Service layer wired for Spring Boot backend at `/api/recipes`
- [x] **Testing** - Vitest + React Testing Library with 8 unit tests passing
- [x] **Linting** - ESLint configured with React + prop-types validation
- [x] **CI Pipeline** - GitHub Actions workflow for lint, test, and build on push/PR
- [x] **Documentation** - Frontend architecture, coding standards, development guide, testing practices

## Running the Project

```bash
cd CookbookFE
npm install              # First time only
npm run dev              # Start dev server on http://localhost:5173
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Check code style
npm run build            # Production build
```

## Key Development Resources

- **Architecture Guide** - [docs/frontend/architecture.md](../docs/frontend/architecture.md)
- **Coding Standards** - [docs/frontend/coding-standards.md](../docs/frontend/coding-standards.md)
- **Development Guide** - [docs/frontend/development-guide.md](../docs/frontend/development-guide.md)
- **Testing Practices** - [docs/frontend/testing-practices.md](../docs/frontend/testing-practices.md)

## Backend Integration

The frontend connects to Spring Boot backend:

- **Base URL:** `VITE_API_BASE_URL` (default: `http://localhost:8080`)
- **API Endpoint:** `GET /api/recipes`
- **Set in:** `.env` file or environment variable

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Development Best Practices

- Use functional React components with hooks
- All styling via Tailwind utilities (no component `.css` files)
- API calls through `src/services/` layer
- Constants in `src/constants/`
- Tests alongside components (`.test.jsx` files)
- PropTypes validation for all component props
- Descriptive commit messages and branch names

## Next Steps / Future Features

- [ ] Connect recipe detail page route
- [ ] Implement recipe filtering UI
- [ ] Add user favorites feature
- [ ] Implement search functionality
- [ ] Add dark mode support
- [ ] Performance optimization (lazy loading, image optimization)

## Troubleshooting

**Tests fail with Node version error?**
```bash
nvm use 22  # Vitest requires Node 20+
npm test
```

**Build issues?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API connection issues?**
- Verify Spring Boot backend is running on the correct port
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS or network errors

