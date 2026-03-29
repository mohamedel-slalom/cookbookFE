import PropTypes from 'prop-types'

function RecipeCard({ recipe, onSelect }) {
  const heartLabel = recipe.isFavorite ? 'Favorite recipe' : 'Not favorite recipe'

  return (
    <article className="recipeCard">
      <button
        type="button"
        className="cardOpenButton"
        aria-label={`Open ${recipe.title} recipe details`}
        onClick={() => onSelect(recipe)}
      />

      <div className="cardTopGlow">
        <img className="cardImage" src={recipe.imageUrl} alt={recipe.title} />
        <div className="cardImageOverlay" />
        <span
          className={`favoriteBadge ${recipe.isFavorite ? 'isFavorite' : 'isNotFavorite'}`}
          aria-label={heartLabel}
          title={heartLabel}
        >
          <svg
            className="favoriteIcon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill={recipe.isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L4.22 13.45 12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </span>
      </div>
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
    imageUrl: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default RecipeCard
