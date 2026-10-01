import { useEffect, useState, useCallback, useMemo } from 'react'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import StatCard from '../../components/common/StatCard'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    vehicleService
      .list()
      .then(({ data }) => setVehicles(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function updateStatus(id, status) {
    setBusyId(id)
    setError('')
    try {
      await vehicleService.updateStatus(id, status)
      await load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setBusyId(null)
      setRejectTarget(null)
    }
  }

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      pending: vehicles.filter((v) => v.status === 'PENDING_VERIFICATION').length,
      active: vehicles.filter((v) => v.status === 'ACTIVE').length,
      suspended: vehicles.filter((v) => v.status === 'SUSPENDED').length,
    }),
    [vehicles]
  )

  const pending = vehicles.filter((v) => v.status === 'PENDING_VERIFICATION')
  const others = vehicles.filter((v) => v.status !== 'PENDING_VERIFICATION')

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Vehicle verification</h2>
        <p>Activate new listings so renters can find and book them, or suspend problematic ones.</p>
      </div>

      {!loading && vehicles.length > 0 && (
        <div className="stat-cards">
          <StatCard label="Total listings" value={stats.total} />
          <StatCard label="Pending review" value={stats.pending} variant="accent" />
          <StatCard label="Active" value={stats.active} variant="route" />
          <StatCard label="Suspended" value={stats.suspended} />
        </div>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <Loader label="Loading listings…" />
      ) : (
        <>
          <h3 className="section-title">Pending verification ({pending.length})</h3>
          {pending.length === 0 ? (
            <p className="muted" style={{ marginBottom: 28 }}>
              Nothing waiting on review.
            </p>
          ) : (
            <div className="stack" style={{ marginBottom: 28 }}>
              {pending.map((v) => (
                <div key={v.id} className="card spread">
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {v.brand} {v.model} <span className="plate">{v.registrationNumber}</span>
                    </div>
                    <div className="muted" style={{ marginTop: 4 }}>
                      Owner #{v.ownerId} · {v.city}
                    </div>
                  </div>
                  <div className="row">
                    {busyId === v.id ? (
                      <span className="spinner spinner--sm" />
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(v.id, 'ACTIVE')}>
                          Activate
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setRejectTarget(v)}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="section-title">All other listings ({others.length})</h3>
          {others.length === 0 ? (
            <EmptyState icon="🗂" title="Nothing else yet">
              Other listings will show up here once activated or suspended.
            </EmptyState>
          ) : (
            <div className="stack">
              {others.map((v) => (
                <div key={v.id} className="card spread">
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {v.brand} {v.model} <span className="plate">{v.registrationNumber}</span>
                    </div>
                    <div className="muted" style={{ marginTop: 4 }}>
                      Owner #{v.ownerId} · {v.city}
                    </div>
                  </div>
                  <div className="row">
                    <StatusBadge status={v.status} />
                    {busyId === v.id ? (
                      <span className="spinner spinner--sm" />
                    ) : (
                      <>
                        {v.status === 'ACTIVE' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(v.id, 'SUSPENDED')}>
                            Suspend
                          </button>
                        )}
                        {v.status === 'SUSPENDED' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(v.id, 'ACTIVE')}>
                            Reactivate
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!rejectTarget}
        title="Reject this listing?"
        body={rejectTarget ? `${rejectTarget.brand} ${rejectTarget.model} will be marked SUSPENDED and won't be bookable.` : ''}
        confirmLabel="Reject listing"
        danger
        loading={busyId === rejectTarget?.id}
        onConfirm={() => updateStatus(rejectTarget.id, 'SUSPENDED')}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  )
}
