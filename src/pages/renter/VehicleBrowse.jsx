import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import VehicleCard from '../../components/vehicle/VehicleCard'
import VehicleCardSkeleton from '../../components/vehicle/VehicleCardSkeleton'
import VehicleFilters, { DEFAULT_FILTERS } from '../../components/vehicle/VehicleFilters'
import NearbyVehiclesMap from '../../components/map/NearbyVehiclesMap'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Drawer from '../../components/common/Drawer'
import Button from '../../components/common/Button'

export default function VehicleBrowse() {
  const [searchParams] = useSearchParams()
  const cityParam = searchParams.get('city') || ''

  const [city, setCity] = useState(cityParam)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(!!cityParam)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // "Near me" mode — Uber/Rapido-style geolocation search, separate
  // from city text search since it needs the browser's own location
  // and returns distance-annotated results from a different endpoint.
  const [nearbyMode, setNearbyMode] = useState(false)
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [nearbyError, setNearbyError] = useState('')
  const [nearbyResults, setNearbyResults] = useState([])
  const [myLocation, setMyLocation] = useState(null)

  async function load(cityToSearch) {
    setLoading(true)
    setError('')
    try {
      const { data } = cityToSearch
        ? await vehicleService.searchByCity(cityToSearch)
        : await vehicleService.list()
      setVehicles(cityToSearch ? data : data.filter((v) => v.status === 'ACTIVE'))
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(cityParam || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    setNearbyMode(false)
    setSearched(!!city.trim())
    load(city.trim() || null)
  }

  function clearSearch() {
    setCity('')
    setSearched(false)
    setNearbyMode(false)
    load(null)
  }

  function handleNearMe() {
    setNearbyError('')
    if (!navigator.geolocation) {
      setNearbyError('Your browser doesn\u2019t support location access.')
      return
    }
    setNearbyLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setMyLocation([lat, lng])
        try {
          const { data } = await vehicleService.findNearby(lat, lng, 15)
          setNearbyResults(data)
          setNearbyMode(true)
          setSearched(false)
        } catch (err) {
          setNearbyError(extractErrorMessage(err))
        } finally {
          setNearbyLoading(false)
        }
      },
      () => {
        setNearbyError('Location access was denied — allow it in your browser to use "Near me".')
        setNearbyLoading(false)
      }
    )
  }

  const visibleVehicles = useMemo(() => {
    let list = [...vehicles]
    if (filters.fuel !== 'ALL') list = list.filter((v) => v.fuelType === filters.fuel)
    if (filters.transmission !== 'ALL') list = list.filter((v) => v.transmissionType === filters.transmission)
    if (filters.seats !== 'ALL') list = list.filter((v) => v.seatingCapacity >= Number(filters.seats))
    if (filters.maxPrice) list = list.filter((v) => v.pricePerHour <= Number(filters.maxPrice))
    if (filters.sort === 'price_asc') list.sort((a, b) => a.pricePerHour - b.pricePerHour)
    if (filters.sort === 'price_desc') list.sort((a, b) => b.pricePerHour - a.pricePerHour)
    return list
  }, [vehicles, filters])

  const filtersActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)

  return (
    <div className="container page">
      <div className="page-header spread">
        <div>
          <h2>
            {nearbyMode ? 'Cars near you' : searched ? `Cars in ${cityParam || city}` : 'Browse vehicles'}
          </h2>
          <p>
            {nearbyMode
              ? `${nearbyResults.length} car${nearbyResults.length === 1 ? '' : 's'} within 15 km`
              : loading
                ? 'Loading…'
                : `${visibleVehicles.length} car${visibleVehicles.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        {!nearbyMode && (
          <Button variant="ghost" size="sm" className="mobile-filter-trigger" onClick={() => setDrawerOpen(true)}>
            Filters {filtersActive ? '●' : ''}
          </Button>
        )}
      </div>

      <div className="row" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} className="row" style={{ flex: 1, minWidth: 240 }}>
          <input className="input" placeholder="Search by city" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button type="submit">Search</Button>
        </form>
        <Button variant="dark" onClick={handleNearMe} loading={nearbyLoading}>
          📍 Near me
        </Button>
        {(searched || nearbyMode) && (
          <Button variant="ghost" size="sm" type="button" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={() => load(searched ? city : null)} />}
      {nearbyError && <ErrorState message={nearbyError} />}

      {nearbyMode ? (
        <>
          <NearbyVehiclesMap center={myLocation} vehicles={nearbyResults} />
          <p className="muted" style={{ margin: '14px 0' }}>
            Distance is measured as a straight line (great-circle distance), not driving distance.
          </p>
          {nearbyResults.length === 0 ? (
            <EmptyState icon="📍" title="Nothing within 15 km">
              Try browsing by city instead.
            </EmptyState>
          ) : (
            <div className="vehicle-grid">
              {nearbyResults.map((r) => (
                <VehicleCard key={r.vehicle.id} vehicle={r.vehicle} distanceKm={r.distanceKm} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="browse-layout">
          <div className="filter-sidebar">
            <VehicleFilters filters={filters} onChange={setFilters} />
          </div>

          <div>
            {loading ? (
              <div className="vehicle-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            ) : visibleVehicles.length === 0 ? (
              <EmptyState icon="🚗" title="No cars match right now">
                Try a different city or clear your filters.
              </EmptyState>
            ) : (
              <div className="vehicle-grid">
                {visibleVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        <VehicleFilters filters={filters} onChange={setFilters} />
        <Button block onClick={() => setDrawerOpen(false)} style={{ marginTop: 10 }}>
          Show {visibleVehicles.length} cars
        </Button>
      </Drawer>
    </div>
  )
}
