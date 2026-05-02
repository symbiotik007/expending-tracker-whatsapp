import { useEffect, useState } from 'react'
import { api, type User } from '../api/client'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="users-loading">Cargando...</div>

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Usuarios</h1>
        <span className="total-badge">{users.length} activos</span>
      </div>

      {users.length === 0 ? (
        <div className="users-empty">
          <span>👥</span>
          <p>Aún no hay usuarios registrados.</p>
          <p>Conecta el bot y envía tu primer mensaje desde WhatsApp.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(u => (
            <div key={u.id} className="user-card">
              <div className="user-avatar">
                {(u.name?.[0] ?? u.phone[0] ?? '?').toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-display-name">{u.name ?? 'Sin nombre'}</div>
                <div className="user-phone-small">{u.phone.replace('@s.whatsapp.net', '')}</div>
                <div className="user-joined">Desde {formatDate(u.created_at)}</div>
              </div>
              <div className="user-stats">
                <div className="user-stat">
                  <span className="user-stat-value">${u.total_spent.toLocaleString('es')}</span>
                  <span className="user-stat-label">gastado</span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-value">{u.expense_count}</span>
                  <span className="user-stat-label">gastos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
