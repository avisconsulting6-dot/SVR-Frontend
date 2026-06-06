import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { Icon } from '../../components/ui/Icons.jsx'
import { Modal } from './cms.jsx'
import { formatINR, formatDate } from '../../lib/format.js'

const STATUS_BADGE = { pending: 'badge--saffron', active: 'badge--green', rejected: 'badge--red', inactive: '' }

export default function AdminVolunteers() {
  const [data, setData] = useState({ volunteers: [], page: 1, totalPages: 1, total: 0 })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(null)        // volunteer id for detail drawer
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('status', filter)
    if (search.trim()) params.set('search', search.trim())
    params.set('page', page)
    api.admin.volunteers(`?${params}`).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [filter, page])
  console.log(data)

  return (
    <>
      <div className="admin__head">
        <div><h1>Volunteers</h1><p className="muted" style={{ fontSize: '.9rem' }}>{data.total} total</p></div>
        <button className="btn btn--ghost btn--sm" onClick={() => api.admin.downloadVolunteersCsv().catch((e) => alert(e.message))}>
          <Icon.doc width={15} height={15} /> Download CSV
        </button>
      </div>

      <div className="admin__toolbar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div className="pill-row">
          {['all', 'pending', 'active', 'rejected', 'inactive'].map((s) => (
            <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => { setFilter(s); setPage(1) }}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <input className="input" placeholder="Search name / email / VOL-…" value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setPage(1), load())} />
          <button className="btn btn--ghost btn--sm" onClick={() => { setPage(1); load() }}>Search</button>
        </div>
      </div>

      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Volunteer</th><th>Application</th><th>Referred ₹</th><th>Commission</th><th>Availability</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : data.volunteers.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No volunteers in this view.</td></tr>
                : data.volunteers.map((v) => (
                  <tr key={v.id}>
                    <td><b>{v.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{v.email}</div></td>
                    <td><span className="badge">{v.applicationId}</span><div className="muted" style={{ fontSize: '.74rem', marginTop: 2 }}>{formatDate(v.createdAt)}</div></td>
                    <td><b>{formatINR(v.target.donationsReferred || 0)}</b><div className="muted" style={{ fontSize: '.74rem' }}>target ₹5,000</div></td>
                    <td>{formatINR(v.commissionEarned || 0)}</td>
                    <td><span className={`badge ${v.availability === 'available' ? 'badge--green' : ''}`}>{v.availability}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[v.status]}`}>{v.status}</span></td>
                    <td><button className="btn btn--ghost btn--sm" onClick={() => setOpen(v.id)}>Details</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn--ghost btn--sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="muted" style={{ alignSelf: 'center', fontSize: '.86rem' }}>Page {data.page} of {data.totalPages}</span>
          <button className="btn btn--ghost btn--sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}

      {open && <VolunteerDetail id={open} onClose={() => setOpen(null)} onChanged={load} />}
    </>
  )
}

function VolunteerDetail({ id, onClose, onChanged }) {
  const [d, setD] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { api.admin.volunteerDetail(id).then(setD).catch(() => {}) }, [id])

  async function setStatus(status) {
    if (!confirm(`Set status to "${status}"?`)) return
    setBusy(true)
    try { await api.admin.setVolunteerStatus(id, status); onChanged(); onClose() }
    catch (e) { alert(e.message); setBusy(false) }
  }

  if (!d) return <Modal title="Loading…" onClose={onClose}><p className="muted">Fetching volunteer…</p></Modal>
  const v = d.volunteer

  return (
    <Modal title={`${v.name} — ${v.applicationId}`} onClose={onClose}
      footer={<>
        {v.status !== 'active' && <button className="btn btn--primary" disabled={busy} onClick={() => setStatus('active')}>Approve / activate</button>}
        {v.status !== 'available' && <button className="btn btn--ghost" disabled={busy} onClick={() => setStatus('inactive')}>Deactivate</button>}
        {v.status === 'pending' && <button className="btn btn--ghost" disabled={busy} onClick={() => setStatus('rejected')}>Reject now</button>}
      </>}>
      <div className="grid grid-2" style={{ gap: 10, marginBottom: 14 }}>
        <Info l="Email" v={v.email} /><Info l="Phone" v={v.phone || '—'} />
        <Info l="Status" v={<span className={`badge ${STATUS_BADGE[v.status]}`}>{v.status}</span>} />
        <Info l="Availability" v={v.availability} />
        <Info l="Referred by" v={v.referredBy || 'SVR-COMPANY'} />
        <Info l="Joined" v={formatDate(v.target.startedAt)} />
        <Info l="Donations referred" v={<b>{formatINR(v.target.donationsReferred || 0)}</b>} />
        <Info l="Commission earned" v={<b>{formatINR(v.commissionEarned || 0)}</b>} />
      </div>

      <h4 style={{ margin: '14px 0 8px' }}>Referred donations ({d.referredDonations?.length || 0})</h4>
      {!d.referredDonations?.length ? <p className="muted" style={{ fontSize: '.86rem' }}>None yet.</p> : (
        <table className="dtable">
          <thead><tr><th>Donor</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {d.referredDonations.map((r) => (
              <tr key={r.id}><td>{r.donorName}</td><td><b>{formatINR(r.amount)}</b></td><td className="muted">{formatDate(r.createdAt)}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      {d.history?.length > 1 && (
        <>
          <h4 style={{ margin: '16px 0 8px' }}>Application history</h4>
          {d.history.map((h) => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.86rem', padding: '4px 0' }}>
              <span>{h.applicationId}</span>
              <span className={`badge ${STATUS_BADGE[h.status]}`}>{h.status}</span>
              <span className="muted">{formatDate(h.createdAt)}</span>
            </div>
          ))}
        </>
      )}
    </Modal>
  )
}

function Info({ l, v }) {
  return <div><div className="muted" style={{ fontSize: '.76rem' }}>{l}</div><div style={{ fontSize: '.92rem' }}>{v}</div></div>
}