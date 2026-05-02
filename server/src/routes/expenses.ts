import { Router } from 'express'
import { db } from '../db/database'
import type { Expense } from '../types'

const router = Router()

router.get('/', (req, res) => {
  const { userId, from, to, category, limit = '100', offset = '0' } = req.query as Record<string, string>

  let query = `
    SELECT e.*, u.phone as user_phone, u.name as user_name
    FROM expenses e JOIN users u ON e.user_id = u.id
    WHERE 1=1
  `
  const params: (string | number)[] = []

  if (userId) { query += ' AND e.user_id = ?'; params.push(Number(userId)) }
  if (from)   { query += ' AND e.expense_date >= ?'; params.push(from) }
  if (to)     { query += ' AND e.expense_date <= ?'; params.push(to) }
  if (category) { query += ' AND e.category = ?'; params.push(category) }

  query += ' ORDER BY e.expense_date DESC LIMIT ? OFFSET ?'
  params.push(Number(limit), Number(offset))

  const rows = db.prepare(query).all(...params) as Expense[]
  const total = (db.prepare(`SELECT COUNT(*) as n FROM expenses`).get() as { n: number }).n

  res.json({ data: rows, total })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
