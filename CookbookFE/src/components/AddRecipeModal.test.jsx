import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddRecipeModal from './AddRecipeModal'

describe('AddRecipeModal', () => {
  it('renders skeleton fields for adding recipes', () => {
    render(<AddRecipeModal onClose={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: /Add new recipe/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Recipe title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Cuisine')).toBeInTheDocument()
    expect(screen.getByLabelText('Ingredients (one per line)')).toBeInTheDocument()
    expect(screen.getByLabelText('Steps (one per line)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save recipe' })).toBeDisabled()
  })

  it('calls onClose from close and cancel actions', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AddRecipeModal onClose={onClose} onSubmit={vi.fn()} />)

    await user.click(screen.getByLabelText('Close add recipe modal'))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('enables save when required fields are completed and submits normalized payload', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<AddRecipeModal onClose={onClose} onSubmit={onSubmit} />)

    const saveButton = screen.getByRole('button', { name: 'Save recipe' })
    expect(saveButton).toBeDisabled()

    await user.type(screen.getByLabelText('Recipe title'), 'Egg Fried Rice')
    await user.type(screen.getByLabelText('Description'), 'Quick rice dish')
    await user.type(screen.getByLabelText('Cuisine'), 'Asian')
    await user.type(screen.getByLabelText('Time'), '20 min')
    await user.type(screen.getByLabelText('Servings'), '4')
    await user.type(screen.getByLabelText('Ingredients (one per line)'), '2 eggs\n2 cups rice')
    await user.type(screen.getByLabelText('Steps (one per line)'), 'Scramble eggs\nStir-fry rice')
    await user.type(screen.getByLabelText('Tags (comma separated)'), 'lunch, dinner')

    expect(saveButton).toBeEnabled()

    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith({
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
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
