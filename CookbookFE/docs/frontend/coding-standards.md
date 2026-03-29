# CookbookFE Coding Standards

Coding standards for React/JavaScript frontend development on the Cookbook project.

## Code Style

- **Indentation:** 2 spaces
- **Language:** ES6+ JavaScript with JSDoc for type hints
- **Components:** Functional components with React hooks (no class components)
- **Naming:** Descriptive, PascalCase for components, camelCase for functions/variables
- **Files:** `.jsx` for React components, `.js` for utilities/services

### Component Structure Example

```jsx
// src/components/RecipeCard.jsx
import PropTypes from 'prop-types' // or use JSDoc

/**
 * Displays a single recipe card with title, cuisine, time, and difficulty.
 * @param {Object} props
 * @param {Object} props.recipe - Recipe data
 * @param {number} props.recipe.id
 * @param {string} props.recipe.title
 * @param {string} props.recipe.cuisine
 * @param {string} props.recipe.time
 * @param {string} props.recipe.difficulty
 * @returns {JSX.Element}
 */
function RecipeCard({ recipe }) {
  return (
    <article className="recipeCard">
      <div className="cardTopGlow" />
      <div className="cardBody">
        <h3>{recipe.title}</h3>
        <p>{recipe.cuisine}</p>
        <div className="meta">
          <span>{recipe.time}</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
```

## Styling Standards

### Global Styling Approach

**All styles are global.** Component-scoped CSS files (`.css`, `.module.css`) are **not permitted**.

### Tailwind CSS Usage

- Apply Tailwind utilities directly in `className` attributes
- Use responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`
- Use state variants: `hover:`, `focus:`, `active:`, `disabled:`
- Use the `cn()` helper for conditional classes (import from `src/lib/utils.js` if available)

### Examples

**✅ Correct - Tailwind utilities for styling:**

```jsx
<article className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 mb-4">
  <h3 className="text-lg font-semibold truncate text-gray-900">{recipe.title}</h3>
  <p className="text-sm text-gray-600 mt-1">{recipe.cuisine}</p>
  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
    <span className="bg-blue-50 px-2 py-1 rounded">{recipe.time}</span>
    <span className={`px-2 py-1 rounded ${recipe.difficulty === 'Easy' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
      {recipe.difficulty}
    </span>
  </div>
</article>
```

**❌ Incorrect - Component-scoped CSS:**

```jsx
// ❌ Never create RecipeCard.css or RecipeCard.module.css
import './RecipeCard.css'

export function RecipeCard({ recipe }) {
  return <article className="recipe-card">...</article>
}
```

**❌ Incorrect - Inline styles:**

```jsx
// ❌ Avoid inline styles
<div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem' }}>
  {recipe.title}
</div>
```

## Global CSS Variables

Define theme colors and spacing in `src/index.css`:

```css
:root {
  --card-bg: #ffffff;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --color-accent: #ef4444;
}

.dark {
  --card-bg: #1f2937;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
}
```

Then use in Tailwind config or inline:

```jsx
<div style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
  // Or use Tailwind if tokens are configured
  <div className="bg-card text-primary">
```

## API Integration Standards

### Service Layer Pattern

All API calls live in `src/services/`:

```jsx
// src/services/recipeService.js
import { API_BASE_URL } from '../config'

/**
 * Fetch all recipes from the backend.
 * @returns {Promise<Array>} Array of recipe objects
 * @throws {Error} If request fails
 */
export async function fetchRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    throw error
  }
}
```

### Using in Components

```jsx
import { useState, useEffect } from 'react'
import { fetchRecipes } from '../services/recipeService'

export function RecipeFeed() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">Loading recipes...</div>
  if (error) return <div className="p-4 text-red-600">Error loading recipes</div>

  return (
    <div className="recipeRow">
      {recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
    </div>
  )
}
```

## Constants and Mock Data

Store reusable constants in `src/constants/`:

```jsx
// src/constants/index.js
export const MOCK_RECIPES = [
  { id: 1, title: 'Creamy Garlic Pasta', cuisine: 'Italian', time: '25 min', difficulty: 'Easy' },
  // ...
]

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
export const CUISINES = ['Italian', 'Mexican', 'Thai', /* ... */]
```

## Code Organization Checklist

Before committing, ensure:

- [ ] No `.css` or `.module.css` files created for components
- [ ] All styling uses Tailwind utilities or global CSS
- [ ] Component names are PascalCase
- [ ] Functions/variables are camelCase
- [ ] API calls are in `src/services/`
- [ ] Constants are in `src/constants/`
- [ ] Components use functional + hooks pattern
- [ ] JSDoc comments for exported functions/components
- [ ] No `console.log()` statements in production code (use proper error handling)
