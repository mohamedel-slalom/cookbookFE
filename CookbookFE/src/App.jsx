import { useState } from 'react'
import AppRouter from './router'
import LoginPage from './pages/LoginPage'
import { clearAuthToken, getAuthToken, login } from './services/authService'

function App() {
  const [token, setToken] = useState(() => getAuthToken())

  const handleLogin = async (credentials) => {
    const nextToken = await login(credentials)
    setToken(nextToken)
  }

  const handleLogout = () => {
    clearAuthToken()
    setToken('')
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AppRouter onUnauthorized={handleLogout} onLogout={handleLogout} />
}

export default App
