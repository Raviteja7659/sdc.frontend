import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">
            <span className="plate">SDC</span>
            SelfDriveConnect
          </div>
          <p className="footer__tagline">
            A peer-to-peer self-drive marketplace — real owners, real cars, no rental counter. Built as a
            microservices portfolio project.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <div className="footer__col-title">Renters</div>
            <Link to="/">Browse cars</Link>
            <Link to="/my-bookings">My bookings</Link>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Owners</div>
            <Link to="/owner">List a car</Link>
            <Link to="/owner">My dashboard</Link>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Platform</div>
            <div>5 microservices</div>
            <div>1 API gateway</div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">SelfDriveConnect · local development build</div>
    </footer>
  )
}
