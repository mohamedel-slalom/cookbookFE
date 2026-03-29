import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

describe('Recipe Feed', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByText('Recipe Feed')).toBeInTheDocument()
  })

  it('renders the Trending Recipes section title', () => {
    render(<App />)
    expect(screen.getByText('Trending Recipes')).toBeInTheDocument()
  })

  it('renders all 8 recipe cards', () => {
    render(<App />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(8)
  })

  it('displays recipe titles on the cards', () => {
    render(<App />)
    expect(screen.getByText('Creamy Garlic Pasta')).toBeInTheDocument()
    expect(screen.getByText('Spicy Chicken Tacos')).toBeInTheDocument()
    expect(screen.getByText('Lemon Herb Salmon')).toBeInTheDocument()
  })

  it('renders left and right scroll buttons', () => {
    render(<App />)
    expect(screen.getByLabelText('Scroll recipes left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll recipes right')).toBeInTheDocument()
  })

  it('calls scrollBy when right scroll button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const scrollByMock = vi.fn()
    const row = document.querySelector('.recipeRow')
    if (row) row.scrollBy = scrollByMock

    await user.click(screen.getByLabelText('Scroll recipes right'))
    expect(scrollByMock).toHaveBeenCalledWith({ left: 380, behavior: 'smooth' })
  })

  it('calls scrollBy when left scroll button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const scrollByMock = vi.fn()
    const row = document.querySelector('.recipeRow')
    if (row) row.scrollBy = scrollByMock

    await user.click(screen.getByLabelText('Scroll recipes left'))
    expect(scrollByMock).toHaveBeenCalledWith({ left: -380, behavior: 'smooth' })
  })

  it('displays cuisine and difficulty metadata on cards', () => {
    render(<App />)
    expect(screen.getAllByText('Italian').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
  })
})
