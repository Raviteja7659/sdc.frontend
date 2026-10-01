import { Link } from 'react-router-dom'

export default function NotAuthorized() {
  return (
    <div className="container">
      <div className="not-found">
        <span className="plate">403</span>
        <h2 style={{ marginBottom: 8 }}>Not your lane.</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Your account doesn't have the role needed to view this page.
        </p>
        <Link to="/">
          <button className="btn btn-primary">Back to home</button>
        </Link>
      </div>
    </div>
  )
}
