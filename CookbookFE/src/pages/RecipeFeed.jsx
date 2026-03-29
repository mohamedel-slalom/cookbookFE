import RecipeCarousel from '../components/RecipeCarousel'
import { MOCK_CURRENT_USER, MOCK_RECIPES } from '../constants'
import '../App.css'

function RecipeFeed() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Cookbook</p>
        <h1 className="title">{MOCK_CURRENT_USER.firstName}'s Family Recipes</h1>
      </section>

      <RecipeCarousel title="Favorites" recipes={MOCK_RECIPES} />
      <RecipeCarousel title="Breakfast" recipes={MOCK_RECIPES} />
      <RecipeCarousel title="Lunch" recipes={MOCK_RECIPES} />
      <RecipeCarousel title="Dinner" recipes={MOCK_RECIPES} />
    </main>
  )
}

export default RecipeFeed
