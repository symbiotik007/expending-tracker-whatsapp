import { Link } from 'react-router-dom'
import '../App.css'

export default function Landing() {
  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-logo">
          <span className="nav-icon">💸</span>
          <span className="nav-brand">SpendyBot</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/admin" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Admin panel
          </Link>
          <a href="#cta" className="nav-cta">Empezar gratis</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="wa-dot"></span>
          Funciona en WhatsApp
        </div>
        <h1>
          Controla tus gastos<br />
          <span className="gradient-text">chateando</span>
        </h1>
        <p className="hero-sub">
          Sin apps. Sin formularios. Solo escríbele a tu bot en WhatsApp
          y él registra, categoriza y resume todos tus gastos al instante.
        </p>
        <div className="hero-actions" id="cta">
          <a
            href="https://wa.me/1234567890?text=Hola!%20quiero%20registrar%20mis%20gastos"
            className="btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon />
            Conectar con WhatsApp
          </a>
          <a href="#how" className="btn-ghost">Ver cómo funciona</a>
        </div>

        <div className="hero-preview">
          <ChatBubble direction="out" time="10:32">
            Gasté $450 en el supermercado 🛒
          </ChatBubble>
          <ChatBubble direction="in" time="10:32">
            ✅ <strong>$450</strong> en <em>Supermercado</em> registrado.<br />
            Llevas <strong>$3,240</strong> este mes.
          </ChatBubble>
          <ChatBubble direction="out" time="10:35">
            resumen de esta semana
          </ChatBubble>
          <ChatBubble direction="in" time="10:35">
            📊 <strong>Esta semana:</strong><br />
            🍔 Comida · $1,200<br />
            🚗 Transporte · $340<br />
            🛒 Super · $890<br />
            ─────────────<br />
            Total: <strong>$2,430</strong>
          </ChatBubble>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Todo lo que necesitas, sin salir de WhatsApp</h2>
        <div className="features-grid">
          <FeatureCard icon="⚡" title="Registro instantáneo">
            Escribe en lenguaje natural. "Gasté 200 en gasolina" y listo.
          </FeatureCard>
          <FeatureCard icon="🏷️" title="Categorías automáticas">
            La IA detecta la categoría sola: comida, transporte, ocio y más.
          </FeatureCard>
          <FeatureCard icon="📊" title="Reportes por chat">
            Pide tu resumen diario, semanal o mensual en cualquier momento.
          </FeatureCard>
          <FeatureCard icon="🔔" title="Alertas de presupuesto">
            Te avisa cuando te acercas al límite que tú mismo defines.
          </FeatureCard>
          <FeatureCard icon="💱" title="Multi-moneda">
            Soporta pesos, dólares y más. Convierte automáticamente.
          </FeatureCard>
          <FeatureCard icon="🔒" title="Privado y seguro">
            Tus datos son tuyos. Cifrado de extremo a extremo.
          </FeatureCard>
        </div>
      </section>

      <section className="how" id="how">
        <h2>Tres pasos para empezar</h2>
        <div className="steps">
          <Step number="01" title="Conecta tu número">
            Escanea el QR o abre el link para agregar al bot a tus contactos.
          </Step>
          <div className="step-arrow">→</div>
          <Step number="02" title="Registra un gasto">
            Escríbele cualquier gasto en lenguaje natural, como a un amigo.
          </Step>
          <div className="step-arrow">→</div>
          <Step number="03" title="Pide tu resumen">
            Escribe "resumen" cuando quieras y recibe un reporte completo.
          </Step>
        </div>
      </section>

      <section className="testimonials">
        <h2>Lo que dicen nuestros usuarios</h2>
        <div className="testimonials-grid">
          <Testimonial name="María G." role="Freelancer" avatar="👩‍💻">
            "Por fin llevo mis finanzas al día sin tener que abrir ninguna app extra."
          </Testimonial>
          <Testimonial name="Carlos R." role="Emprendedor" avatar="👨‍💼">
            "El resumen semanal me cambió la vida. Ahorro 20% más desde que lo uso."
          </Testimonial>
          <Testimonial name="Ana P." role="Estudiante" avatar="👩‍🎓">
            "Súper fácil. Solo le escribo y ya. No necesito aprender nada."
          </Testimonial>
        </div>
      </section>

      <section className="final-cta">
        <h2>Empieza a controlar tus gastos hoy</h2>
        <p>Gratis para siempre en el plan básico. Sin tarjeta de crédito.</p>
        <a
          href="https://wa.me/1234567890?text=Hola!%20quiero%20registrar%20mis%20gastos"
          className="btn-primary btn-large"
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
          Abrir en WhatsApp
        </a>
      </section>

      <footer className="footer">
        <span className="nav-icon">💸</span>
        <span>SpendyBot © 2025 · Hecho con ❤️ para tu bolsillo</span>
      </footer>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function ChatBubble({ direction, time, children }: {
  direction: 'in' | 'out'; time: string; children: React.ReactNode
}) {
  return (
    <div className={`bubble bubble-${direction}`}>
      <div className="bubble-body">{children}</div>
      <span className="bubble-time">{time}</span>
    </div>
  )
}

function FeatureCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}

function Testimonial({ name, role, avatar, children }: {
  name: string; role: string; avatar: string; children: React.ReactNode
}) {
  return (
    <div className="testimonial">
      <p className="testimonial-text">{children}</p>
      <div className="testimonial-author">
        <span className="testimonial-avatar">{avatar}</span>
        <div>
          <strong>{name}</strong>
          <span>{role}</span>
        </div>
      </div>
    </div>
  )
}
