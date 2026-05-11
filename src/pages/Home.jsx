import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Controla tus gastos <br />
          <span className="text-green-500">desde WhatsApp</span>
        </h1>

        <p className="text-neutral-600 text-lg">
          Escribe como siempre. La IA se encarga del resto.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ej: Gasté 25k en comida hoy"
            className="flex-1 outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition">
            Enviar
          </button>
        </div>

        {input && (
          <div className="bg-neutral-900 text-white rounded-2xl p-4 text-sm text-left">
            <p className="opacity-70 mb-2">Resultado:</p>
            <p>✅ Gasto registrado: comida - $25.000 hoy</p>
          </div>
        )}
      </div>
    </div>
  );
}
