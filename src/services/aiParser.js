import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function parseExpense(text) {
  const prompt = `
Extrae los siguientes datos del texto:
- monto
- categoria
- fecha
- descripcion

Devuelve JSON con:
{ monto, categoria, fecha, descripcion }

Texto: "${text}"
Si no hay fecha usa hoy.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  try {
    const content = completion.choices[0].message.content;
    return JSON.parse(content);
  } catch {
    return {};
  }
}
