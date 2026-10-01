import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Button from '../../components/common/Button'

export default function MyVehicles() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    vehicleService
      .getByOwner(user.userId)
      .then(({ data }) => setVehicles(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="container page">
      <div className="page-header spread">
        <div>
          <h2>My vehicles</h2>
          <p>{loading ? 'Loading…' : `${vehicles.length} listing${vehicles.length === 1 ? '' : 's'}`}</p>
        </div>
        <Link to="/owner/vehicles/new">
          <Button>+ Add vehicle</Button>
        </Link>
      </div>

      {error && <ErrorState message={error} />}

      {loading ? (
        <Loader label="Loading your vehicles…" />
      ) : vehicles.length === 0 ? (
        <EmptyState icon="🚘" title="No listings yet">
          List your first car to start earning.
        </EmptyState>
      ) : (
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <div key={v.id} className="vehicle-card">
              <Link to={`/vehicles/${v.id}`}>
                <div className="vehicle-card__media">{v.registrationNumber}</div>
              </Link>
              <div className="vehicle-card__body">
                <Link to={`/vehicles/${v.id}`}>
                  <div className="vehicle-card__title">
                    {v.brand} {v.model}
                  </div>
                </Link>
                <div className="vehicle-card__meta">{v.city}</div>
                <div className="vehicle-card__footer">
                  <span className="price-tag">
                    ₹{v.pricePerHour}
                    <span> /hr</span>
                  </span>
                  <StatusBadge status={v.status} />
                </div>
                <div className="row" style={{ marginTop: 12, gap: 6 }}>
                  <Link to={`/owner/vehicles/${v.id}/edit`} style={{ flex: 1 }}>
                    <Button variant="ghost" size="sm" block>
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/owner/vehicles/${v.id}/availability`} style={{ flex: 1 }}>
                    <Button variant="ghost" size="sm" block>
                      Availability
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
