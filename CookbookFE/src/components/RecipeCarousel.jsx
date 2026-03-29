import { useRef } from 'react'
import RecipeCard from './RecipeCard'
import PropTypes from 'prop-types'

/**
 * Reusable horizontal recipe carousel section.
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.recipes - Recipe data array
 * @returns {JSX.Element}
 */
function RecipeCarousel({ title, recipes, onRecipeSelect }) {
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
    <section className="feedSection">
      <div className="feedHeader">
        <h2>{title}</h2>
        <div className="controls">
          <button
            type="button"
            className="scrollButton"
            onClick={() => scrollRecipes('left')}
            aria-label={`Scroll ${title} recipes left`}
          >
            ‹
          </button>
          <button
            type="button"
            className="scrollButton"
            onClick={() => scrollRecipes('right')}
            aria-label={`Scroll ${title} recipes right`}
          >
            ›
          </button>
        </div>
      </div>

      <div className="recipeRow" ref={recipeRowRef}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onSelect={onRecipeSelect} />
        ))}
      </div>
    </section>
  )
}

RecipeCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      cuisine: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      isFavorite: PropTypes.bool.isRequired,
      imageUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      servings: PropTypes.number.isRequired,
      ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
      steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onRecipeSelect: PropTypes.func.isRequired,
}

export default RecipeCarousel
