import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  proto,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import path from 'path'
import pino from 'pino'
import { handleMessage } from './messageHandler'

const AUTH_DIR = path.join(__dirname, '../../../auth')
const logger = pino({ level: 'silent' })

let sock: ReturnType<typeof makeWASocket> | null = null

export async function sendMessage(jid: string, text: string) {
  if (!sock) throw new Error('Bot not connected')
  await sock.sendMessage(jid, { text })
}

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger,
    printQRInTerminal: false,
    browser: ['SpendyBot', 'Chrome', '1.0'],
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n📱 Escanea este QR con WhatsApp para conectar el bot:\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado a WhatsApp')
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode
      const shouldReconnect = code !== DisconnectReason.loggedOut
      console.log('Conexión cerrada, reconectando:', shouldReconnect)
      if (shouldReconnect) startBot()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const msg of messages) {
      if (msg.key.fromMe) continue
      if (!msg.key.remoteJid) continue

      const jid = msg.key.remoteJid
      const text = msg.message?.conversation
        ?? msg.message?.extendedTextMessage?.text
        ?? ''

      if (!text.trim()) continue

      const senderName = msg.pushName ?? undefined

      try {
        await handleMessage(jid, senderName, text, sendMessage)
      } catch (err) {
        console.error('Error handling message:', err)
      }
    }
  })
}
