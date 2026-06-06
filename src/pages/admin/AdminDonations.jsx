import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { formatINR, formatDate } from '../../lib/format'

export default function AdminDonations() {
  const [data, setData] = useState({ donations: [], page: 1, totalPages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ page })
    if (search.trim()) params.set('search', search.trim())
    api.admin.donations(`?${params}`).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [page])

  return (
    <>
      <div className="admin__head">
        <div><h1>Donations</h1><p className="muted" style={{ fontSize: '.9rem' }}>{data.total} recorded</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ minWidth: 240 }} placeholder="Search donor / email / receipt…" value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setPage(1), load())} />
          <button className="btn btn--ghost btn--sm" onClick={() => { setPage(1); load() }}>Search</button>
        </div>
      </div>

      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Donor</th><th>Cause / Event</th><th>Amount</th><th>Via volunteer</th><th>Receipt</th><th>Payment ref</th><th>Date</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : data.donations.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No donations found.</td></tr>
                : data.donations.map((r) => (
                  <tr key={r.id}>
                    <td><b>{r.donorName}</b><div className="muted" style={{ fontSize: '.78rem' }}>{r.donorEmail}</div></td>
                    <td>{r.causeTitle}</td>
                    <td><b>{formatINR(r.amount)}</b></td>
                    <td className="muted">{r.volunteerRef || '—'}</td>
                    <td className="muted">{r.receiptNo}</td>
                    <td className="muted" style={{ fontSize: '.78rem' }}>{r.paymentRef || 'direct'}</td>
                    <td className="muted">{formatDate(r.createdAt)}</td>
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
    </>
  )
}