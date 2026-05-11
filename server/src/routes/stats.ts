import { Router } from 'express'
import { db } from '../db/database'
import type { Stats } from '../types'

const router = Router()

router.get('/', (_req, res) => {
  const { totalAmount, expenseCount } = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as totalAmount, COUNT(*) as expenseCount FROM expenses
  `).get() as { totalAmount: number; expenseCount: number }

  const { userCount } = db.prepare(`SELECT COUNT(*) as userCount FROM users`).get() as { userCount: number }

  const byCategory = db.prepare(`
    SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC
  `).all() as { category: string; total: number }[]

  const byMonth = db.prepare(`
    SELECT strftime('%Y-%m', expense_date) as month, SUM(amount) as total
    FROM expenses GROUP BY month ORDER BY month DESC LIMIT 12
  `).all() as { month: string; total: number }[]

  const topUsers = db.prepare(`
    SELECT u.phone, u.name, SUM(e.amount) as total
    FROM expenses e JOIN users u ON e.user_id = u.id
    GROUP BY u.id ORDER BY total DESC LIMIT 10
  `).all() as { phone: string; name: string | null; total: number }[]

  const stats: Stats = { totalAmount, expenseCount, userCount, byCategory, byMonth, topUsers }
  res.json(stats)
})

export default router
