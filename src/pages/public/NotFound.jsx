import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <span className="plate">404</span>
        <h2 style={{ marginBottom: 8 }}>Wrong turn.</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          This route doesn't exist — the page you're looking for isn't on the map.
        </p>
        <Link to="/">
          <button className="btn btn-primary">Back to browsing</button>
        </Link>
      </div>
    </div>
  )
}
