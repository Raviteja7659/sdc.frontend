import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { bookingService } from '../../services/bookingService'
import { reviewService } from '../../services/reviewService'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'

function calculatePreviewPrice(start, end, pricingType, pricePerHour, pricePerDay) {
  if (!start || !end) return null
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate - startDate
  if (diffMs <= 0) return null

  if (pricingType === 'HOURLY') {
    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)))
    return { amount: (hours * pricePerHour).toFixed(2), unit: `${hours} hour${hours === 1 ? '' : 's'}` }
  }
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  return { amount: (days * pricePerDay).toFixed(2), unit: `${days} day${days === 1 ? '' : 's'}` }
}

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [vehicle, setVehicle] = useState(null)
  const [owner, setOwner] = useState(null)
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [bookingForm, setBookingForm] = useState({ startDateTime: '', endDateTime: '', pricingType: 'HOURLY' })
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [vehicleRes, reviewsRes, summaryRes] = await Promise.all([
          vehicleService.getById(id),
          reviewService.getByVehicle(id),
          reviewService.getSummary(id),
        ])
        setVehicle(vehicleRes.data)
        setReviews(reviewsRes.data)
        setSummary(summaryRes.data)

        // Owner profile lookup requires auth; browsing itself doesn't,
        // so this is best-effort and silently skipped when logged out.
        if (isAuthenticated) {
          try {
            const ownerRes = await authService.getUserById(vehicleRes.data.ownerId)
            setOwner(ownerRes.data)
          } catch {
            setOwner(null)
          }
        }
      } catch (err) {
        setError(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const pricePreview = useMemo(() => {
    if (!vehicle) return null
    return calculatePreviewPrice(
      bookingForm.startDateTime,
      bookingForm.endDateTime,
      bookingForm.pricingType,
      vehicle.pricePerHour,
      vehicle.pricePerDay
    )
  }, [bookingForm, vehicle])

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => counts[r.rating] !== undefined && counts[r.rating]++)
    const total = reviews.length || 1
    return [5, 4, 3, 2, 1].map((star) => ({ star, count: counts[star], pct: (counts[star] / total) * 100 }))
  }, [reviews])

  async function handleBook(e) {
    e.preventDefault()
    setBookingError('')

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicles/${id}` } })
      return
    }
    if (!bookingForm.startDateTime || !bookingForm.endDateTime) {
      setBookingError('Choose a start and end time.')
      return
    }

    setBookingLoading(true)
    try {
      const { data } = await bookingService.create({
        vehicleId: Number(id),
        startDateTime: bookingForm.startDateTime,
        endDateTime: bookingForm.endDateTime,
        pricingType: bookingForm.pricingType,
      })
      navigate(`/bookings/${data.id}`)
    } catch (err) {
      setBookingError(extractErrorMessage(err))
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <Loader label="Loading vehicle…" />
  if (error) {
    return (
      <div className="container page">
        <ErrorState message={error} />
      </div>
    )
  }
  if (!vehicle) return null

  return (
    <div className="container page">
      <div className="detail-grid">
        <div>
          {/* Image gallery placeholder: vehicle-service currently stores a
              single imageUrl string, not a gallery of images — a real
              gallery would need a vehicle_images table/endpoint. */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div
              className="vehicle-card__media"
              style={{ height: 220, borderRadius: 10, marginBottom: 16, fontSize: 14 }}
            >
              {vehicle.imageUrl ? (
                <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
              ) : (
                vehicle.registrationNumber
              )}
            </div>

            <div className="spread" style={{ alignItems: 'flex-start' }}>
              <div>
                <h2>
                  {vehicle.brand} {vehicle.model} <span className="muted">· {vehicle.year}</span>
                </h2>
                <p className="muted" style={{ marginTop: 4 }}>
                  {vehicle.pickupLocation ? `${vehicle.pickupLocation}, ` : ''}
                  {vehicle.city}
                </p>
                {summary && summary.totalReviews > 0 && (
                  <div className="rating" style={{ marginTop: 6 }}>
                    <span className="rating__stars">★ {summary.averageRating}</span>
                    <span>({summary.totalReviews} review{summary.totalReviews === 1 ? '' : 's'})</span>
                  </div>
                )}
              </div>
              <span className="plate">{vehicle.registrationNumber}</span>
            </div>

            <div className="stat-row">
              <div className="stat">
                <b>₹{vehicle.pricePerHour}</b>
                <span>per hour</span>
              </div>
              <div className="stat">
                <b>₹{vehicle.pricePerDay}</b>
                <span>per day</span>
              </div>
              <div className="stat">
                <b>{vehicle.seatingCapacity}</b>
                <span>seats</span>
              </div>
              <div className="stat">
                <b>{vehicle.transmissionType}</b>
                <span>{vehicle.fuelType}</span>
              </div>
            </div>
          </div>

          {owner && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 8 }}>Hosted by</h3>
              <div className="row">
                <div
                  className="plate"
                  style={{ borderRadius: '50%', width: 36, height: 36, justifyContent: 'center', fontSize: 14 }}
                >
                  {owner.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{owner.fullName}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Member since {new Date(owner.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Reviews</h3>
            {reviews.length === 0 ? (
              <EmptyState icon="★" title="No reviews yet">
                Be the first to rent and review this car.
              </EmptyState>
            ) : (
              <>
                <div className="rating-breakdown">
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} className="rating-breakdown__row">
                      <span>{star}★</span>
                      <span className="rating-breakdown__track">
                        <span className="rating-breakdown__fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                {reviews.map((r) => (
                  <div key={r.id} className="review-item">
                    <div className="row" style={{ marginBottom: 4 }}>
                      <span className="rating__stars">{'★'.repeat(r.rating)}</span>
                      <span className="muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <p style={{ margin: 0, fontSize: 14 }}>{r.comment}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="card sticky-card">
          <h3 style={{ marginBottom: 4 }}>Book this car</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Pricing is calculated automatically from the owner's rates.
          </p>

          {vehicle.status !== 'ACTIVE' ? (
            <div className="alert alert--error">This vehicle isn't currently bookable (status: {vehicle.status}).</div>
          ) : (
            <form onSubmit={handleBook}>
              {bookingError && <div className="alert alert--error">{bookingError}</div>}

              <div className="field">
                <label className="label">Pricing</label>
                <select
                  className="input"
                  value={bookingForm.pricingType}
                  onChange={(e) => setBookingForm({ ...bookingForm, pricingType: e.target.value })}
                >
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                </select>
              </div>

              <div className="field">
                <label className="label">Pickup location</label>
                <input className="input" value={vehicle.pickupLocation || vehicle.city} disabled />
              </div>

              <div className="field">
                <label className="label">Start</label>
                <input
                  className="input"
                  type="datetime-local"
                  required
                  value={bookingForm.startDateTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, startDateTime: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="label">End</label>
                <input
                  className="input"
                  type="datetime-local"
                  required
                  value={bookingForm.endDateTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, endDateTime: e.target.value })}
                />
              </div>

              {pricePreview && (
                <div className="price-preview">
                  <span className="price-preview__label">Est. total ({pricePreview.unit})</span>
                  <span className="price-preview__value">₹{pricePreview.amount}</span>
                </div>
              )}

              <button className="btn btn-primary btn-block" disabled={bookingLoading}>
                {bookingLoading ? (
                  <>
                    <span className="spinner spinner--sm" /> Checking availability…
                  </>
                ) : isAuthenticated ? (
                  'Check Availability & Book'
                ) : (
                  'Log in to book'
                )}
              </button>
              <p className="muted" style={{ marginTop: 10, fontSize: 12, textAlign: 'center' }}>
                The final price is always recalculated server-side — this is just an estimate.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
