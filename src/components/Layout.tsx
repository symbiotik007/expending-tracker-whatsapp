import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>💸</span>
          <span>SpendyBot</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={navClass}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/expenses" className={navClass}>
            <span>💳</span> Gastos
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            <span>👥</span> Usuarios
          </NavLink>
        </nav>
        <a href="/" className="sidebar-back">← Ver landing</a>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return `nav-item${isActive ? ' active' : ''}`
}
