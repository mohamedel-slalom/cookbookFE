import { useRef } from 'react'
import './App.css'

const mockRecipes = [
  { id: 1, title: 'Creamy Garlic Pasta', cuisine: 'Italian', time: '25 min', difficulty: 'Easy' },
  { id: 2, title: 'Spicy Chicken Tacos', cuisine: 'Mexican', time: '30 min', difficulty: 'Easy' },
  { id: 3, title: 'Lemon Herb Salmon', cuisine: 'Mediterranean', time: '20 min', difficulty: 'Medium' },
  { id: 4, title: 'Mushroom Risotto', cuisine: 'Italian', time: '40 min', difficulty: 'Medium' },
  { id: 5, title: 'Thai Basil Stir Fry', cuisine: 'Thai', time: '18 min', difficulty: 'Easy' },
  { id: 6, title: 'Slow Cooked Chili', cuisine: 'American', time: '90 min', difficulty: 'Medium' },
  { id: 7, title: 'Teriyaki Rice Bowl', cuisine: 'Japanese', time: '22 min', difficulty: 'Easy' },
  { id: 8, title: 'Shakshuka', cuisine: 'Middle Eastern', time: '28 min', difficulty: 'Easy' },
]

function App() {
  const recipeRowRef = useRef(null)

  const scrollRecipes = (direction) => {
    const row = recipeRowRef.current

    if (!row) {
      return
    }

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
          {mockRecipes.map((recipe) => (
            <article className="recipeCard" key={recipe.id}>
              <div className="cardTopGlow" />
              <div className="cardBody">
                <h3>{recipe.title}</h3>
                <p>{recipe.cuisine}</p>
                <div className="meta">
                  <span>{recipe.time}</span>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
