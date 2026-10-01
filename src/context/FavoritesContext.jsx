import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const FavoritesContext = createContext(null)

/**
 * There's no favorites-service in the backend and no field for it on
 * any existing entity, so this is intentionally local-only: stored in
 * localStorage, scoped to this browser. It will NOT sync across
 * devices or survive clearing browser storage. If a real backend
 * favorites feature gets built later (a join table on user + vehicle
 * ids, same shape as reviews), this whole context can be swapped for
 * one that calls a real service without touching the components that
 * use useFavorites().
 */
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sdc_favorites') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('sdc_favorites', JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((vehicleId) => {
    setIds((prev) => (prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]))
  }, [])

  const isFavorite = useCallback((vehicleId) => ids.includes(vehicleId), [ids])

  return (
    <FavoritesContext.Provider value={{ ids, toggle, isFavorite }}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
