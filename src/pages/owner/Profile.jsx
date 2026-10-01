import { useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../services/apiClient'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import ComingSoonList from '../../components/common/ComingSoonList'
import ChangePasswordForm from '../../components/common/ChangePasswordForm'

const COMING_SOON = [
  { title: 'Bank / payout details', reason: 'No payout system — payment-service is a mock gateway' },
  { title: 'Business/tax information', reason: 'No fields for this on the User entity yet' },
  { title: 'Notification preferences', reason: 'No settings-storage endpoint yet' },
]

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading profile…" />

  return (
    <div className="container page">
      <div className="page-header">
        <h2>My profile</h2>
        <p>Your owner account details.</p>
      </div>

      {error && <ErrorState message={error} />}

      {profile && (
        <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="stack">
            <div className="card">
              <div
                className="plate"
                style={{ borderRadius: '50%', width: 56, height: 56, justifyContent: 'center', fontSize: 20, marginBottom: 14 }}
              >
                {profile.fullName?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ fontWeight: 600, fontSize: 17, fontFamily: 'var(--font-display)' }}>{profile.fullName}</div>
              <p className="muted" style={{ marginTop: 2 }}>{profile.email}</p>

              <hr className="divider" />

              <div className="stack">
                <div className="row spread">
                  <span className="muted">Phone</span>
                  <span>{profile.phoneNumber || '—'}</span>
                </div>
                <div className="row spread">
                  <span className="muted">Roles</span>
                  <span>{profile.roles?.join(', ')}</span>
                </div>
                <div className="row spread">
                  <span className="muted">Hosting since</span>
                  <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <ChangePasswordForm />
          </div>

          <ComingSoonList items={COMING_SOON} />
        </div>
      )}
    </div>
  )
}
