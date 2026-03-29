import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecipeFeed from '../pages/RecipeFeed'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeFeed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
