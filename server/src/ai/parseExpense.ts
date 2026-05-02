import Anthropic from '@anthropic-ai/sdk'
import type { ParsedExpense } from '../types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `Eres un asistente que extrae datos de gastos de mensajes en español.
Devuelve SOLO un JSON válido con esta estructura exacta:
{"amount": number, "currency": "ARS"|"USD"|"EUR"|"MXN", "category": string, "description": string}

Categorías válidas: comida, supermercado, transporte, salud, entretenimiento, ropa, servicios, educación, otros.
Si el mensaje NO es un gasto, devuelve: {"error": "not_an_expense"}

Ejemplos:
"Gasté $450 en el supermercado" → {"amount":450,"currency":"ARS","category":"supermercado","description":"compras en supermercado"}
"tomé un taxi, 200 pesos" → {"amount":200,"currency":"ARS","category":"transporte","description":"taxi"}
"hola cómo estás" → {"error":"not_an_expense"}`

export async function parseExpense(message: string): Promise<ParsedExpense | null> {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM,
      messages: [{ role: 'user', content: message }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const json = JSON.parse(text)

    if (json.error) return null

    if (typeof json.amount !== 'number' || !json.category) return null

    return {
      amount: json.amount,
      currency: json.currency ?? 'ARS',
      category: json.category,
      description: json.description ?? message,
    }
  } catch {
    return null
  }
}
