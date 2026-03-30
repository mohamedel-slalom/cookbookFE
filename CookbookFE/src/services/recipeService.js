import { API_BASE_URL } from '../config'

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/api/recipes`)
  if (!response.ok) throw new Error('Failed to fetch recipes')
  return response.json()
}

export async function createRecipe(recipe) {
  const response = await fetch(`${API_BASE_URL}/api/recipes/createRecipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })

  if (!response.ok) {
    let errorMessage = 'Failed to create recipe'

    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        errorMessage = data?.message || errorMessage
      } else {
        const text = await response.text()
        if (text?.trim()) {
          errorMessage = text.trim()
        }
      }
    } catch {
      // no-op, keep default message
    }

    throw new Error(errorMessage)
  }

  return response.json()
}
