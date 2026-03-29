import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddRecipeModal from './AddRecipeModal'

describe('AddRecipeModal', () => {
  it('renders skeleton fields for adding recipes', () => {
    render(<AddRecipeModal onClose={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: /Add new recipe/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Recipe title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Cuisine')).toBeInTheDocument()
    expect(screen.getByLabelText('Ingredients (one per line)')).toBeInTheDocument()
    expect(screen.getByLabelText('Steps (one per line)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save recipe (coming soon)' })).toBeDisabled()
  })

  it('calls onClose from close and cancel actions', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AddRecipeModal onClose={onClose} />)

    await user.click(screen.getByLabelText('Close add recipe modal'))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
