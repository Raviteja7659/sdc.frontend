import { useEffect, useState } from 'react'
import { vehicleService } from '../../services/vehicleService'
import { useFavorites } from '../../context/FavoritesContext'
import VehicleCard from '../../components/vehicle/VehicleCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function Favorites() {
  const { ids } = useFavorites()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const results = await Promise.all(
        ids.map((id) => vehicleService.getById(id).then((r) => r.data).catch(() => null))
      )
      setVehicles(results.filter(Boolean))
      setLoading(false)
    }
    load()
  }, [ids])

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Favorites</h2>
        <p>Saved on this device only — favorites aren't synced to your account yet.</p>
      </div>

      {loading ? (
        <Loader label="Loading favorites…" />
      ) : vehicles.length === 0 ? (
        <EmptyState icon="♡" title="No favorites yet">
          Tap the heart on any car to save it here.
        </EmptyState>
      ) : (
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  )
}
