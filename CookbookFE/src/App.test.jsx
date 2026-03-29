import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RecipeFeed from './pages/RecipeFeed'

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
    expect(cards.length).toBeGreaterThanOrEqual(8)
  })

  it('displays recipe titles on the cards', () => {
    render(<RecipeFeed />)
    expect(screen.getAllByText('Creamy Garlic Pasta').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Spicy Chicken Tacos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Lemon Herb Salmon').length).toBeGreaterThan(0)
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

  it('displays cuisine and difficulty metadata on cards', () => {
    render(<RecipeFeed />)
    expect(screen.getAllByText('Italian').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
  })
})
