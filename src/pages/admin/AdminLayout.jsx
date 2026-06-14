import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { ORG } from '../../data/mock'
import { Icon } from '../../components/ui/Icons'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { to: '/admin', label: 'Overview', icon: 'chart', end: true },
  { to: '/admin/causes', label: 'Causes', icon: 'heart' },
  { to: '/admin/donations', label: 'Donations', icon: 'rupee' },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/orders', label: 'Orders', icon: 'cart' },
  { to: '/admin/blogs', label: 'Blog', icon: 'doc' },
  { to: '/admin/events', label: 'Events', icon: 'calendar' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'image' },
  { to: '/admin/volunteers', label: 'Volunteers', icon: 'person' },
  { to: '/admin/internships', label: 'Internships', icon: 'cap' },
  { to: '/admin/users', label: 'Users & Wallets', icon: 'wallet' },
  { to: '/admin/referrals', label: 'Referrals', icon: 'users' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: 'withdraw' }
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to={`/dashboard/${user.role}`} replace />

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand">
          <span className="brand__logo brand__logo--footer"><img src="/logo.png" alt="SVR Educational Society logo" /></span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.98rem' }}>{ORG.name}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--muted-2)' }}>Admin Console</div>
          </div>
        </div>
        <nav className="admin__nav">
          {MENU.map((m) => {
            const I = Icon[m.icon]
            return (
              <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => isActive ? 'active' : ''}>
                <I width={19} height={19} /> {m.label}
              </NavLink>
            )
          })}
        </nav>
        <button className="admin__logout" onClick={() => { logout(); nav('/') }}>
          <Icon.logout width={18} height={18} /> Sign out
        </button>
      </aside>
      <div className="admin__main">
        <Outlet />
      </div>
    </div>
  )
}
