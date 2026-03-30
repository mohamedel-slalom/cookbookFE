import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  cuisine: '',
  time: '',
  difficulty: 'Easy',
  servings: '',
  ingredients: '',
  steps: '',
  tags: '',
  imageUrl: '',
  isFavorite: false,
}

const parseLineList = (value) => value
  .split('\n')
  .map((entry) => entry.trim())
  .filter(Boolean)

const parseCommaList = (value) => value
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean)

function AddRecipeModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const isFormValid = useMemo(() => {
    const ingredients = parseLineList(formData.ingredients)
    const steps = parseLineList(formData.steps)
    const tags = parseCommaList(formData.tags)
    const servings = Number(formData.servings)

    return Boolean(
      formData.title.trim()
      && formData.description.trim()
      && formData.cuisine.trim()
      && formData.time.trim()
      && formData.difficulty.trim()
      && Number.isFinite(servings)
      && servings > 0
      && ingredients.length > 0
      && steps.length > 0
      && tags.length > 0
    )
  }, [formData])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isFormValid || isSubmitting) return

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      cuisine: formData.cuisine.trim(),
      time: formData.time.trim(),
      difficulty: formData.difficulty.trim(),
      servingsCount: Number(formData.servings),
      ingredients: parseLineList(formData.ingredients),
      steps: parseLineList(formData.steps),
      tags: parseCommaList(formData.tags),
      isFavorite: formData.isFavorite,
      images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      ...(formData.imageUrl.trim() ? { imageUrl: formData.imageUrl.trim() } : {}),
    }

    setSubmitError('')
    setIsSubmitting(true)

    onSubmit(payload)
      .then(() => {
        onClose()
      })
      .catch((error) => {
        setSubmitError(error?.message || 'Could not save recipe. Please check backend connectivity and try again.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
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
            <input type="text" name="title" placeholder="Ex: Garlic Butter Shrimp" value={formData.title} onChange={handleChange} />
          </label>

          <label className="addRecipeField">
            Description
            <textarea
              name="description"
              rows="3"
              placeholder="Short description of the recipe"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="addRecipeGrid">
            <label className="addRecipeField">
              Cuisine
              <input type="text" name="cuisine" placeholder="Ex: Mediterranean" value={formData.cuisine} onChange={handleChange} />
            </label>

            <label className="addRecipeField">
              Time
              <input type="text" name="time" placeholder="Ex: 25 min" value={formData.time} onChange={handleChange} />
            </label>

            <label className="addRecipeField">
              Difficulty
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label className="addRecipeField">
              Servings
              <input type="number" name="servings" min="1" placeholder="Ex: 4" value={formData.servings} onChange={handleChange} />
            </label>
          </div>

          <label className="addRecipeField">
            Ingredients (one per line)
            <textarea
              name="ingredients"
              rows="5"
              placeholder={'2 cups flour\n1 tsp salt\n2 eggs'}
              value={formData.ingredients}
              onChange={handleChange}
            />
          </label>

          <label className="addRecipeField">
            Steps (one per line)
            <textarea
              name="steps"
              rows="6"
              placeholder={'Mix dry ingredients\nAdd wet ingredients\nBake until golden'}
              value={formData.steps}
              onChange={handleChange}
            />
          </label>

          <div className="addRecipeGrid">
            <label className="addRecipeField">
              Tags (comma separated)
              <input type="text" name="tags" placeholder="breakfast, dinner" value={formData.tags} onChange={handleChange} />
            </label>

            <label className="addRecipeField">
              Image URL
              <input type="url" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
            </label>
          </div>

          <label className="addRecipeCheckbox">
            <input type="checkbox" name="isFavorite" checked={formData.isFavorite} onChange={handleChange} />
            Mark as favorite
          </label>

          {submitError && <p className="addRecipeError">{submitError}</p>}

          <div className="addRecipeFooter">
            <button type="button" className="addRecipeSecondaryButton" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="addRecipePrimaryButton" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddRecipeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default AddRecipeModal
