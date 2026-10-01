const FUEL_OPTIONS = ['ALL', 'PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID']
const TRANSMISSION_OPTIONS = ['ALL', 'MANUAL', 'AUTOMATIC']
const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating_desc', label: 'Highest rated' },
]

export default function VehicleFilters({ filters, onChange, seatOptions = ['ALL', '2', '4', '5', '7'] }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <>
      <div className="filter-sidebar__group">
        <div className="filter-sidebar__title">Fuel type</div>
        <select className="input" value={filters.fuel} onChange={(e) => set('fuel', e.target.value)}>
          {FUEL_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f === 'ALL' ? 'Any fuel type' : f}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-sidebar__group">
        <div className="filter-sidebar__title">Transmission</div>
        <select className="input" value={filters.transmission} onChange={(e) => set('transmission', e.target.value)}>
          {TRANSMISSION_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t === 'ALL' ? 'Any transmission' : t}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-sidebar__group">
        <div className="filter-sidebar__title">Seats</div>
        <select className="input" value={filters.seats} onChange={(e) => set('seats', e.target.value)}>
          {seatOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'Any seats' : `${s}+ seats`}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-sidebar__group">
        <div className="filter-sidebar__title">Max price / hour (₹)</div>
        <input
          className="input"
          type="number"
          placeholder="No limit"
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', e.target.value)}
        />
      </div>

      <div className="filter-sidebar__group">
        <div className="filter-sidebar__title">Sort by</div>
        <select className="input" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export const DEFAULT_FILTERS = { fuel: 'ALL', transmission: 'ALL', seats: 'ALL', maxPrice: '', sort: 'default' }
