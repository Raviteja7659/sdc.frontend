import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAllPayments().then(({ data }) => setPayments(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Payments</h2>
        <p>All payment transactions across the platform.</p>
      </div>

      <div className="demo-banner">
        ⚠ Demo data — payment-service has no admin-only "list all payments" endpoint yet. Same swap-in pattern as
        Users once that exists. (Remember: even the real data here is from the mock payment gateway — no real money
        ever moves in this system.)
      </div>

      {loading ? (
        <Loader label="Loading…" />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Booking</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>#{p.bookingId}</td>
                <td>₹{p.amount}</td>
                <td>{p.method}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.transactionId}</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
