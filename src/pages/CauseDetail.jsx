import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { formatINR, formatINRShort } from '../lib/format'

export default function CauseDetail() {
  const { cat, id } = useParams() // id = slug
  const [cause, setCause] = useState(null)
  const [related, setRelated] = useState([])
  const [err, setErr] = useState(false)

  useEffect(() => {
    setErr(false); setCause(null)
    api.getCause(id).then((c) => {
      if (!c) { setErr(true); return }
      setCause(c)
      api.getCauses().then((all) =>
        setRelated((all || []).filter((x) => x.categoryKey === c.categoryKey && x.slug !== id).slice(0, 3)))
    }).catch(() => setErr(true))
  }, [id])

  if (err) return <div className="section container"><h2>Cause not found</h2><Link to={`/what-we-do/${cat}`} className="btn btn--primary" style={{ marginTop: 16 }}>Back</Link></div>
  if (!cause) return <div className="section container"><p className="muted">Loading…</p></div>
  const p = cause.percent
  const remaining = Math.max(0, cause.goalAmount - cause.raisedAmount)

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb" style={{ marginBottom: 18 }}>
          <Link to="/">Home</Link> / <Link to={`/what-we-do/${cause.categoryKey}`}>{cause.category}</Link> / <span>Cause</span>
        </div>

        <div className="cd-grid">
          <div>
            <span className="badge badge--saffron" style={{ marginBottom: 14 }}><span className="dot" />{cause.category}</span>
            <h1 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', marginBottom: 18 }}>{cause.title}</h1>
            {cause.image && <div className="cd-hero"><img src={imgUrl(cause.image)} alt={cause.title} /></div>}

            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 'var(--h3)' }}>About this cause</h2>
              <p style={{ marginTop: 14, whiteSpace: 'pre-line' }}>{cause.description || 'Support this cause to help us reach the goal.'}</p>
              <div className="note note--green" style={{ marginTop: 18 }}>
                <Icon.checkCircle width={20} height={20} />
                <span><b>Verified &amp; transparent.</b> 80G tax receipt issued for every donation.</span>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 'var(--h3)' }}>How your support helps</h2>
              <ul style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Goes directly toward the stated need', 'Verified by SVR field volunteers', 'Regular updates shared with donors', 'Eligible for 80G tax exemption'].map((x) => (
                  <li key={x} style={{ display: 'flex', gap: 10, color: 'var(--ink-2)' }}>
                    <Icon.checkCircle width={20} height={20} style={{ color: 'var(--green)', flexShrink: 0 }} /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside>
            <div className="cd-aside">
              <div className="cd-amount">{formatINR(cause.raisedAmount)}</div>
              <div className="muted" style={{ fontSize: '.9rem' }}>raised of {formatINR(cause.goalAmount)} goal</div>
              <div style={{ margin: '16px 0' }}>
                <div className="progress"><div className="progress__fill" style={{ width: `${p}%` }} /></div>
                <div className="progress__row"><span><b>{p}% funded</b></span><span>{formatINRShort(remaining)} to go</span></div>
              </div>
              <Link to={`/donate?causeId=${cause.id}`} className="btn btn--primary btn--block btn--lg"><Icon.heart width={18} height={18} /> Donate to this cause</Link>
              <Link to="/volunteer" className="btn btn--ghost btn--block" style={{ marginTop: 10 }}><Icon.hands width={17} height={17} /> Volunteer instead</Link>
              <div className="seal" style={{ justifyContent: 'center', marginTop: 16 }}><Icon.shield width={16} height={16} /> 80G receipt issued instantly</div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 'var(--h3)', marginBottom: 18 }}>More in {cause.category}</h2>
            <div className="grid grid-3">
              {related.map((r) => (
                <Link key={r.id} to={`/what-we-do/${r.categoryKey}/${r.slug}`} className="card card--hover ccard" style={{ textDecoration: 'none' }}>
                  <div className="ccard__media"><img src={imgUrl(r.image)} alt={r.title} loading="lazy" /></div>
                  <div className="ccard__body">
                    <h3 className="ccard__title" style={{ fontSize: '1.05rem' }}>{r.title}</h3>
                    <div className="progress" style={{ marginTop: 'auto' }}><div className="progress__fill" style={{ width: `${r.percent}%` }} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}