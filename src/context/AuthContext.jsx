import { createContext, useContext, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authService } from '../services/authService'
import { extractErrorMessage } from '../services/apiClient'

const AuthContext = createContext(null)

function decodeUser(token) {
  if (!token) return null
  try {
    const payload = jwtDecode(token)
    return {
      userId: payload.userId,
      email: payload.sub,
      roles: (payload.roles || []).map((r) => r.replace('ROLE_', '')),
    }
  } catch {
    return null
  }
}

function readStoredToken() {
  return localStorage.getItem('sdc_token') || sessionStorage.getItem('sdc_token')
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken())
  const [user, setUser] = useState(() => decodeUser(readStoredToken()))

  // "Remember me" (spec section 3, Login page) is implemented as a
  // real storage choice, not a cosmetic checkbox: checked -> the
  // token survives closing the browser (localStorage); unchecked ->
  // it's cleared when the tab/browser closes (sessionStorage).
  const applyToken = useCallback((newToken, persist = true) => {
    localStorage.removeItem('sdc_token')
    sessionStorage.removeItem('sdc_token')
    ;(persist ? localStorage : sessionStorage).setItem('sdc_token', newToken)
    setToken(newToken)
    setUser(decodeUser(newToken))
  }, [])

  const register = useCallback(
    async ({ fullName, email, password, phoneNumber, roles }) => {
      try {
        const { data } = await authService.register({ fullName, email, password, phoneNumber, roles })
        applyToken(data.token, true)
        return { ok: true }
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) }
      }
    },
    [applyToken]
  )

  const login = useCallback(
    async ({ email, password }, remember = true) => {
      try {
        const { data } = await authService.login({ email, password })
        applyToken(data.token, remember)
        return { ok: true }
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) }
      }
    },
    [applyToken]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('sdc_token')
    sessionStorage.removeItem('sdc_token')
    setToken(null)
    setUser(null)
  }, [])

  const value = { token, user, isAuthenticated: !!token, register, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
