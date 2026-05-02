const BASE = '/api'

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export interface Expense {
  id: number
  user_id: number
  amount: number
  currency: string
  category: string
  description: string
  raw_message: string
  expense_date: string
  user_phone?: string
  user_name?: string | null
}

export interface User {
  id: number
  phone: string
  name: string | null
  expense_count: number
  total_spent: number
  created_at: string
}

export interface Stats {
  totalAmount: number
  expenseCount: number
  userCount: number
  byCategory: { category: string; total: number }[]
  byMonth: { month: string; total: number }[]
  topUsers: { phone: string; name: string | null; total: number }[]
}

export const api = {
  getExpenses: (params?: Record<string, string>) =>
    get<{ data: Expense[]; total: number }>('/expenses', params),

  deleteExpense: (id: number) =>
    fetch(`${BASE}/expenses/${id}`, { method: 'DELETE' }).then(r => r.json()),

  getUsers: () => get<User[]>('/users'),

  getStats: () => get<Stats>('/stats'),
}
