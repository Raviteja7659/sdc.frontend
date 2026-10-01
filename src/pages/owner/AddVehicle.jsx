import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import VehicleForm, { EMPTY_VEHICLE_FORM } from '../../components/owner/VehicleForm'

export default function AddVehicle() {
  const [form, setForm] = useState(EMPTY_VEHICLE_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await vehicleService.create({
        ...form,
        year: Number(form.year),
        seatingCapacity: Number(form.seatingCapacity),
        pricePerHour: Number(form.pricePerHour),
        pricePerDay: Number(form.pricePerDay),
      })
      navigate('/owner/vehicles')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h2>List a new vehicle</h2>
        <p>Fill in your car's details — you can edit them anytime.</p>
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        <VehicleForm form={form} onChange={setForm} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="List this car" />
      </div>
    </div>
  )
}
