import { API_BASE_URL } from '../config'

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/api/recipes`)
  if (!response.ok) throw new Error('Failed to fetch recipes')
  return response.json()
}
