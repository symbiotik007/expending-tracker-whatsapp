import { Router } from 'express'
import { db } from '../db/database'

const router = Router()

router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT u.*,
      COUNT(e.id) as expense_count,
      COALESCE(SUM(e.amount), 0) as total_spent
    FROM users u
    LEFT JOIN expenses e ON e.user_id = u.id
    GROUP BY u.id
    ORDER BY total_spent DESC
  `).all()
  res.json(rows)
})

export default router
