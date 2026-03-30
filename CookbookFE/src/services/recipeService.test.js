import { afterEach, describe, expect, it, vi } from 'vitest'
import { setAuthToken, clearAuthToken } from './authService'
import { createRecipe, deleteRecipe, fetchRecipes, patchRecipe } from './recipeService'

describe('recipeService auth headers', () => {
  afterEach(() => {
    clearAuthToken()
    vi.restoreAllMocks()
  })

  it('adds Bearer token to protected fetch requests', async () => {
    setAuthToken('token-123')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => [],
    })

    await fetchRecipes()

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/recipes', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
    }))
  })

  it('adds Bearer token to create, patch, and delete requests', async () => {
    setAuthToken('token-456')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({}),
    })

    await createRecipe({ title: 'Test' })
    await patchRecipe(1, { title: 'Updated' })
    await deleteRecipe(1)

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'http://localhost:8080/api/recipes/createRecipe', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer token-456' }),
    }))
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'http://localhost:8080/api/recipes/patchRecipe/1', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer token-456' }),
    }))
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'http://localhost:8080/api/recipes/deleteRecipe/1', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer token-456' }),
    }))
  })
})