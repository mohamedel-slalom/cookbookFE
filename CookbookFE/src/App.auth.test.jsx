import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearAuthToken, getAuthToken, login } from './services/authService'

vi.mock('./services/authService', () => ({
  getAuthToken: vi.fn(),
  login: vi.fn(),
  clearAuthToken: vi.fn(),
}))

vi.mock('./router', () => ({
  default: ({ onLogout }) => (
    <div>
      <span>Protected App</span>
      <button type="button" onClick={onLogout}>Mock Logout</button>
    </div>
  ),
}))

describe('App auth gate', () => {
  beforeEach(() => {
    getAuthToken.mockReturnValue('')
  })

  it('shows login page when no token exists', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows protected app when token exists', () => {
    getAuthToken.mockReturnValue('token-123')
    render(<App />)
    expect(screen.getByText('Protected App')).toBeInTheDocument()
  })

  it('logs in and transitions to protected app', async () => {
    const user = userEvent.setup()
    login.mockResolvedValue('token-abc')

    render(<App />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(login).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' })
    expect(await screen.findByText('Protected App')).toBeInTheDocument()
  })

  it('clears token on logout', async () => {
    const user = userEvent.setup()
    getAuthToken.mockReturnValue('token-123')
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Mock Logout' }))
    expect(clearAuthToken).toHaveBeenCalled()
  })
})
