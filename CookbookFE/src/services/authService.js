import { API_BASE_URL } from '../config'

const TOKEN_STORAGE_KEY = 'cookbook_auth_token'

const normalizeToken = (token) => {
  if (!token) return ''
  return token.startsWith('Bearer ') ? token.slice('Bearer '.length) : token
}

const buildError = async (response, fallbackMessage) => {
  let errorMessage = fallbackMessage

  try {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      errorMessage = data?.message || data?.error || fallbackMessage
    } else {
      const text = await response.text()
      if (text?.trim()) {
        errorMessage = text.trim()
      }
    }
  } catch {
    // keep fallback message
  }

  const error = new Error(errorMessage)
  error.status = response.status
  throw error
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAuthToken(token) {
  const normalizedToken = normalizeToken(token)
  if (normalizedToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken)
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    await buildError(response, 'Login failed')
  }

  const authorizationHeader = response.headers.get('authorization')
  if (authorizationHeader) {
    const tokenFromHeader = normalizeToken(authorizationHeader)
    setAuthToken(tokenFromHeader)
    return tokenFromHeader
  }

  const contentType = response.headers.get('content-type') || ''
  let token = ''

  if (contentType.includes('application/json')) {
    const data = await response.json()
    token = data?.token || data?.accessToken || data?.jwt || data?.access_token || ''
  } else {
    token = (await response.text()).trim()
  }

  if (!token) {
    throw new Error('Login succeeded but no token was returned')
  }

  const normalizedToken = normalizeToken(token)
  setAuthToken(normalizedToken)
  return normalizedToken
}
