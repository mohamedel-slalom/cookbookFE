import { API_BASE_URL } from '../config'
import { getAuthToken } from './authService'

const buildAuthHeaders = (headers = {}) => {
  const token = getAuthToken()

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const parseResponseError = async (response, fallbackMessage) => {
  let errorMessage = fallbackMessage

  try {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      errorMessage = data?.message || data?.error || fallbackMessage
    } else {
      const text = await response.text()
      if (text?.trim()) {
        errorMessage = text.trim()
      }
    }
  } catch {
    // keep fallback message
  }

  const error = new Error(errorMessage)
  error.status = response.status
  throw error
}

const request = async (url, options = {}, fallbackMessage = 'Request failed') => {
  const response = await fetch(url, {
    ...options,
    headers: buildAuthHeaders(options.headers),
  })

  if (!response.ok) {
    await parseResponseError(response, fallbackMessage)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

export async function fetchRecipes() {
  return request(`${API_BASE_URL}/api/recipes`, {}, 'Failed to fetch recipes')
}

export async function createRecipe(recipe) {
  return request(
    `${API_BASE_URL}/api/recipes/createRecipe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    },
    'Failed to create recipe',
  )
}

export async function deleteRecipe(recipeId) {
  return request(
    `${API_BASE_URL}/api/recipes/deleteRecipe/${recipeId}`,
    {
      method: 'DELETE',
    },
    'Failed to delete recipe',
  )
}

export async function patchRecipe(recipeId, recipePatch) {
  return request(
    `${API_BASE_URL}/api/recipes/patchRecipe/${recipeId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipePatch),
    },
    'Failed to update recipe',
  )
}
