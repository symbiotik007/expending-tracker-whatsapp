import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { api, type Stats } from '../api/client'
import './Dashboard.css'

const COLORS = ['#25d366','#075e54','#34d399','#6ee7b7','#a7f3d0','#059669','#0d9488','#14b8a6']

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.getStats().then(setStats).catch(() => setError(true))
  }, [])

  if (error) return <div className="dash-error">No se pudo conectar al servidor. ¿Está corriendo el backend?</div>
  if (!stats) return <div className="dash-loading">Cargando...</div>

  const monthData = [...stats.byMonth].reverse()

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-cards">
        <StatCard label="Total gastado" value={`$${stats.totalAmount.toLocaleString('es')}`} icon="💰" color="#25d366" />
        <StatCard label="Gastos registrados" value={stats.expenseCount.toString()} icon="📋" color="#3b82f6" />
        <StatCard label="Usuarios activos" value={stats.userCount.toString()} icon="👥" color="#8b5cf6" />
        <StatCard
          label="Promedio por gasto"
          value={stats.expenseCount > 0 ? `$${Math.round(stats.totalAmount / stats.expenseCount).toLocaleString('es')}` : '$0'}
          icon="📊"
          color="#f59e0b"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Gastos por mes</h2>
          {monthData.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={60} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('es')}`, 'Total']} />
                <Bar dataKey="total" fill="#25d366" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>Por categoría</h2>
          {stats.byCategory.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString('es')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {stats.topUsers.length > 0 && (
        <div className="chart-card">
          <h2>Top usuarios</h2>
          <table className="mini-table">
            <thead>
              <tr><th>Teléfono</th><th>Nombre</th><th>Total gastado</th></tr>
            </thead>
            <tbody>
              {stats.topUsers.map((u, i) => (
                <tr key={i}>
                  <td><code>{u.phone.replace('@s.whatsapp.net', '')}</code></td>
                  <td>{u.name ?? '—'}</td>
                  <td><strong>${u.total.toLocaleString('es')}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="stat-card" style={{ '--accent': color } as React.CSSProperties}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

function Empty() {
  return <div className="chart-empty">Sin datos aún</div>
}
