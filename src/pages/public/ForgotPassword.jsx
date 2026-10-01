import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setState('loading')
    try {
      await authService.requestPasswordReset(email)
    } catch (err) {
      setState('error')
      setMessage(err?.response?.data?.message || 'Something went wrong.')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-shell">
          <div className="card">
            <h3 style={{ marginBottom: 6 }}>Reset your password</h3>
            <p className="muted" style={{ marginBottom: 18, fontSize: 13 }}>
              Enter the email on your account and we'll send you a reset link.
            </p>

            {state === 'error' && <div className="alert alert--error">{message}</div>}

            <form onSubmit={handleSubmit}>
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" block loading={state === 'loading'}>
                Send reset link
              </Button>
            </form>

            <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
              <Link to="/login" className="link-accent">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
