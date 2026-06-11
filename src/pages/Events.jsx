import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { Reveal } from '../components/ui/Primitives'
import { formatINR, formatINRShort, formatDate } from '../lib/format'

/**
 * Fundraising events — accident relief, orphanage drives, medical
 * emergencies. Each card shows the amount raised and, when the event
 * has a target, a progress bar. Donate buttons preselect the event.
 */
export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.getEvents().then((e) => { setEvents(e || []); setLoading(false) }).catch(() => setLoading(false)) }, [])
   console.log(events)
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Events</span></div>
            <h1>Fundraising events</h1>
            <p className="lead">Urgent appeals and community drives — every rupee goes to the cause, with an 80G receipt.</p>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          {loading ? <p className="muted">Loading...</p> : events.length === 0 ? (
            <div className="stub"><div className="stub__icon"><Icon.bell width={32} height={32} /></div>
              <h3>No active fundraisers</h3><p className="muted">Check back soon, or support our ongoing causes.</p>
              <Link to="/donate" className="btn btn--primary" style={{ marginTop: 14 }}>Donate to general fund</Link>
            </div>
          ) : (
            <div className="grid grid-3">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 80}>
                  <article className="card card--hover story-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {e.image && <div className="story-card__media"><img src={imgUrl(e.image)} alt={e.title} loading="lazy" /></div>}
                    <div className="story-card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className="badge badge--saffron"><span className="dot" />{e.category}</span>
                        {e.date && <span className="badge"><Icon.clock width={13} height={13} /> {formatDate(e.date)}</span>}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{e.title}</h3>
                      {e.location && <div className="muted" style={{ fontSize: '.85rem', display: 'flex', gap: 6 }}><Icon.pin width={15} height={15} /> {e.location}</div>}
                      {e.description && <p style={{ fontSize: '.9rem', color: 'var(--muted)', margin: 0 }}>{e.description.slice(0, 120)}{e.description.length > 120 ? '…' : ''}</p>}

                      <div style={{ marginTop: 'auto' }}>
                        {e.targetAmount ? (
                          <>
                            <div className="progress"><div className="progress__fill" style={{ width: `${e.percent}%` }} /></div>
                            <div className="progress__row">
                              <span><b>{formatINRShort(e.raisedAmount)}</b> of {formatINRShort(e.targetAmount)}</span>
                              <span><b>{e.percent}%</b></span>
                            </div>
                          </>
                        ) : (
                          <div className="muted" style={{ fontSize: '.88rem' }}><b style={{ color: 'var(--ink)' }}>{formatINR(e.raisedAmount)}</b> raised so far</div>
                        )}
                        <Link to={`/donate?eventId=${e.id}`} className="btn btn--primary btn--block btn--sm" style={{ marginTop: 10 }}>
                          <Icon.heart width={15} height={15} /> Donate to this fundraiser
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}