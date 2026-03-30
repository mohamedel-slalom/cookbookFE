import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AddRecipeModal from '../components/AddRecipeModal'
import RecipeCarousel from '../components/RecipeCarousel'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { MOCK_CURRENT_USER } from '../constants'
import { createRecipe, deleteRecipe, fetchRecipes, patchRecipe } from '../services/recipeService'
import '../App.css'

const DEFAULT_RECIPE_IMAGE_URL = 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=1400&q=80'

const normalizeRecipe = (recipe) => ({
  ...recipe,
  imageUrl: recipe.imageUrl?.trim() ? recipe.imageUrl : DEFAULT_RECIPE_IMAGE_URL,
  servings: Number(recipe.servings ?? recipe.servingsCount ?? 0),
  tags: Array.isArray(recipe.tags) ? recipe.tags : [],
  ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
  steps: Array.isArray(recipe.steps) ? recipe.steps : [],
  isFavorite: Boolean(recipe.isFavorite),
})

const toBackendRecipePayload = (recipe) => {
  const imageUrl = recipe.imageUrl?.trim() || ''

  return {
    title: recipe.title,
    description: recipe.description,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    time: recipe.time,
    isFavorite: Boolean(recipe.isFavorite),
    servingsCount: Number(recipe.servings ?? recipe.servingsCount ?? 0),
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    images: imageUrl ? [imageUrl] : [],
    ...(imageUrl ? { imageUrl } : {}),
  }
}

const isEqualValue = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function RecipeFeed({ onUnauthorized = undefined, onLogout = undefined }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [backendError, setBackendError] = useState('')
  const pageTitle = `${MOCK_CURRENT_USER.firstName}'s Cookbook`
  const tabTitle = `${MOCK_CURRENT_USER.firstName}'s Cookbook\u2003🍳`
  const favoriteRecipes = recipes.filter((recipe) => recipe.isFavorite)
  const breakfastRecipes = recipes.filter((recipe) => recipe.tags.includes('breakfast'))
  const lunchRecipes = recipes.filter((recipe) => recipe.tags.includes('lunch'))
  const dinnerRecipes = recipes.filter((recipe) => recipe.tags.includes('dinner'))

  const handleUnauthorizedError = (error) => {
    if (error?.status === 401) {
      onUnauthorized?.()
      return true
    }

    return false
  }

  useEffect(() => {
    document.title = tabTitle
  }, [tabTitle])

  useEffect(() => {
    let isMounted = true

    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes()
        if (isMounted) {
          setRecipes(data.map(normalizeRecipe))
          setBackendError('')
        }
      } catch (error) {
        if (isMounted) {
          if (error?.status === 401) {
            onUnauthorized?.()
            return
          }

          setRecipes([])
          setBackendError(error?.message || 'Could not connect to backend at http://localhost:8080. Please ensure your Spring Boot API is running.')
        }
      }
    }

    loadRecipes()

    return () => {
      isMounted = false
    }
  }, [onUnauthorized])

  useEffect(() => {
    const shouldLockPageScroll = Boolean(selectedRecipe) || isAddRecipeOpen || Boolean(editingRecipe)
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    if (shouldLockPageScroll) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [selectedRecipe, isAddRecipeOpen, editingRecipe])

  const handleCreateRecipe = async (recipeData) => {
    try {
      const createdRecipe = await createRecipe(recipeData)
      setRecipes((prev) => [normalizeRecipe(createdRecipe), ...prev])
      setBackendError('')
    } catch (error) {
      if (handleUnauthorizedError(error)) {
        throw error
      }

      throw error
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteRecipe(recipeId)
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
      setSelectedRecipe(null)
      setBackendError('')
    } catch (error) {
      if (handleUnauthorizedError(error)) {
        throw error
      }

      throw error
    }
  }

  const handleStartEditRecipe = (recipe) => {
    setSelectedRecipe(null)
    setEditingRecipe(recipe)
  }

  const handlePatchRecipe = async (recipeId, updatedRecipePayload) => {
    const originalRecipe = recipes.find((recipe) => recipe.id === recipeId)
    if (!originalRecipe) return

    const originalPayload = toBackendRecipePayload(originalRecipe)
    const changedPatch = Object.keys(updatedRecipePayload).reduce((patch, key) => {
      if (!isEqualValue(updatedRecipePayload[key], originalPayload[key])) {
        patch[key] = updatedRecipePayload[key]
      }
      return patch
    }, {})

    if (Object.keys(changedPatch).length === 0) {
      setEditingRecipe(null)
      return
    }

    try {
      const updatedRecipe = await patchRecipe(recipeId, changedPatch)
      setRecipes((prev) => prev.map((recipe) => (recipe.id === recipeId ? normalizeRecipe(updatedRecipe) : recipe)))
      setEditingRecipe(null)
      setBackendError('')
    } catch (error) {
      if (handleUnauthorizedError(error)) {
        throw error
      }

      throw error
    }
  }

  return (
    <main className="page">
      {backendError && (
        <aside className="backendErrorBanner" role="alert" aria-live="polite">
          <p>{backendError}</p>
          <button
            type="button"
            className="backendErrorCloseButton"
            aria-label="Dismiss backend error"
            onClick={() => setBackendError('')}
          >
            ✕
          </button>
        </aside>
      )}

      <section className="hero">
        <div className="heroHeader">
          <div>
            <p className="eyebrow">Cookbook</p>
            <h1 className="title">{pageTitle}</h1>
          </div>

          <div className="heroActions">
            <button
              type="button"
              className="addRecipeButton"
              aria-label="Add recipe"
              title="Add recipe"
              onClick={() => setIsAddRecipeOpen(true)}
            >
              ⊕
            </button>
            <button type="button" className="logoutButton" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      <RecipeCarousel title="Favorites" recipes={favoriteRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Breakfast" recipes={breakfastRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Lunch" recipes={lunchRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Dinner" recipes={dinnerRecipes} onRecipeSelect={setSelectedRecipe} />

      {isAddRecipeOpen && <AddRecipeModal onClose={() => setIsAddRecipeOpen(false)} onSubmit={handleCreateRecipe} />}
      {editingRecipe && (
        <AddRecipeModal
          onClose={() => setEditingRecipe(null)}
          onSubmit={(updatedRecipePayload) => handlePatchRecipe(editingRecipe.id, updatedRecipePayload)}
          initialValues={editingRecipe}
          mode="edit"
        />
      )}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onDelete={handleDeleteRecipe}
          onEdit={handleStartEditRecipe}
        />
      )}
    </main>
  )
}

RecipeFeed.propTypes = {
  onUnauthorized: PropTypes.func,
  onLogout: PropTypes.func,
}

export default RecipeFeed
