import { Link } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'

export default function VehicleCard({ vehicle, distanceKm }) {
  const { isFavorite, toggle } = useFavorites()
  const favorite = isFavorite(vehicle.id)

  return (
    <div className="vehicle-card" style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.preventDefault()
          toggle(vehicle.id)
        }}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: 30,
          height: 30,
          cursor: 'pointer',
          fontSize: 15,
          color: favorite ? 'var(--rust)' : 'var(--ink-soft)',
        }}
      >
        {favorite ? '♥' : '♡'}
      </button>

      {distanceKm !== undefined && (
        <span
          className="plate"
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, fontSize: 11 }}
        >
          {distanceKm} km away
        </span>
      )}

      <Link to={`/vehicles/${vehicle.id}`}>
        <div className="vehicle-card__media">{vehicle.registrationNumber}</div>
        <div className="vehicle-card__body">
          <div className="vehicle-card__title">
            {vehicle.brand} {vehicle.model}
          </div>
          <div className="vehicle-card__meta">
            {vehicle.city} · {vehicle.transmissionType?.toLowerCase()} · {vehicle.fuelType?.toLowerCase()}
          </div>
          <div className="vehicle-card__footer">
            <div className="price-tag">
              ₹{vehicle.pricePerHour}
              <span> /hr</span>
            </div>
            <span className="plate" style={{ fontSize: 11 }}>
              {vehicle.seatingCapacity} seats
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
