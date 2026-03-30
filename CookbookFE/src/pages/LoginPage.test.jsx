import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'

describe('LoginPage', () => {
  it('renders login form with disabled submit initially', () => {
    render(<LoginPage onLogin={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('submits entered credentials to login handler', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn().mockResolvedValue(undefined)

    render(<LoginPage onLogin={onLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(onLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin123',
    })
  })

  it('shows login error when login fails', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn().mockRejectedValue(new Error('Bad credentials'))

    render(<LoginPage onLogin={onLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Bad credentials')).toBeInTheDocument()
  })
})
