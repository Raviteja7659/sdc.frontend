import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form, remember)
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
            <p className="muted" style={{ marginTop: 10 }}>Welcome back — log in to book or manage your cars.</p>
          </div>

          <div className="card">
            {error && <div className="alert alert--error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                autoFocus
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div className="password-field field">
                <label className="label">Password</label>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  required
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

              <div className="spread" style={{ marginBottom: 18 }}>
                <label className="checkbox-item">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="link-accent" style={{ fontSize: 13 }}>
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" block loading={loading}>
                {loading ? 'Logging in…' : 'Log in'}
              </Button>
            </form>
          </div>

          <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
            Don't have an account?{' '}
            <Link to="/register" className="link-accent">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
