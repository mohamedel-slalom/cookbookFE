# CookbookFE Development Guide

Development patterns and best practices for the Cookbook frontend.

## Development Workflow

### 1. Setting Up for Feature Development

#### Start the Dev Server

```bash
cd CookbookFE
npm install           # First time only
npm run dev           # Start Vite dev server on http://localhost:5173
```

#### Run Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode during development
```

#### Build for Production

```bash
npm run build         # Create optimized bundle
npm run preview       # Preview production build locally
```

## Building Features: Recipe Feed Components

### Adding a New Recipe Feature

#### Step 1: Define the Data Model

Add to `src/constants/index.js` or create `src/models/recipe.js`:

```js
// src/models/recipe.js
/**
 * @typedef {Object} Recipe
 * @property {number} id
 * @property {string} title
 * @property {string} cuisine
 * @property {string} time - Format: "25 min"
 * @property {string} difficulty - One of: Easy, Medium, Hard
 */

export const RECIPE_DIFFICULTIES = ['Easy', 'Medium', 'Hard']
```

#### Step 2: Create or Extend a Component

**For a new recipe component:**

```jsx
// src/components/RecipeFilters.jsx
import { useState } from 'react'
import { RECIPE_DIFFICULTIES } from '../models/recipe'

/**
 * Filter control for recipes by difficulty.
 * @param {Object} props
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @returns {JSX.Element}
 */
export function RecipeFilters({ onFilterChange }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty)
    onFilterChange({ difficulty })
  }

  return (
    <div className="flex gap-2 p-4">
      <button
        onClick={() => handleDifficultyChange(null)}
        className={`px-4 py-2 rounded text-sm font-medium transition ${
          selectedDifficulty === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {RECIPE_DIFFICULTIES.map(difficulty => (
        <button
          key={difficulty}
          onClick={() => handleDifficultyChange(difficulty)}
          className={`px-4 py-2 rounded text-sm font-medium transition ${
            selectedDifficulty === difficulty
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {difficulty}
        </button>
      ))}
    </div>
  )
}
```

#### Step 3: Add API Integration (if needed)

```js
// src/services/recipeService.js
export async function fetchRecipesByDifficulty(difficulty) {
  const params = new URLSearchParams()
  if (difficulty) params.append('difficulty', difficulty)
  
  const response = await fetch(`${API_BASE_URL}/api/recipes?${params}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}
```

#### Step 4: Use in a Page

```jsx
// src/pages/RecipeFeed.jsx
import { useState, useEffect, useRef } from 'react'
import RecipeCard from '../components/RecipeCard'
import { RecipeFilters } from '../components/RecipeFilters'
import { fetchRecipes } from '../services/recipeService'
import { MOCK_RECIPES } from '../constants'

export default function RecipeFeed() {
  const [recipes, setRecipes] = useState(MOCK_RECIPES)
  const [filters, setFilters] = useState({})
  const recipeRowRef = useRef(null)

  useEffect(() => {
    // Replace with API call when backend is ready
    // fetchRecipes().then(setRecipes).catch(...)
  }, [filters])

  const scrollRecipes = (direction) => {
    const row = recipeRowRef.current
    if (!row) return
    row.scrollBy({
      left: direction === 'left' ? -380 : 380,
      behavior: 'smooth',
    })
  }

  return (
    <main className="page">
      <section className="hero">
        <h1 className="text-4xl font-bold">Recipe Feed</h1>
      </section>

      <RecipeFilters onFilterChange={setFilters} />

      <section className="feedSection relative">
        <div className="feedHeader flex justify-between items-center p-4">
          <h2 className="text-2xl font-semibold">Trending Recipes</h2>
          <div className="controls flex gap-2">
            <button
              onClick={() => scrollRecipes('left')}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              aria-label="Scroll recipes left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollRecipes('right')}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              aria-label="Scroll recipes right"
            >
              ›
            </button>
          </div>
        </div>

        <div className="recipeRow flex gap-4 overflow-x-auto p-4" ref={recipeRowRef}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

#### Step 5: Write Tests

```jsx
// src/pages/RecipeFeed.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RecipeFeed from './RecipeFeed'

describe('RecipeFeed with Filters', () => {
  it('renders filter buttons', () => {
    render(<RecipeFeed />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('displays recipes', () => {
    render(<RecipeFeed />)
    const recipes = screen.getAllByRole('article')
    expect(recipes.length).toBeGreaterThan(0)
  })
})
```

## Routing Pattern

For adding new pages (e.g., recipe detail):

```jsx
// src/router/index.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecipeFeed from '../pages/RecipeFeed'
import RecipeDetail from '../pages/RecipeDetail' // Future page

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeFeed />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
```

## State Management Patterns

### Using Hooks (Current)

For simple state, use `useState`:

```jsx
const [recipes, setRecipes] = useState([])
const [loading, setLoading] = useState(false)
const [filters, setFilters] = useState({})
```

### With Context (Future)

For shared state across multiple pages:

```jsx
// src/contexts/RecipeContext.jsx
import { createContext, useContext, useState } from 'react'

const RecipeContext = createContext()

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([])
  const [filters, setFilters] = useState({})

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, filters, setFilters }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  return useContext(RecipeContext)
}
```

Use it:

```jsx
import { useRecipes } from '../contexts/RecipeContext'

export function RecipeFeed() {
  const { recipes, filters, setFilters } = useRecipes()
  // ...
}
```

## Custom Hooks Pattern

For reusable logic:

```jsx
// src/hooks/useRecipeScroll.js
import { useRef } from 'react'

/**
 * Hook for horizontal carousel scrolling.
 * @returns {Object} - { ref, scrollLeft, scrollRight }
 */
export function useRecipeScroll() {
  const ref = useRef(null)

  const scroll = (direction) => {
    if (!ref.current) return
    ref.current.scrollBy({
      left: direction === 'left' ? -380 : 380,
      behavior: 'smooth',
    })
  }

  return {
    ref,
    scrollLeft: () => scroll('left'),
    scrollRight: () => scroll('right'),
  }
}
```

Use it:

```jsx
import { useRecipeScroll } from '../hooks/useRecipeScroll'

export function RecipeFeed() {
  const { ref, scrollLeft, scrollRight } = useRecipeScroll()

  return (
    <>
      <button onClick={scrollLeft}>‹</button>
      <div ref={ref} className="flex overflow-x-auto gap-4">
        {/* recipes */}
      </div>
      <button onClick={scrollRight}>›</button>
    </>
  )
}
```

## Best Practices Checklist

Before submitting a feature, ensure:

- [ ] Component uses functional + hooks pattern
- [ ] All styling uses Tailwind utilities (no `.css` files)
- [ ] API calls are in `src/services/`
- [ ] Constants are in `src/constants/`
- [ ] Tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors or warnings
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility: proper ARIA labels, keyboard navigation
- [ ] Components have JSDoc comments
