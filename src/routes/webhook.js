import express from "express";
import { parseExpense } from "../services/aiParser.js";
import { saveToSheets } from "../services/sheets.js";
import { sendWhatsAppMessage } from "../services/whatsapp.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const message = req.body.Body;
    const from = req.body.From;

    if (!message) {
      return res.sendStatus(200);
    }

    const data = await parseExpense(message);

    if (!data.monto) {
      await sendWhatsAppMessage(from, "❌ No entendí el gasto. Intenta de nuevo.");
      return res.sendStatus(200);
    }

    await saveToSheets(data);

    const response = `✅ Gasto registrado: ${data.categoria} - $${data.monto} el ${data.fecha}`;

    await sendWhatsAppMessage(from, response);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
