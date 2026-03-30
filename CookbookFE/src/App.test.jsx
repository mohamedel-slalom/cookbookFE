import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createRecipe, deleteRecipe, fetchRecipes, patchRecipe } from './services/recipeService'
import RecipeFeed from './pages/RecipeFeed'
import { MOCK_RECIPES } from './constants'

vi.mock('./services/recipeService', () => ({
  fetchRecipes: vi.fn(),
  createRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
  patchRecipe: vi.fn(),
}))

const waitForRecipesToRender = async () => {
  await waitFor(() => {
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
  })
}

describe('Recipe Feed', () => {
  beforeEach(() => {
    fetchRecipes.mockResolvedValue(MOCK_RECIPES)
    createRecipe.mockResolvedValue({
      id: 999,
      title: 'Egg Fried Rice',
      description: 'Quick rice dish',
      cuisine: 'Asian',
      time: '20 min',
      difficulty: 'Easy',
      servingsCount: 4,
      imageUrl: 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=1400&q=80',
      ingredients: ['2 eggs', '2 cups rice'],
      steps: ['Scramble eggs', 'Stir-fry rice'],
      tags: ['lunch', 'dinner'],
      isFavorite: false,
    })
    deleteRecipe.mockResolvedValue(undefined)
    patchRecipe.mockResolvedValue({
      ...MOCK_RECIPES[0],
      title: 'Blueberry Pancakes Updated',
      servingsCount: 4,
      images: ['https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1400&q=80'],
    })
  })

  it('renders the page heading', async () => {
    render(<RecipeFeed />)
    expect(screen.getByText("Mohamed's Cookbook")).toBeInTheDocument()
    await waitFor(() => {
      expect(fetchRecipes).toHaveBeenCalled()
    })
  })

  it('fetches recipes on mount', async () => {
    render(<RecipeFeed />)
    await waitFor(() => {
      expect(fetchRecipes).toHaveBeenCalled()
    })
  })

  it('shows and dismisses backend error banner when fetch fails', async () => {
    const user = userEvent.setup()
    fetchRecipes.mockRejectedValueOnce(new Error('Backend down'))

    render(<RecipeFeed />)

    const errorBanner = await screen.findByRole('alert')
    expect(errorBanner).toHaveTextContent('Backend down')
    expect(screen.queryAllByRole('article')).toHaveLength(0)

    await user.click(screen.getByLabelText('Dismiss backend error'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders all carousel section titles', async () => {
    render(<RecipeFeed />)
    await waitForRecipesToRender()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Breakfast')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
  })

  it('renders recipe cards in each carousel', async () => {
    render(<RecipeFeed />)
    await waitForRecipesToRender()
    const cards = screen.getAllByRole('article')
    const expectedCardCount = MOCK_RECIPES.filter((recipe) => recipe.isFavorite).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('breakfast')).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('lunch')).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('dinner')).length

    expect(cards).toHaveLength(expectedCardCount)
  })

  it('renders only tagged recipes in each carousel', async () => {
    render(<RecipeFeed />)
    await waitForRecipesToRender()
    expect(screen.getAllByText('Blueberry Pancakes')).toHaveLength(2)
    expect(screen.getAllByText('Spicy Chicken Tacos')).toHaveLength(2)
    expect(screen.getAllByText('Mushroom Risotto')).toHaveLength(2)
    expect(screen.queryByText('Creamy Garlic Pasta')).not.toBeInTheDocument()
  })

  it('renders scroll buttons for each carousel', async () => {
    render(<RecipeFeed />)
    await waitForRecipesToRender()
    expect(screen.getByLabelText('Scroll Favorites recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Breakfast recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Lunch recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Dinner recipes left')).toBeInTheDocument()
  })

  it('calls scrollBy on carousel scroll buttons', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const scrollByMock = vi.fn()
    const rows = document.querySelectorAll('.recipeRow')
    const row = rows[0]

    if (row) {
      row.scrollBy = scrollByMock
      Object.defineProperty(row, 'scrollWidth', { value: 1200, configurable: true })
      Object.defineProperty(row, 'clientWidth', { value: 700, configurable: true })
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }

    await waitFor(() => {
      expect(screen.getByLabelText('Scroll Favorites recipes right')).not.toBeDisabled()
    })

    await user.click(screen.getByLabelText('Scroll Favorites recipes right'))
    expect(scrollByMock).toHaveBeenCalledWith({ left: 380, behavior: 'smooth' })
  })

  it('opens and closes add recipe modal', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    await user.click(screen.getByLabelText('Add recipe'))
    expect(screen.getByRole('dialog', { name: /Add new recipe/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save recipe' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog', { name: /Add new recipe/i })).not.toBeInTheDocument()
  })

  it('submits add recipe modal to backend create endpoint', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    await user.click(screen.getByLabelText('Add recipe'))

    await user.type(screen.getByLabelText('Recipe title'), 'Egg Fried Rice')
    await user.type(screen.getByLabelText('Description'), 'Quick rice dish')
    await user.type(screen.getByLabelText('Cuisine'), 'Asian')
    await user.type(screen.getByLabelText('Time'), '20 min')
    await user.type(screen.getByLabelText('Servings'), '4')
    await user.type(screen.getByLabelText('Ingredients (one per line)'), '2 eggs\n2 cups rice')
    await user.type(screen.getByLabelText('Steps (one per line)'), 'Scramble eggs\nStir-fry rice')
    await user.type(screen.getByLabelText('Tags (comma separated)'), 'lunch, dinner')

    await user.click(screen.getByRole('button', { name: 'Save recipe' }))

    await waitFor(() => {
      expect(createRecipe).toHaveBeenCalledWith({
        title: 'Egg Fried Rice',
        description: 'Quick rice dish',
        cuisine: 'Asian',
        time: '20 min',
        difficulty: 'Easy',
        servingsCount: 4,
        ingredients: ['2 eggs', '2 cups rice'],
        steps: ['Scramble eggs', 'Stir-fry rice'],
        tags: ['lunch', 'dinner'],
        isFavorite: false,
        images: [],
      })
    })
    expect(screen.queryByRole('dialog', { name: /Add new recipe/i })).not.toBeInTheDocument()
  })

  it('locks body scrolling while recipe details modal is open', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByLabelText('Close recipe details'))
    expect(document.body.style.overflow).toBe('')
  })

  it('locks body scrolling while add recipe modal is open', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    await user.click(screen.getByLabelText('Add recipe'))
    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByLabelText('Close add recipe modal'))
    expect(document.body.style.overflow).toBe('')
  })

  it('opens recipe details when a card is clicked and closes with X', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    expect(screen.getByRole('dialog', { name: /Blueberry Pancakes details/i })).toBeInTheDocument()
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
    expect(screen.getByText('Steps')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Close recipe details'))
    expect(screen.queryByRole('dialog', { name: /Blueberry Pancakes details/i })).not.toBeInTheDocument()
  })

  it('shows recipe options menu from three-dot button', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    await user.click(screen.getByLabelText('Open recipe options'))
    expect(screen.getByRole('menuitem', { name: 'Edit recipe' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Delete recipe' })).toBeInTheDocument()
  })

  it('opens pre-populated edit modal and patches only changed fields', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    await user.click(screen.getByLabelText('Open recipe options'))
    await user.click(screen.getByRole('menuitem', { name: 'Edit recipe' }))

    expect(screen.getByRole('dialog', { name: /Add new recipe/i })).toBeInTheDocument()
    const titleInput = screen.getByLabelText('Recipe title')
    expect(titleInput).toHaveValue('Blueberry Pancakes')

    await user.clear(titleInput)
    await user.type(titleInput, 'Blueberry Pancakes Updated')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(patchRecipe).toHaveBeenCalledWith(1, {
        title: 'Blueberry Pancakes Updated',
      })
    })
  })

  it('opens delete confirmation and cancels deletion', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    await user.click(screen.getByLabelText('Open recipe options'))
    await user.click(screen.getByRole('menuitem', { name: 'Delete recipe' }))

    expect(screen.getByRole('dialog', { name: 'Confirm recipe deletion' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this recipe? This is irreversible.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog', { name: 'Confirm recipe deletion' })).not.toBeInTheDocument()
    expect(deleteRecipe).not.toHaveBeenCalled()
  })

  it('deletes recipe after confirmation', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)
    await waitForRecipesToRender()

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    await user.click(screen.getByLabelText('Open recipe options'))
    await user.click(screen.getByRole('menuitem', { name: 'Delete recipe' }))
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }))

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith(1)
    })

    expect(screen.queryByRole('dialog', { name: /Blueberry Pancakes details/i })).not.toBeInTheDocument()
  })

  it('displays cuisine and difficulty metadata on cards', async () => {
    render(<RecipeFeed />)
    await waitForRecipesToRender()
    expect(screen.getAllByText('American').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
  })
})
