import PropTypes from 'prop-types'

function AddRecipeModal({ onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="detailOverlay" role="dialog" aria-modal="true" aria-label="Add new recipe">
      <div className="detailPanel addRecipePanel">
        <div className="detailActions addRecipeActions">
          <h2 className="addRecipeHeading">Add Recipe</h2>
          <button type="button" className="detailIconButton" aria-label="Close add recipe modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="addRecipeForm" onSubmit={handleSubmit}>
          <label className="addRecipeField">
            Recipe title
            <input type="text" name="title" placeholder="Ex: Garlic Butter Shrimp" />
          </label>

          <label className="addRecipeField">
            Description
            <textarea name="description" rows="3" placeholder="Short description of the recipe" />
          </label>

          <div className="addRecipeGrid">
            <label className="addRecipeField">
              Cuisine
              <input type="text" name="cuisine" placeholder="Ex: Mediterranean" />
            </label>

            <label className="addRecipeField">
              Time
              <input type="text" name="time" placeholder="Ex: 25 min" />
            </label>

            <label className="addRecipeField">
              Difficulty
              <select name="difficulty" defaultValue="Easy">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label className="addRecipeField">
              Servings
              <input type="number" name="servings" min="1" placeholder="Ex: 4" />
            </label>
          </div>

          <label className="addRecipeField">
            Ingredients (one per line)
            <textarea name="ingredients" rows="5" placeholder={'2 cups flour\n1 tsp salt\n2 eggs'} />
          </label>

          <label className="addRecipeField">
            Steps (one per line)
            <textarea name="steps" rows="6" placeholder={'Mix dry ingredients\nAdd wet ingredients\nBake until golden'} />
          </label>

          <div className="addRecipeGrid">
            <label className="addRecipeField">
              Tags (comma separated)
              <input type="text" name="tags" placeholder="breakfast, dinner" />
            </label>

            <label className="addRecipeField">
              Image URL
              <input type="url" name="imageUrl" placeholder="https://..." />
            </label>
          </div>

          <label className="addRecipeCheckbox">
            <input type="checkbox" name="isFavorite" />
            Mark as favorite
          </label>

          <div className="addRecipeFooter">
            <button type="button" className="addRecipeSecondaryButton" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="addRecipePrimaryButton" disabled>
              Save recipe (coming soon)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddRecipeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default AddRecipeModal
