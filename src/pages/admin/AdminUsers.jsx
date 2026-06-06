import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { formatINR, formatDate } from '../../lib/format'

const ROLE_BADGE = { admin: 'badge--red', volunteer: 'badge--green', intern: 'badge--blue', donor: '' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [role, setRole] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (role !== 'all') params.set('role', role)
    if (search.trim()) params.set('search', search.trim())
    api.admin.users(`?${params}`).then((u) => { setUsers(u); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [role])

  return (
    <>
      <div className="admin__head">
        <div><h1>Users &amp; wallets</h1><p className="muted" style={{ fontSize: '.9rem' }}>{users.length} shown</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ minWidth: 220 }} placeholder="Search name / email…" value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
          <button className="btn btn--ghost btn--sm" onClick={load}>Search</button>
        </div>
      </div>

      <div className="pill-row" style={{ marginBottom: 14 }}>
        {['all', 'donor', 'volunteer', 'intern', 'admin'].map((r) => (
          <button key={r} className={`filter-pill ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
            {r[0].toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>User</th><th>Role</th><th>Referral code</th><th>Wallet</th><th>Donated?</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : users.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No users found.</td></tr>
                : users.map((u) => (
                  <tr key={u.id}>
                    <td><b>{u.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{u.email}{u.phone ? ` · ${u.phone}` : ''}</div></td>
                    <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                    <td className="muted">{u.referralCode || '—'}</td>
                    <td><b>{formatINR(u.walletBalance || 0)}</b></td>
                    <td>{u.hasDonated ? <span className="badge badge--green">Yes</span> : <span className="muted">No</span>}</td>
                    <td><span className={`badge ${u.status === 'active' ? 'badge--green' : 'badge--saffron'}`}>{u.status}</span></td>
                    <td className="muted">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}