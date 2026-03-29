import PropTypes from 'prop-types'

function RecipeCard({ recipe }) {
  return (
    <article className="recipeCard">
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
  )
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
  }).isRequired,
}

export default RecipeCard
