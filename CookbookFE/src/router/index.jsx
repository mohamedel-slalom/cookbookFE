import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import RecipeFeed from '../pages/RecipeFeed'

function AppRouter({ onUnauthorized, onLogout }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeFeed onUnauthorized={onUnauthorized} onLogout={onLogout} />} />
      </Routes>
    </BrowserRouter>
  )
}

AppRouter.propTypes = {
  onUnauthorized: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default AppRouter
