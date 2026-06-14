import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { Icon } from '../../components/ui/Icons.jsx'
import { Modal } from './cms.jsx'
import { formatINR, formatDate } from '../../lib/format.js'

const STATUS_BADGE = { pending: 'badge--saffron', paid: 'badge--green', rejected: 'badge--red' }
const FILTERS = ['all', 'pending', 'paid', 'rejected']

/**
 * Admin → Withdrawals. Volunteers request payouts (wallet debited on request);
 * admin pays manually outside the system, then marks Paid (volunteer emailed) or
 * Rejected (amount refunded to wallet, volunteer emailed).
 */
export default function AdminWithdrawals() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)   // withdrawal object in the action modal

  const load = () => {
    setLoading(true)
    const q = filter === 'all' ? '' : `?status=${filter}`
    api.admin.withdrawals(q).then((d) => { setList(d || []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [filter])

  const pendingCount = list.filter((w) => w.status === 'pending').length

  return (
    <>
      <div className="admin__head">
        <div>
          <h1>Withdrawals</h1>
          <p className="muted" style={{ fontSize: '.9rem' }}>
            {filter === 'pending' ? `${list.length} pending request${list.length !== 1 ? 's' : ''}` : `${list.length} in this view`}
          </p>
        </div>
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
            <thead><tr><th>Volunteer</th><th>Amount</th><th>Method</th><th>Payout details</th><th>Requested</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : list.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No withdrawals in this view.</td></tr>
                : list.map((w) => (
                  <tr key={w.id}>
                    <td><b>{w.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{w.email}</div></td>
                    <td><b>{formatINR(w.amount)}</b></td>
                    <td><span className="badge">{w.method?.toUpperCase()}</span></td>
                    <td style={{ fontSize: '.84rem' }}>
                      {w.method === 'upi'
                        ? <span>{w.upiId}</span>
                        : <span>{w.accountName}<br /><span className="muted">{w.accountNumber} · {w.ifsc}</span></span>}
                    </td>
                    <td className="muted" style={{ fontSize: '.8rem' }}>{formatDate(w.requestedAt)}</td>
                    <td><span className={`badge ${STATUS_BADGE[w.status] || ''}`}>{w.status}</span></td>
                    <td>
                      {w.status === 'pending'
                        ? <button className="btn btn--primary btn--sm" onClick={() => setOpen(w)}>Process</button>
                        : <span className="muted" style={{ fontSize: '.78rem' }}>{w.processedAt ? formatDate(w.processedAt) : ''}</span>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <ProcessModal w={open} onClose={() => setOpen(null)} onDone={() => { setOpen(null); load() }} />}
    </>
  )
}

function ProcessModal({ w, onClose, onDone }) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function act(status) {
    if (status === 'paid' && !confirm(`Confirm you have paid ${formatINR(w.amount)} to this volunteer? They will be emailed that it's credited.`)) return
    if (status === 'rejected' && !confirm(`Reject this request? ${formatINR(w.amount)} will be refunded to the volunteer's wallet.`)) return
    setBusy(true); setErr('')
    try { await api.admin.processWithdrawal(w.id, status, note); onDone() }
    catch (e) { setErr(e.message); setBusy(false) }
  }

  return (
    <Modal title={`Process withdrawal — ${w.name}`} onClose={onClose}>
      <div className="grid grid-2" style={{ gap: 10, marginBottom: 16 }}>
        <Info l="Amount" v={<b>{formatINR(w.amount)}</b>} />
        <Info l="Method" v={w.method?.toUpperCase()} />
        {w.method === 'upi'
          ? <Info l="UPI ID" v={w.upiId} />
          : <>
              <Info l="Account name" v={w.accountName} />
              <Info l="Account no." v={w.accountNumber} />
              <Info l="IFSC" v={w.ifsc} />
            </>}
        <Info l="Requested" v={formatDate(w.requestedAt)} />
      </div>

      <div className="note note--saffron" style={{ marginBottom: 14, fontSize: '.86rem' }}>
        <Icon.wallet width={16} height={16} /> Pay the volunteer manually via the details above, then mark Paid.
        Rejecting refunds the amount to their wallet.
      </div>

      <div className="field">
        <label>Note / payment reference (optional)</label>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. UPI txn ID, or reason if rejecting" />
      </div>

      {err && <div className="field__err" style={{ marginTop: 10 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button className="btn btn--primary" disabled={busy} onClick={() => act('paid')}>{busy ? '…' : 'Mark as Paid'}</button>
        <button className="btn btn--ghost" disabled={busy} onClick={() => act('rejected')}>Reject &amp; refund</button>
      </div>
    </Modal>
  )
}

function Info({ l, v }) {
  return <div><div className="muted" style={{ fontSize: '.76rem' }}>{l}</div><div style={{ fontSize: '.92rem' }}>{v}</div></div>
}