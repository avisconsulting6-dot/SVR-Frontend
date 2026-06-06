import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Icon } from '../../components/ui/Icons'
import { formatINR, formatDate } from '../../lib/format'

export function AdminOrders() {
  const [rows, setRows] = useState([])
  useEffect(() => { api.admin.list('orders').then(setRows).catch(() => {}) }, [])
  async function setStatus(id, status) { await api.admin.patch('orders', id, { status }); setRows((r) => r.map((o) => o.id === id ? { ...o, status } : o)) }
  return (
    <Table title="Orders" subtitle={`${rows.length} orders`} cols={['Order', 'Customer', 'Items', 'Subtotal', 'Coins', 'Total', 'Status', 'Date']}>
      {rows.map((o) => (
        <tr key={o.id}>
          <td><b>#{o.id.slice(-6).toUpperCase()}</b></td>
          <td>{o.customerName}<div className="muted" style={{ fontSize: '.78rem' }}>{o.email}</div></td>
          <td>{o.items?.length || 0}</td>
          <td>{formatINR(o.subtotal)}</td>
          <td>{o.coinsUsed || 0}</td>
          <td><b>{formatINR(o.total)}</b></td>
          <td>
            <select className="select" style={{ padding: '6px 8px', fontSize: '.82rem' }} value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
              {['confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </td>
          <td className="muted">{formatDate(o.createdAt)}</td>
        </tr>
      ))}
    </Table>
  )
}

export function AdminDonations() {
  const [rows, setRows] = useState([])
  useEffect(() => { api.admin.list('donations').then(setRows).catch(() => {}) }, [])
  return (
    <Table title="Donations" subtitle={`${rows.length} donations`} cols={['Receipt', 'Donor', 'Cause', 'Amount', 'Coins', 'Method', 'Date']}>
      {rows.map((d) => (
        <tr key={d.id}>
          <td><b>{d.receiptNo}</b></td>
          <td>{d.anonymous ? 'Anonymous' : d.donorName}<div className="muted" style={{ fontSize: '.78rem' }}>{d.donorEmail}</div></td>
          <td>{d.causeTitle}</td>
          <td><b>{formatINR(d.amount)}</b></td>
          <td>{d.coinsUsed || 0}</td>
          <td><span className="badge">{d.method}</span></td>
          <td className="muted">{formatDate(d.createdAt)}</td>
        </tr>
      ))}
    </Table>
  )
}

export function AdminUsers() {
  const [rows, setRows] = useState([])
  const load = () => api.admin.list('users').then(setRows).catch(() => {})
  useEffect(() => { load() }, [])
  async function credit(u) {
    const amount = Number(prompt(`Add coins to ${u.name}'s wallet (1 coin = ₹1):`, '100'))
    if (!amount || amount <= 0) return
    await api.admin.creditUser(u.id, amount); load()
  }
  return (
    <Table title="Users & Wallets" subtitle={`${rows.length} users`} cols={['Name', 'Role', 'Referral code', 'Coins', 'Referrals', 'Donations', 'Actions']}>
      {rows.map((u) => (
        <tr key={u.id}>
          <td><b>{u.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{u.email}</div></td>
          <td><span className="badge badge--blue">{u.role}</span></td>
          <td style={{ fontFamily: 'var(--font-display)', letterSpacing: '.06em' }}>{u.referralCode}</td>
          <td><b>{u.balance}</b></td>
          <td>{u.referrals}</td>
          <td>{u.donations}</td>
          <td><button className="btn btn--ghost btn--sm" onClick={() => credit(u)}><Icon.wallet width={14} height={14} /> Add coins</button></td>
        </tr>
      ))}
    </Table>
  )
}

export function AdminReferrals() {
  const [rows, setRows] = useState([])
  useEffect(() => { api.admin.list('referrals').then(setRows).catch(() => {}) }, [])
  return (
    <Table title="Referrals" subtitle={`${rows.length} referral links · referrer 10% / referred 5% on first donation`}
      cols={['Referrer', 'Referred', 'Status', 'Referrer coins', 'Referred coins', 'Date']}>
      {rows.map((r) => (
        <tr key={r.id}>
          <td><b>{r.referrer?.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{r.referrer?.email}</div></td>
          <td>{r.referred?.name}<div className="muted" style={{ fontSize: '.78rem' }}>{r.referred?.email}</div></td>
          <td><span className={`badge ${r.status === 'rewarded' ? 'badge--green' : 'badge--blue'}`}>{r.status === 'rewarded' ? 'Rewarded' : 'Pending'}</span></td>
          <td><b>{r.referrerCoins}</b></td>
          <td><b>{r.referredCoins}</b></td>
          <td className="muted">{formatDate(r.createdAt)}</td>
        </tr>
      ))}
    </Table>
  )
}

function Table({ title, subtitle, cols, children }) {
  return (
    <>
      <div className="admin__head"><div><h1>{title}</h1><p className="muted" style={{ fontSize: '.9rem' }}>{subtitle}</p></div></div>
      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
