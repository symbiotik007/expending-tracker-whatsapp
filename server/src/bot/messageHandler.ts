import { db, upsertUser, insertExpense } from '../db/database'
import { parseExpense } from '../ai/parseExpense'

type SendFn = (jid: string, text: string) => Promise<void>

const CURRENCY_SYMBOL: Record<string, string> = {
  ARS: '$', USD: 'USD', EUR: '€', MXN: 'MX$',
}

export async function handleMessage(
  jid: string,
  senderName: string | undefined,
  text: string,
  send: SendFn,
) {
  const phone = jid.replace('@s.whatsapp.net', '')
  const userId = upsertUser(jid, senderName)

  const cmd = text.trim().toLowerCase()

  if (cmd === '/ayuda' || cmd === '/help') {
    await send(jid, ayuda())
    return
  }

  if (cmd === '/resumen' || cmd === '/summary') {
    await send(jid, resumenMensual(userId))
    return
  }

  if (cmd === '/semana' || cmd === '/week') {
    await send(jid, resumenSemana(userId))
    return
  }

  if (cmd === '/categorias' || cmd === '/cats') {
    await send(jid, resumenCategorias(userId))
    return
  }

  // Parse as expense via Claude
  const parsed = await parseExpense(text)

  if (!parsed) {
    await send(jid, `No entendí ese mensaje como un gasto 🤔\nEscribe */ayuda* para ver los comandos disponibles.`)
    return
  }

  insertExpense({
    user_id: userId,
    amount: parsed.amount,
    currency: parsed.currency,
    category: parsed.category,
    description: parsed.description,
    raw_message: text,
  })

  // Monthly total so far
  const monthTotal = (db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM expenses
    WHERE user_id = ? AND strftime('%Y-%m', expense_date) = strftime('%Y-%m', 'now')
  `).get(userId) as { total: number }).total

  const sym = CURRENCY_SYMBOL[parsed.currency] ?? parsed.currency
  await send(jid,
    `✅ *${sym}${parsed.amount.toLocaleString('es')}* en _${parsed.category}_ registrado.\n` +
    `Llevas *${sym}${monthTotal.toLocaleString('es')}* este mes.`
  )
}

function resumenMensual(userId: number): string {
  const rows = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM expenses
    WHERE user_id = ? AND strftime('%Y-%m', expense_date) = strftime('%Y-%m', 'now')
    GROUP BY category ORDER BY total DESC
  `).all(userId) as { category: string; total: number }[]

  const grandTotal = rows.reduce((s, r) => s + r.total, 0)
  if (!rows.length) return '📭 Sin gastos registrados este mes.'

  const lines = rows.map(r => `  ${categoryEmoji(r.category)} ${r.category} · $${r.total.toLocaleString('es')}`)
  return `📊 *Resumen de este mes:*\n${lines.join('\n')}\n──────────────\nTotal: *$${grandTotal.toLocaleString('es')}*`
}

function resumenSemana(userId: number): string {
  const rows = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM expenses
    WHERE user_id = ? AND expense_date >= date('now', '-7 days')
    GROUP BY category ORDER BY total DESC
  `).all(userId) as { category: string; total: number }[]

  const grandTotal = rows.reduce((s, r) => s + r.total, 0)
  if (!rows.length) return '📭 Sin gastos en los últimos 7 días.'

  const lines = rows.map(r => `  ${categoryEmoji(r.category)} ${r.category} · $${r.total.toLocaleString('es')}`)
  return `📅 *Resumen de esta semana:*\n${lines.join('\n')}\n──────────────\nTotal: *$${grandTotal.toLocaleString('es')}*`
}

function resumenCategorias(userId: number): string {
  const rows = db.prepare(`
    SELECT category, SUM(amount) as total, COUNT(*) as count
    FROM expenses WHERE user_id = ?
    GROUP BY category ORDER BY total DESC
  `).all(userId) as { category: string; total: number; count: number }[]

  if (!rows.length) return '📭 Sin gastos registrados aún.'
  const lines = rows.map(r => `${categoryEmoji(r.category)} *${r.category}*: $${r.total.toLocaleString('es')} (${r.count} gastos)`)
  return `🏷️ *Tus categorías:*\n\n${lines.join('\n')}`
}

function ayuda(): string {
  return `🤖 *SpendyBot — Comandos*

Para registrar un gasto, simplemente escríbelo en lenguaje natural:
  _"Gasté 500 en el super"_
  _"taxi 200 pesos"_
  _"almuerzo $350"_

📋 *Comandos disponibles:*
  */resumen* — gastos del mes actual
  */semana* — gastos de los últimos 7 días
  */categorias* — totales por categoría (histórico)
  */ayuda* — muestra este mensaje`
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    comida: '🍔', supermercado: '🛒', transporte: '🚗',
    salud: '💊', entretenimiento: '🎬', ropa: '👕',
    servicios: '💡', educación: '📚', otros: '📦',
  }
  return map[cat] ?? '💰'
}
