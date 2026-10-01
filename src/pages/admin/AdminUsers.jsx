import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAllUsers().then(({ data }) => setUsers(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Users</h2>
        <p>All registered accounts across the platform.</p>
      </div>

      <div className="demo-banner">
        ⚠ Demo data — user-service has no admin-only "list all users" endpoint yet. This table shows the shape a
        real one would return; wiring it up is a one-line change in <code>adminService.js</code> once that endpoint
        exists.
      </div>

      {loading ? (
        <Loader label="Loading…" />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <div className="row" style={{ gap: 4 }}>
                    {u.roles.map((r) => (
                      <StatusBadge key={r} status={r === 'ADMIN' ? 'FAILED' : r === 'OWNER' ? 'ACTIVE' : 'PENDING'} />
                    ))}
                  </div>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
