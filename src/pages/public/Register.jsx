import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Register() {
  const [step, setStep] = useState(1)
  const [roles, setRoles] = useState({ RENTER: false, OWNER: false })
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  function goToStep2() {
    if (!roles.RENTER && !roles.OWNER) {
      setError('Choose at least one: rent a car, or list a car.')
      return
    }
    setError('')
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords don\u2019t match.')
      return
    }

    const selectedRoles = Object.entries(roles)
      .filter(([, checked]) => checked)
      .map(([role]) => role)

    setLoading(true)
    const result = await register({
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      roles: selectedRoles,
    })
    setLoading(false)
    if (result.ok) navigate(redirectTo)
    else setError(result.message)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-shell">
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <span className="plate" style={{ fontSize: 15, padding: '6px 12px' }}>
              SDC
            </span>
            <p className="muted" style={{ marginTop: 10 }}>Join to rent or list a car in minutes.</p>
          </div>

          <div className="card">
            {error && <div className="alert alert--error">{error}</div>}

            {step === 1 ? (
              <>
                <h3 style={{ marginBottom: 4 }}>What do you want to do?</h3>
                <p className="muted" style={{ marginBottom: 16, fontSize: 13 }}>
                  Pick one or both — you can always add the other later.
                </p>

                <div className="stack" style={{ marginBottom: 20 }}>
                  <div
                    className={`card ${roles.RENTER ? 'stat-card--route' : ''}`}
                    style={{ cursor: 'pointer', borderWidth: roles.RENTER ? 2 : 1 }}
                    onClick={() => setRoles({ ...roles, RENTER: !roles.RENTER })}
                  >
                    <div className="spread">
                      <div>
                        <div style={{ fontWeight: 600 }}>🚗 Rent a car</div>
                        <div className="muted" style={{ fontSize: 13 }}>Browse and book vehicles nearby.</div>
                      </div>
                      <input type="checkbox" checked={roles.RENTER} readOnly />
                    </div>
                  </div>

                  <div
                    className={`card ${roles.OWNER ? 'stat-card--route' : ''}`}
                    style={{ cursor: 'pointer', borderWidth: roles.OWNER ? 2 : 1 }}
                    onClick={() => setRoles({ ...roles, OWNER: !roles.OWNER })}
                  >
                    <div className="spread">
                      <div>
                        <div style={{ fontWeight: 600 }}>🔑 List a car</div>
                        <div className="muted" style={{ fontSize: 13 }}>Earn money renting out your vehicle.</div>
                      </div>
                      <input type="checkbox" checked={roles.OWNER} readOnly />
                    </div>
                  </div>
                </div>

                <Button block onClick={goToStep2}>
                  Continue
                </Button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="muted"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12, padding: 0 }}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>

                <div className="form-grid">
                  <Input
                    label="First name"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                  <Input
                    label="Last name"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <div className="password-field field">
                  <label className="label">Password (min 8 characters)</label>
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>

                <Input
                  label="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />

                <Input
                  label="Phone number"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />

                {roles.OWNER && (
                  <div className="alert" style={{ background: 'var(--paper)', border: '1px dashed var(--line)', fontSize: 13 }}>
                    Owner accounts start with basic details only — vehicle verification happens per-listing when you
                    add a car, not at signup.
                  </div>
                )}

                <Button type="submit" block loading={loading} style={{ marginTop: 6 }}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            )}
          </div>

          <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" className="link-accent">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
