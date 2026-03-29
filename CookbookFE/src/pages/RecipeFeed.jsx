import { useRef } from 'react'
import RecipeCard from '../components/RecipeCard'
import { MOCK_RECIPES } from '../constants'
import '../App.css'

function RecipeFeed() {
  const recipeRowRef = useRef(null)

  const scrollRecipes = (direction) => {
    const row = recipeRowRef.current
    if (!row) return
    row.scrollBy({
      left: direction === 'left' ? -380 : 380,
      behavior: 'smooth',
    })
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Cookbook</p>
        <h1 className="title">Recipe Feed</h1>
        <p className="subtitle">A starter Netflix-style recipe carousel. Next we can hook this to your Spring Boot API.</p>
      </section>

      <section className="feedSection">
        <div className="feedHeader">
          <h2>Trending Recipes</h2>
          <div className="controls">
            <button type="button" className="scrollButton" onClick={() => scrollRecipes('left')} aria-label="Scroll recipes left">
              ‹
            </button>
            <button type="button" className="scrollButton" onClick={() => scrollRecipes('right')} aria-label="Scroll recipes right">
              ›
            </button>
          </div>
        </div>

        <div className="recipeRow" ref={recipeRowRef}>
          {MOCK_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default RecipeFeed
