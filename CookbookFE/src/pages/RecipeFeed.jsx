import { useState } from 'react'
import RecipeCarousel from '../components/RecipeCarousel'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { MOCK_CURRENT_USER, MOCK_RECIPES } from '../constants'
import '../App.css'

function RecipeFeed() {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const pageTitle = `${MOCK_CURRENT_USER.firstName}'s Family Recipes`
  const favoriteRecipes = MOCK_RECIPES.filter((recipe) => recipe.isFavorite)
  const breakfastRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('breakfast'))
  const lunchRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('lunch'))
  const dinnerRecipes = MOCK_RECIPES.filter((recipe) => recipe.tags.includes('dinner'))

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Cookbook</p>
        <h1 className="title">{pageTitle}</h1>
      </section>

      <RecipeCarousel title="Favorites" recipes={favoriteRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Breakfast" recipes={breakfastRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Lunch" recipes={lunchRecipes} onRecipeSelect={setSelectedRecipe} />
      <RecipeCarousel title="Dinner" recipes={dinnerRecipes} onRecipeSelect={setSelectedRecipe} />

      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </main>
  )
}

export default RecipeFeed
