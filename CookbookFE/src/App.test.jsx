import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RecipeFeed from './pages/RecipeFeed'
import { MOCK_RECIPES } from './constants'

describe('Recipe Feed', () => {
  it('renders the page heading', () => {
    render(<RecipeFeed />)
    expect(screen.getByText("Mohamed's Family Recipes")).toBeInTheDocument()
  })

  it('renders all carousel section titles', () => {
    render(<RecipeFeed />)
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Breakfast')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
  })

  it('renders recipe cards in each carousel', () => {
    render(<RecipeFeed />)
    const cards = screen.getAllByRole('article')
    const expectedCardCount = MOCK_RECIPES.filter((recipe) => recipe.isFavorite).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('breakfast')).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('lunch')).length
      + MOCK_RECIPES.filter((recipe) => recipe.tags.includes('dinner')).length

    expect(cards).toHaveLength(expectedCardCount)
  })

  it('renders only tagged recipes in each carousel', () => {
    render(<RecipeFeed />)
    expect(screen.getAllByText('Blueberry Pancakes')).toHaveLength(2)
    expect(screen.getAllByText('Spicy Chicken Tacos')).toHaveLength(2)
    expect(screen.getAllByText('Mushroom Risotto')).toHaveLength(2)
    expect(screen.queryByText('Creamy Garlic Pasta')).not.toBeInTheDocument()
  })

  it('renders scroll buttons for each carousel', () => {
    render(<RecipeFeed />)
    expect(screen.getByLabelText('Scroll Favorites recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Breakfast recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Lunch recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll Dinner recipes left')).toBeInTheDocument()
  })

  it('calls scrollBy on carousel scroll buttons', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)

    const scrollByMock = vi.fn()
    const rows = document.querySelectorAll('.recipeRow')
    const row = rows[0]
    if (row) row.scrollBy = scrollByMock

    await user.click(screen.getByLabelText('Scroll Favorites recipes right'))
    expect(scrollByMock).toHaveBeenCalledWith({ left: 380, behavior: 'smooth' })
  })

  it('opens recipe details when a card is clicked and closes with X', async () => {
    const user = userEvent.setup()
    render(<RecipeFeed />)

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

    const openButtons = screen.getAllByLabelText(/Open Blueberry Pancakes recipe details/i)
    await user.click(openButtons[0])

    await user.click(screen.getByLabelText('Open recipe options'))
    expect(screen.getByRole('menuitem', { name: 'Edit recipe (coming soon)' })).toBeInTheDocument()
  })

  it('displays cuisine and difficulty metadata on cards', () => {
    render(<RecipeFeed />)
    expect(screen.getAllByText('American').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
  })
})
