import Input from '../common/Input'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'

export const EMPTY_VEHICLE_FORM = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  registrationNumber: '',
  fuelType: 'PETROL',
  transmissionType: 'MANUAL',
  seatingCapacity: 5,
  pricePerHour: '',
  pricePerDay: '',
  city: '',
  pickupLocation: '',
  imageUrl: '',
}

/**
 * The spec's 7-step listing wizard (specs, features checklist, weekly
 * discount, security deposit, multi-image upload with a primary image,
 * preview step) assumes fields vehicle-service doesn't have yet — it
 * only stores the fields below. Rather than build a fake multi-step
 * wizard around data that goes nowhere, this is a single clean form
 * covering exactly what the backend accepts, organized into the same
 * logical groups the spec describes (basic info / specs / location /
 * pricing) so extending it later is straightforward.
 */
export default function VehicleForm({ form, onChange, onSubmit, loading, error, submitLabel }) {
  function set(key, value) {
    onChange({ ...form, [key]: value })
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="filter-sidebar__title" style={{ marginBottom: 10 }}>
        Basic information
      </div>
      <div className="form-grid">
        <Input label="Brand" required value={form.brand} onChange={(e) => set('brand', e.target.value)} />
        <Input label="Model" required value={form.model} onChange={(e) => set('model', e.target.value)} />
        <Input label="Year" type="number" required value={form.year} onChange={(e) => set('year', e.target.value)} />
        <Input
          label="Registration number"
          required
          value={form.registrationNumber}
          onChange={(e) => set('registrationNumber', e.target.value)}
        />
        <div className="field">
          <label className="label">Fuel type</label>
          <select className="input" value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)}>
            <option>PETROL</option>
            <option>DIESEL</option>
            <option>ELECTRIC</option>
            <option>CNG</option>
            <option>HYBRID</option>
          </select>
        </div>
        <div className="field">
          <label className="label">Transmission</label>
          <select className="input" value={form.transmissionType} onChange={(e) => set('transmissionType', e.target.value)}>
            <option>MANUAL</option>
            <option>AUTOMATIC</option>
          </select>
        </div>
      </div>

      <hr className="divider" />
      <div className="filter-sidebar__title" style={{ marginBottom: 10 }}>
        Specifications & location
      </div>
      <div className="form-grid">
        <Input
          label="Seating capacity"
          type="number"
          required
          value={form.seatingCapacity}
          onChange={(e) => set('seatingCapacity', e.target.value)}
        />
        <Input label="City" required value={form.city} onChange={(e) => set('city', e.target.value)} />
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Pickup location"
            value={form.pickupLocation}
            onChange={(e) => set('pickupLocation', e.target.value)}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Image URL (optional)"
            placeholder="https://…"
            value={form.imageUrl}
            onChange={(e) => set('imageUrl', e.target.value)}
          />
        </div>
      </div>

      <hr className="divider" />
      <div className="filter-sidebar__title" style={{ marginBottom: 10 }}>
        Pricing
      </div>
      <div className="form-grid">
        <Input
          label="Price per hour (₹)"
          type="number"
          step="0.01"
          required
          value={form.pricePerHour}
          onChange={(e) => set('pricePerHour', e.target.value)}
        />
        <Input
          label="Price per day (₹)"
          type="number"
          step="0.01"
          required
          value={form.pricePerDay}
          onChange={(e) => set('pricePerDay', e.target.value)}
        />
      </div>

      <p className="muted" style={{ marginBottom: 14, fontSize: 13 }}>
        New listings start as <StatusBadge status="PENDING_VERIFICATION" /> — an admin needs to activate them before
        renters can find or book them.
      </p>

      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  )
}
