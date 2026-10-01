import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import VehicleCard from '../../components/vehicle/VehicleCard'
import VehicleCardSkeleton from '../../components/vehicle/VehicleCardSkeleton'
import { useAuth } from '../../context/AuthContext'

const WHY_ITEMS = [
  { icon: '✓', title: 'Verified vehicles', body: 'Every listing is reviewed by an admin before it goes live.' },
  { icon: '🔒', title: 'Secure booking', body: 'Availability is locked server-side — no double-bookings, ever.' },
  { icon: '⏱', title: 'Flexible rentals', body: 'Book by the hour or the day, whichever fits your trip.' },
  { icon: '🤝', title: 'Trusted owners', body: 'Real people renting out their own cars, not a corporate fleet.' },
]

const HOW_STEPS = ['Search', 'Book', 'Pick up', 'Drive']

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState({ city: '', start: '', end: '' })

  useEffect(() => {
    vehicleService
      .list()
      .then(({ data }) => setPopular(data.filter((v) => v.status === 'ACTIVE').slice(0, 6)))
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.city) params.set('city', search.city)
    if (search.start) params.set('start', search.start)
    if (search.end) params.set('end', search.end)
    navigate(`/vehicles?${params.toString()}`)
  }

  const listVehicleTarget = isAuthenticated && user?.roles?.includes('OWNER') ? '/owner/vehicles/new' : '/register'

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="hero__eyebrow">peer-to-peer · self-drive · pay only for the miles you need</div>
          <h1>Rent a car from someone down the road, not a rental counter.</h1>
          <p>
            Search by city, book by the hour or the day, and skip the queue — every car here belongs to a real
            owner nearby.
          </p>
          <form className="search-bar" onSubmit={handleSearch} style={{ maxWidth: 640, flexWrap: 'wrap' }}>
            <input
              className="input"
              placeholder="Pickup location — e.g. Hyderabad"
              value={search.city}
              onChange={(e) => setSearch({ ...search, city: e.target.value })}
              style={{ flex: '1 1 180px' }}
            />
            <input
              className="input"
              type="datetime-local"
              value={search.start}
              onChange={(e) => setSearch({ ...search, start: e.target.value })}
              style={{ flex: '1 1 160px' }}
            />
            <input
              className="input"
              type="datetime-local"
              value={search.end}
              onChange={(e) => setSearch({ ...search, end: e.target.value })}
              style={{ flex: '1 1 160px' }}
            />
            <button className="btn btn-primary" type="submit">
              Search Vehicles
            </button>
          </form>
        </div>
      </div>

      <div className="container page">
        <div className="page-header">
          <h2>Popular vehicles</h2>
          <p>A few cars ready to book right now.</p>
        </div>
        {loading ? (
          <div className="vehicle-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : popular.length === 0 ? (
          <p className="muted">No active listings yet — check back soon.</p>
        ) : (
          <div className="vehicle-grid">
            {popular.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/vehicles">
            <button className="btn btn-ghost">Browse all vehicles →</button>
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 24 }}>
          Why SelfDriveConnect
        </h2>
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{item.title}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--paper-raised)', borderTop: '1px solid var(--line)', padding: '40px 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 24 }}>
            How it works
          </h2>
          <div className="row" style={{ justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
            {HOW_STEPS.map((step, i) => (
              <div key={step} className="row" style={{ gap: 0 }}>
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                  <div className="plate" style={{ fontSize: 16, padding: '8px 14px', marginBottom: 8 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontWeight: 600 }}>{step}</div>
                </div>
                {i < HOW_STEPS.length - 1 && <div style={{ width: 30, borderTop: '2px dashed var(--line)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero" style={{ padding: '40px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Earn money from your car</h2>
          <p style={{ margin: '0 auto 20px' }}>List your vehicle and start earning from bookings in your city.</p>
          <Link to={listVehicleTarget}>
            <button className="btn btn-primary">List Your Vehicle</button>
          </Link>
        </div>
      </div>
    </>
  )
}
