import { useEffect, useState } from 'react'
import AddRecipeModal from '../components/AddRecipeModal'
import RecipeCarousel from '../components/RecipeCarousel'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { MOCK_CURRENT_USER, MOCK_RECIPES } from '../constants'
import '../App.css'

function RecipeFeed() {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false)
  const pageTitle = `${MOCK_CURRENT_USER.firstName}'s Cookbook`
  const tabTitle = `${MOCK_CURRENT_USER.firstName}'s Cookbook\u2003🍳`
  const favoriteRecipes = MOCK_RECIPES.filter((recipe) => recipe.isFavorite)
  const breakfastRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('breakfast'))
  const lunchRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('lunch'))
  const dinnerRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('dinner'))

  useEffect(() => {
    document.title = tabTitle
  }, [tabTitle])

  useEffect(() => {
    const shouldLockPageScroll = Boolean(selectedRecipe) || isAddRecipeOpen
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
  }, [selectedRecipe, isAddRecipeOpen])

  return (
    <main className="page">
      <section className="hero">
        <div className="heroHeader">
          <div>
            <p className="eyebrow">Cookbook</p>
            <h1 className="title">{pageTitle}</h1>
          </div>

          <button
            type="button"
            className="addRecipeButton"
            aria-label="Add recipe"
            title="Add recipe"
            onClick={() => setIsAddRecipeOpen(true)}
          >
            ⊕
          </button>
        </div>
      </section>

      <RecipeCarousel title="Favorites" recipes={favoriteRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Breakfast" recipes={breakfastRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Lunch" recipes={lunchRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Dinner" recipes={dinnerRecipes} onRecipeSelect={setSelectedRecipe} />

      {isAddRecipeOpen && <AddRecipeModal onClose={() => setIsAddRecipeOpen(false)} />}
      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </main>
  )
}

export default RecipeFeed
