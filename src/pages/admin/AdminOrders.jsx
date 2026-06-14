import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { Icon } from '../../components/ui/Icons.jsx'
import { Modal } from './cms.jsx'
import { formatINR, formatDate } from '../../lib/format.js'

const STATUS = ['placed', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_BADGE = {
  placed: 'badge--blue', processing: 'badge--saffron',
  shipped: 'badge--blue', delivered: 'badge--green', cancelled: 'badge--red',
}
const FILTERS = ['all', ...STATUS]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  const load = () => {
    setLoading(true)
    const q = filter === 'all' ? '' : `?status=${filter}`
    api.admin.orders(q).then((d) => { setOrders(d || []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [filter])

  return (
    <>
      <div className="admin__head">
        <div><h1>Orders</h1><p className="muted" style={{ fontSize: '.9rem' }}>{orders.length} in this view</p></div>
      </div>

      <div className="pill-row" style={{ marginBottom: 14 }}>
        {FILTERS.map((s) => (
          <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Referral</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : orders.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No orders in this view.</td></tr>
                : orders.map((o) => (
                  <tr key={o.id}>
                    <td><b>{o.orderNo}</b><div className="muted" style={{ fontSize: '.74rem' }}>{formatDate(o.createdAt)}</div></td>
                    <td>{o.customerName}<div className="muted" style={{ fontSize: '.78rem' }}>{o.customerEmail}</div></td>
                    <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                    <td><b>{formatINR(o.total)}</b></td>
                    <td>{o.referredBy ? <span className="badge">{o.referredBy}</span> : <span className="muted">—</span>}</td>
                    <td><span className={`badge ${STATUS_BADGE[o.status] || ''}`}>{o.status}</span></td>
                    <td><button className="btn btn--ghost btn--sm" onClick={() => setOpen(o)}>View</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <OrderDetail order={open} onClose={() => setOpen(null)} onChanged={load} />}
    </>
  )
}

function OrderDetail({ order, onClose, onChanged }) {
  const [status, setStatus] = useState(order.status)
  const [busy, setBusy] = useState(false)
  const a = order.address

  async function save() {
    setBusy(true)
    try { await api.admin.updateOrder(order.id, status); onChanged(); onClose() }
    catch (e) { alert(e.message); setBusy(false) }
  }

  return (
    <Modal title={`Order ${order.orderNo}`} onClose={onClose}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Close</button>
        <button className="btn btn--primary" disabled={busy || status === order.status} onClick={save}>{busy ? 'Saving…' : 'Update status'}</button>
      </>}>
      <div className="grid grid-2" style={{ gap: 10, marginBottom: 16 }}>
        <Info l="Customer" v={order.customerName} />
        <Info l="Email" v={order.customerEmail} />
        <Info l="Phone" v={order.customerPhone || '—'} />
        <Info l="Payment" v={<span className="badge badge--green">{order.paymentStatus}</span>} />
        {order.referredBy && <Info l="Referred by" v={<span className="badge">{order.referredBy}</span>} />}
        <Info l="Placed" v={formatDate(order.createdAt)} />
      </div>

      <h4 style={{ margin: '8px 0' }}>Delivery address</h4>
      <p style={{ fontSize: '.9rem', marginBottom: 16 }}>
        {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
        {a.city}, {a.state} — {a.pincode}
      </p>

      <h4 style={{ margin: '8px 0' }}>Items</h4>
      <table className="dtable" style={{ marginBottom: 16 }}>
        <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i}><td>{it.name}</td><td>{it.qty}</td><td>{formatINR(it.price)}</td><td><b>{formatINR(it.price * it.qty)}</b></td></tr>
          ))}
          <tr><td colSpan={3}><b>Total</b></td><td><b>{formatINR(order.total)}</b></td></tr>
        </tbody>
      </table>

      <div className="field">
        <label>Order status</label>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
    </Modal>
  )
}

function Info({ l, v }) {
  return <div><div className="muted" style={{ fontSize: '.76rem' }}>{l}</div><div style={{ fontSize: '.92rem' }}>{v}</div></div>
}