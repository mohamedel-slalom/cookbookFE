import { useState } from 'react'
import PropTypes from 'prop-types'

function RecipeDetailModal({ recipe, onClose }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="detailOverlay" role="dialog" aria-modal="true" aria-label={`${recipe.title} details`}>
      <div className="detailPanel">
        <div className="detailActions">
          <div className="menuContainer">
            <button
              type="button"
              className="detailIconButton"
              aria-label="Open recipe options"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              ⋯
            </button>

            {isMenuOpen && (
              <div className="detailMenu" role="menu" aria-label="Recipe options">
                <button type="button" className="detailMenuItem" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  Edit recipe (coming soon)
                </button>
              </div>
            )}
          </div>

          <button type="button" className="detailIconButton" aria-label="Close recipe details" onClick={onClose}>
            ✕
          </button>
        </div>

        <img className="detailImage" src={recipe.imageUrl} alt={recipe.title} />

        <div className="detailContent">
          <h2>{recipe.title}</h2>
          <p className="detailDescription">{recipe.description}</p>

          <div className="detailMeta">
            <span>{recipe.cuisine}</span>
            <span>{recipe.time}</span>
            <span>{recipe.difficulty}</span>
            <span>{recipe.servings} servings</span>
          </div>

          <section className="detailSection">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <section className="detailSection">
            <h3>Steps</h3>
            <ol>
              {recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

RecipeDetailModal.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    servings: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default RecipeDetailModal