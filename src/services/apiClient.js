import axios from 'axios'

// All five backend services sit behind api-gateway on a single port.
// Every domain service in this folder (authService, vehicleService, ...)
// builds on this one client so they all share the gateway URL and the
// same auth-header interceptor.
export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087'

export const apiClient = axios.create({ baseURL: GATEWAY_URL })

export function getStoredToken() {
  return localStorage.getItem('sdc_token') || sessionStorage.getItem('sdc_token')
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Every backend error handler in this project returns the same shape:
 * { timestamp, status, error, message, fieldErrors? }. This pulls the
 * best human-readable message out of that shape (or axios's own
 * fallback) so components don't each need to know the error format.
 */
export function extractErrorMessage(err) {
  const data = err?.response?.data
  if (!data) return err?.message || 'Something went wrong. Please try again.'
  if (data.fieldErrors) {
    const first = Object.values(data.fieldErrors)[0]
    return first || data.message || 'Please check the form and try again.'
  }
  return data.message || 'Something went wrong. Please try again.'
}
