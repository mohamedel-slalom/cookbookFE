# CookbookFE Testing Practices

Testing practices and patterns for the Cookbook frontend.

## Testing Stack

- **Vitest** - Test runner (Jest-compatible)
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Test Structure

Tests live alongside components:

```
src/
├── components/
│   ├── RecipeCard.jsx
│   └── RecipeCard.test.jsx    # Tests for RecipeCard
├── pages/
│   ├── RecipeFeed.jsx
│   └── RecipeFeed.test.jsx    # Tests for RecipeFeed
└── services/
    ├── recipeService.js
    └── recipeService.test.js  # Tests for API service
```

## Component Testing Pattern

### Testing RecipeCard Component

```jsx
// src/components/RecipeCard.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RecipeCard from './RecipeCard'

describe('RecipeCard', () => {
  const mockRecipe = {
    id: 1,
    title: 'Creamy Garlic Pasta',
    cuisine: 'Italian',
    time: '25 min',
    difficulty: 'Easy',
  }

  it('renders recipe title', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Creamy Garlic Pasta')).toBeInTheDocument()
  })

  it('renders cuisine type', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Italian')).toBeInTheDocument()
  })

  it('displays cooking time and difficulty', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('25 min')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('renders as an article element', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })
})
```

### Testing RecipeFeed Page

```jsx
// src/pages/RecipeFeed.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RecipeFeed from './RecipeFeed'

describe('RecipeFeed Page', () => {
  it('renders the page heading', () => {
    render(<RecipeFeed />)
    expect(screen.getByText('Recipe Feed')).toBeInTheDocument()
  })

  it('displays all recipe cards', () => {
    render(<RecipeFeed />)
    const cards = screen.getAllByRole('article')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('renders scroll buttons', () => {
    render(<RecipeFeed />)
    expect(screen.getByLabelText('Scroll recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll recipes right')).toBeInTheDocument()
  })

  it('scrolls right when right button is clicked', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)

    const scrollByMock = vi.fn()
    const row = document.querySelector('.recipeRow')
    if (row) row.scrollBy = scrollByMock

    await user.click(screen.getByLabelText('Scroll recipes right'))
    expect(scrollByMock).toHaveBeenCalledWith({
      left: 380,
      behavior: 'smooth',
    })
  })
})
```

## Service Testing Pattern

### Testing API Service

```jsx
// src/services/recipeService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRecipes } from './recipeService'

describe('recipeService', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('fetches recipes successfully', async () => {
    const mockRecipes = [
      { id: 1, title: 'Pasta', cuisine: 'Italian', time: '25 min', difficulty: 'Easy' },
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRecipes),
    })

    const result = await fetchRecipes()
    expect(result).toEqual(mockRecipes)
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/recipes'))
  })

  it('throws error on failed response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(fetchRecipes()).rejects.toThrow()
  })

  it('throws error on network failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(fetchRecipes()).rejects.toThrow('Network error')
  })
})
```

## User Interaction Testing

```jsx
import userEvent from '@testing-library/user-event'

describe('RecipeFilters', () => {
  it('calls onFilterChange when difficulty filter is clicked', async () => {
    const user = userEvent.setup()
    const mockOnFilterChange = vi.fn()

    render(<RecipeFilters onFilterChange={mockOnFilterChange} />)

    await user.click(screen.getByText('Easy'))

    expect(mockOnFilterChange).toHaveBeenCalledWith({ difficulty: 'Easy' })
  })

  it('supports multiple interactions in sequence', async () => {
    const user = userEvent.setup()
    const mockOnFilterChange = vi.fn()

    render(<RecipeFilters onFilterChange={mockOnFilterChange} />)

    await user.click(screen.getByText('Easy'))
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1)

    await user.click(screen.getByText('Medium'))
    expect(mockOnFilterChange).toHaveBeenCalledTimes(2)
  })
})
```

## Async Testing Pattern

For components that fetch data:

```jsx
import { render, screen, waitFor } from '@testing-library/react'

describe('RecipeFeed with API', () => {
  it('loads recipes from API', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Pasta', cuisine: 'Italian', time: '25 min', difficulty: 'Easy' }
      ]),
    })

    render(<RecipeFeed />)

    // Wait for the recipe to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Pasta')).toBeInTheDocument()
    })
  })

  it('displays error message on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'))

    render(<RecipeFeed />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('displays loading state', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) // Never resolves

    render(<RecipeFeed />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
```

## Testing Best Practices

### ✅ Do

- Test **user behavior**, not implementation details
- Use semantic queries: `getByRole()`, `getByLabelText()`, `getByText()`
- Mock external dependencies (APIs, services)
- Keep tests focused and readable
- Use descriptive test names
- Test edge cases (empty states, errors)

### ❌ Don't

- Use `getByTestId()` as the primary query method
- Snapshot testing (use for components that rarely change)
- Test CSS directly (test rendered output instead)
- Test React internals (hooks implementation)

### Example: Good vs Bad

**❌ Bad - Testing implementation:**

```jsx
it('sets state correctly', () => {
  const { result } = renderHook(() => useState([]))
  act(() => {
    result.current[1]([{ id: 1 }]) // Testing state directly
  })
  expect(result.current[0]).toEqual([{ id: 1 }])
})
```

**✅ Good - Testing user behavior:**

```jsx
it('displays recipe when fetched', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([{ id: 1, title: 'Pasta' }])
  })

  render(<RecipeFeed />)

  await waitFor(() => {
    expect(screen.getByText('Pasta')).toBeInTheDocument()
  })
})
```

## Coverage Goals

- **Components:** 80%+ coverage
- **Services:** 90%+ coverage
- **Pages:** 70%+ coverage

View coverage:

```bash
npm test -- --coverage
```

## Debugging Tests

### Print DOM

```jsx
import { render, screen } from '@testing-library/react'

it('shows rendered DOM', () => {
  render(<RecipeCard recipe={mockRecipe} />)
  screen.debug() // Prints entire DOM
})
```

### Find Elements

```jsx
it('finds all elements', () => {
  render(<RecipeFeed />)
  
  // Debug what's available
  screen.logTestingPlaygroundURL()
})
```

### Use Testing Playground

Add to test:

```jsx
import { screen } from '@testing-library/react'

it('something', () => {
  render(<Component />)
  screen.logTestingPlaygroundURL() // Prints interactive link
})
```
