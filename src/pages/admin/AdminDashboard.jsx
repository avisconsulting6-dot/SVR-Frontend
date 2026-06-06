import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Icon } from '../../components/ui/Icons'
import { formatINR, formatINRShort, formatNumberIN, formatDate } from '../../lib/format'

const COLORS = ['var(--saffron)', 'var(--blue)', 'var(--green)', '#a855f7', '#0ea5e9', '#64748b']

export default function AdminDashboard() {
  const [d, setD] = useState(null)
  const [err, setErr] = useState('')
  const [busyCsv, setBusyCsv] = useState(null)

  useEffect(() => { api.admin.overview().then(setD).catch((e) => setErr(e.message)) }, [])

  if (err) return <div className="admin__head"><h1>Dashboard</h1><p className="field__err">{err}</p></div>
  if (!d) return <div className="admin__head"><h1>Loading…</h1></div>
  if (!d.totals) return (
    <div className="admin__head">
      <h1>Dashboard</h1>
      <p className="field__err">
        Backend overview endpoint is outdated — apply the new adminContentController.js + adminRoutes.js
        to the backend and restart it.
      </p>
    </div>
  )

  const t = d.totals
  const kpis = [
    { icon: 'rupee', label: 'Total donations', value: formatINRShort(t.donationsAmount), color: 'var(--saffron)', sub: `${t.donationsCount} donations` },
    { icon: 'bell', label: 'Raised via events', value: formatINRShort(t.viaEvents), color: '#0ea5e9' },
    { icon: 'heart', label: 'Active causes', value: t.activeCauses, color: 'var(--blue)' },
    { icon: 'hands', label: 'Volunteers', value: formatNumberIN(t.volunteers), color: 'var(--green)' },
    { icon: 'cap', label: 'Interns', value: t.interns, color: '#a855f7' },
    { icon: 'wallet', label: 'Wallet balances (₹)', value: formatINRShort(t.walletBalance), color: '#64748b' },
  ]
  const split = (d.categorySplit || []).filter((s) => s.value > 0)
  const total = split.reduce((s, x) => s + x.value, 0) || 1

  async function csv(kind) {
    setBusyCsv(kind)
    try {
      if (kind === 'volunteers') await api.admin.downloadVolunteersCsv()
      else await api.admin.downloadInternsCsv()
    } catch (e) { alert(e.message) } finally { setBusyCsv(null) }
  }

  return (
    <>
      <div className="admin__head">
        <div><h1>Dashboard overview</h1><p className="muted" style={{ fontSize: '.9rem' }}>Live figures from the database</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost btn--sm" disabled={busyCsv === 'volunteers'} onClick={() => csv('volunteers')}>
            <Icon.doc width={15} height={15} /> {busyCsv === 'volunteers' ? 'Preparing…' : 'Volunteers CSV'}
          </button>
          <button className="btn btn--ghost btn--sm" disabled={busyCsv === 'interns'} onClick={() => csv('interns')}>
            <Icon.doc width={15} height={15} /> {busyCsv === 'interns' ? 'Preparing…' : 'Interns CSV'}
          </button>
        </div>
      </div>

      <div className="admin__kpis">
        {kpis.map((k) => {
          const I = Icon[k.icon] || Icon.chart
          return (
            <div className="card kpi" key={k.label}>
              <span className="kpi__icon" style={{ background: k.color }}><I width={20} height={20} /></span>
              <div><div className="kpi__value">{k.value}</div><div className="kpi__label">{k.label}</div>{k.sub && <div className="kpi__sub">{k.sub}</div>}</div>
            </div>
          )
        })}
      </div>

      {/* Fundraising events — amounts + target progress */}
      <div className="card admin__panel" style={{ marginTop: 22 }}>
        <div className="admin__panel-head">
          <h4>Fundraising events</h4>
          <Link to="/admin/events" className="btn btn--ghost btn--sm">Manage events <Icon.arrowRight width={13} height={13} /></Link>
        </div>
        {!d.topEvents?.length ? <p className="muted" style={{ padding: '10px 0' }}>No published events yet. Create one under Events.</p> : (
          <div style={{ display: 'grid', gap: 14 }}>
            {d.topEvents.map((e, i) => (
              <div key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <b>{e.title}</b> <span className="badge badge--blue" style={{ marginLeft: 6 }}>{e.category}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {formatINR(e.raisedAmount)}
                    {e.targetAmount && <span className="muted" style={{ fontWeight: 400 }}> / {formatINR(e.targetAmount)} · {e.percent}%</span>}
                    {!e.targetAmount && <span className="muted" style={{ fontWeight: 400 }}> raised (open-ended)</span>}
                  </div>
                </div>
                {e.targetAmount && (
                  <div style={{ height: 8, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
                    <div style={{ width: `${e.percent}%`, height: '100%', background: e.percent >= 100 ? 'var(--green)' : COLORS[i % COLORS.length], borderRadius: 99, transition: 'width .5s' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin__row">
        <div className="card admin__panel">
          <div className="admin__panel-head"><h4>Funds raised by category</h4></div>
          {split.length === 0 ? <p className="muted">No donation data yet.</p> : (
            <div className="barchart">
              {split.map((s, i) => {
                const max = Math.max(...split.map((x) => x.value))
                return (
                  <div className="barchart__col" key={s.label}>
                    <div className="barchart__bar" style={{ height: `${(s.value / max) * 100}%`, background: COLORS[i % COLORS.length] }} title={formatINR(s.value)} />
                    <span className="barchart__lbl">{String(s.label).slice(0, 4)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="card admin__panel">
          <div className="admin__panel-head"><h4>Category share</h4></div>
          <Donut data={split} total={total} />
          <div style={{ marginTop: 16 }}>
            {split.map((c, i) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.86rem', padding: '4px 0' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                <span style={{ flex: 1, color: 'var(--ink-2)' }}>{c.label}</span>
                <b style={{ fontFamily: 'var(--font-display)' }}>{Math.round((c.value / total) * 100)}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card admin__panel" style={{ marginTop: 22 }}>
        <div className="admin__panel-head"><h4>Recent donations</h4></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Donor</th><th>Cause / Event</th><th>Amount</th><th>Via volunteer</th><th>Receipt</th><th>Date</th></tr></thead>
            <tbody>
              {d.recentDonations.length ? d.recentDonations.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.donorName}</b></td>
                  <td>{r.causeTitle}</td>
                  <td>{formatINR(r.amount)}</td>
                  <td className="muted">{r.volunteerRef || '—'}</td>
                  <td className="muted">{r.receiptNo}</td>
                  <td className="muted">{formatDate(r.createdAt)}</td>
                </tr>
              )) : <tr><td colSpan={6} className="muted" style={{ padding: 18 }}>No donations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Donut({ data, total }) {
  let acc = 0
  const R = 54, C = 2 * Math.PI * R
  return (
    <svg viewBox="0 0 140 140" style={{ width: 170, height: 170, margin: '0 auto', display: 'block' }}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth="16" />
      {data.map((d, i) => {
        const frac = d.value / total
        const dash = `${frac * C} ${C}`
        const offset = -acc * C; acc += frac
        return <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="16" strokeDasharray={dash} strokeDashoffset={offset} transform="rotate(-90 70 70)" />
      })}
      <text x="70" y="66" textAnchor="middle" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, fill: 'var(--ink)' }}>{data.length}</text>
      <text x="70" y="84" textAnchor="middle" style={{ fontSize: 9, fill: 'var(--muted)' }}>categories</text>
    </svg>
  )
}