# CookbookFE System Architecture

Describes the architecture of the React/Vite frontend for the Cookbook recipe discovery app.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## Project Structure

```
src/
├── pages/              # Route-level components (RecipeFeed, future detail pages)
├── components/         # Reusable UI components (RecipeCard, scroll controls)
├── services/           # API integration layer (recipeService.js)
├── config/             # Configuration (API_BASE_URL, environment vars)
├── constants/          # App constants (mock recipes, static data)
├── hooks/              # Custom React hooks (future: useRecipes, useFilters)
├── router/             # React Router configuration
├── contexts/           # React Context for shared state (future: recipe filter state)
├── lib/                # Utility functions
├── models/             # TypeScript/JSDoc type definitions (future)
├── types/              # Type definitions placeholder
├── App.jsx             # Root component wrapper
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Feature Organization

### Recipe Feed Feature

**Components:**
- `RecipeFeed.jsx` (page) - Main feed layout with carousel controls
- `RecipeCard.jsx` - Individual recipe card display

**Services:**
- `recipeService.js` - Handles `GET /api/recipes` from Spring Boot backend

**Constants:**
- `MOCK_RECIPES` - Mock data for offline development

**Styling:**
- Cards use Tailwind utilities for layout, spacing, hover effects
- Horizontal scroll container managed via ref + `scrollBy()` 
- All styling in component JSX (no `.css` files per component)

## Backend Integration

The frontend connects to a Spring Boot backend at `VITE_API_BASE_URL` (default: `http://localhost:8080`).

### Recipe API Contract

**Endpoint:** `GET /api/recipes`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Creamy Garlic Pasta",
    "cuisine": "Italian",
    "time": "25 min",
    "difficulty": "Easy"
  }
]
```

### Environment Configuration

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080
```

The config is loaded in `src/config/index.js`:
```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
```

## Styling Architecture

### Approach

**No component-scoped CSS files.** All styling is:
- **Tailwind utilities** applied directly in JSX
- **Global CSS** in `src/index.css` for base styles and theme
- **Responsive design** using Tailwind breakpoints (sm:, md:, lg:, xl:)

### Recipe Card Styling Example

```jsx
<article className="recipeCard">
  <div className="cardTopGlow" />
  <div className="cardBody">
    <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
    <p className="text-sm text-gray-600">{recipe.cuisine}</p>
    <div className="meta flex justify-between text-xs text-gray-500 mt-2">
      <span>{recipe.time}</span>
      <span>{recipe.difficulty}</span>
    </div>
  </div>
</article>
```

### Global CSS Variables

Define theme tokens in `src/index.css`:

```css
:root {
  --color-brand: #1f2937;
  --color-accent: #ef4444;
  --spacing-card: 1rem;
}
```

## Future Extensibility

### Planned Features

- **Recipe Detail Page** - New page component + route in `router/index.jsx`
- **Recipe Filters** - Context or state management for filtering by cuisine, difficulty
- **User Favorites** - Local storage or backend persistence
- **Search** - Input component + filter logic
- **Categories/Sections** - Multiple carousel sections stacked

### Adding New Features

1. Create a new **page** in `src/pages/`
2. Add a **route** in `src/router/index.jsx`
3. Create **components** in `src/components/` if reusable
4. Add **API calls** in `src/services/` if needed
5. Write **tests** for new logic
6. Update **constants** or **config** as needed
