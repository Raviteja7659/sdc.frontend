import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import VehicleForm, { EMPTY_VEHICLE_FORM } from '../../components/owner/VehicleForm'
import Loader from '../../components/common/Loader'

export default function EditVehicle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    vehicleService
      .getById(id)
      .then(({ data }) => setForm({ ...EMPTY_VEHICLE_FORM, ...data }))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await vehicleService.update(id, {
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

  if (fetching) return <Loader label="Loading vehicle…" />

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Edit vehicle</h2>
        <p>Changes apply immediately — status/verification is unaffected by edits.</p>
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        {form && (
          <VehicleForm
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Save changes"
          />
        )}
      </div>
    </div>
  )
}
