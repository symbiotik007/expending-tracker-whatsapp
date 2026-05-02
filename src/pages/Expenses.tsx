import { useEffect, useState, useCallback } from 'react'
import { api, type Expense } from '../api/client'
import './Expenses.css'

const CATEGORY_EMOJI: Record<string, string> = {
  comida: '🍔', supermercado: '🛒', transporte: '🚗',
  salud: '💊', entretenimiento: '🎬', ropa: '👕',
  servicios: '💡', educación: '📚', otros: '📦',
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { limit: '200' }
      if (category) params.category = category
      const result = await api.getExpenses(params)
      setExpenses(result.data)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este gasto?')) return
    await api.deleteExpense(id)
    setExpenses(e => e.filter(x => x.id !== id))
  }

  const filtered = expenses.filter(e =>
    !search || e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.raw_message?.toLowerCase().includes(search.toLowerCase()) ||
    e.user_phone?.includes(search)
  )

  const categories = [...new Set(expenses.map(e => e.category).filter(Boolean))]

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1 className="page-title">Gastos</h1>
        <span className="total-badge">{total} registros</span>
      </div>

      <div className="filters">
        <input
          className="filter-input"
          placeholder="🔍 Buscar por descripción, mensaje o teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c} value={c}>{CATEGORY_EMOJI[c] ?? '💰'} {c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="table-loading">Cargando...</div>
      ) : (
        <div className="table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Monto</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Mensaje original</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">Sin resultados</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td className="td-date">{formatDate(e.expense_date)}</td>
                  <td className="td-user">
                    <span className="user-phone">{e.user_phone?.replace('@s.whatsapp.net', '') ?? '—'}</span>
                    {e.user_name && <span className="user-name">{e.user_name}</span>}
                  </td>
                  <td className="td-amount">
                    <strong>${e.amount.toLocaleString('es')}</strong>
                    <span className="currency">{e.currency}</span>
                  </td>
                  <td>
                    <span className="category-badge">
                      {CATEGORY_EMOJI[e.category] ?? '💰'} {e.category}
                    </span>
                  </td>
                  <td className="td-desc">{e.description}</td>
                  <td className="td-raw"><em>{e.raw_message}</em></td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(e.id)} title="Eliminar">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
