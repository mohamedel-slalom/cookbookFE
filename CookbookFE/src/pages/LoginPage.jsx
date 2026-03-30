import { useState } from 'react'
import PropTypes from 'prop-types'
import '../App.css'

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isDisabled = !credentials.username.trim() || !credentials.password.trim() || isSubmitting

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await onLogin({
        username: credentials.username.trim(),
        password: credentials.password,
      })
    } catch (error) {
      setErrorMessage(error?.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="loginPage">
      <section className="loginCard" aria-label="Login form">
        <p className="loginEyebrow">Cookbook</p>
        <h1 className="loginTitle">Login</h1>
        <p className="loginSubtitle">Enter your backend credentials to access protected recipe endpoints.</p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginField" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="loginInput"
            value={credentials.username}
            onChange={handleChange}
            autoComplete="username"
          />

          <label className="loginField" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="loginInput"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {errorMessage && <p className="loginError">{errorMessage}</p>}

          <button type="submit" className="loginButton" disabled={isDisabled}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default LoginPage
