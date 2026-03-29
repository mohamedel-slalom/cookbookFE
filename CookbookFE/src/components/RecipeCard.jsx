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

export default RecipeCard
