import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import expensesRouter from './routes/expenses'
import usersRouter from './routes/users'
import statsRouter from './routes/stats'
import { startBot } from './bot/whatsapp'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.use('/api/expenses', expensesRouter)
app.use('/api/users', usersRouter)
app.use('/api/stats', statsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`)
})

// Start WhatsApp bot (skip if DISABLE_BOT=true for API-only dev)
if (process.env.DISABLE_BOT !== 'true') {
  startBot().catch(console.error)
}
