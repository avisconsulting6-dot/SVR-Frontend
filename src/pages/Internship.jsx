import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { Reveal, SectionHeading } from '../components/ui/Primitives'

const TRACK_ICON = { tech: 'cap', design: 'image', content: 'doc', 'social-work': 'hands', fundraising: 'rupee', operations: 'grid' }

const TRAINING = [
  { t: 'Week 1', d: 'Orientation, safeguarding & sector primer' },
  { t: 'Early weeks', d: 'Track-specific training & mentor assignment' },
  { t: 'Mid-term', d: 'Live field project with a programme team' },
  { t: 'Final weeks', d: 'Project submission, evaluation & viva' },
  { t: 'Completion', d: 'Certificate, recommendation & alumni onboarding' },
]

const BENEFITS = [
  'Mentor-led training on live programmes',
  'Real field project with measurable impact',
  'Completion certificate with verification ID',
  'Letter of recommendation for top performers',
  'Alumni network & sector job referrals',
]

export default function Internship() {
  const [postings, setPostings] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.internships().then((p) => { setPostings(p || []); setLoading(false) }).catch(() => setLoading(false)) }, [])

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Internship</span></div>
            <h1>The SVR Educational Society Social Impact Internship</h1>
            <p className="lead">A structured, mentor-led internship across our live programmes. Learn by doing real
              development work, earn a recognised certificate, and build a career in the social sector — <b>free to apply</b>.</p>
            <div className="hero__cta" style={{ marginTop: 22 }}>
              <Link to="/internship/register" className="btn btn--primary btn--lg"><Icon.cap width={19} height={19} /> Apply now</Link>
              <a href="#openings" className="btn btn--ghost btn--lg">View open positions</a>
            </div>
            <div className="hero__seals" style={{ marginTop: 22 }}>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> No application fee</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> Remote + field options</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> Recognised certificate</span>
            </div>
          </div>
        </div>
      </header>

      {/* Open positions — live from the backend */}
      <section className="section" id="openings">
        <div className="container">
          <SectionHeading eyebrow="Open positions" title="Current internship openings"
            sub="Applications are reviewed on a rolling basis. Approved interns receive an account-activation email." />
          {loading ? <p className="muted">Loading openings…</p> : postings.length === 0 ? (
            <div className="stub">
              <div className="stub__icon"><Icon.cap width={32} height={32} /></div>
              <h3>No openings right now</h3>
              <p className="muted">New positions are posted regularly — check back soon, or volunteer with us meanwhile.</p>
              <Link to="/volunteer" className="btn btn--primary" style={{ marginTop: 14 }}>Become a volunteer</Link>
            </div>
          ) : (
            <div className="grid grid-2">
              {postings.map((p, i) => {
                const I = Icon[TRACK_ICON[p.track]] || Icon.cap
                return (
                  <Reveal key={p._id} delay={(i % 2) * 80}>
                    <div className="card card--hover" style={{ padding: 26, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="vmv-card__icon" style={{ background: 'var(--blue)', marginBottom: 14 }}><I width={24} height={24} /></div>
                        <span className="badge badge--saffron">{p.duration || 'Flexible'}</span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem' }}>{p.title}</h3>
                      <p style={{ marginTop: 8, color: 'var(--muted)' }}>{p.description || 'Work with our programme teams on real initiatives.'}</p>
                      <div className="tag-strip" style={{ marginTop: 14 }}>
                        <span className="badge">{p.track}</span>
                        <span className="badge"><Icon.pin width={12} height={12} /> {p.location}</span>
                        <span className="badge">{p.openings} opening{p.openings !== 1 ? 's' : ''}</span>
                      </div>
                      <hr className="divider" style={{ margin: '18px 0 14px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span className="muted" style={{ fontSize: '.85rem' }}><Icon.checkCircle width={14} height={14} style={{ color: 'var(--green)' }} /> Free to apply</span>
                        <Link to={`/internship/register?internship=${p._id}`} className="btn btn--primary btn--sm">Apply <Icon.arrowRight width={15} height={15} /></Link>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Training structure + benefits (programme info — static) */}
      <section className="section activities-band">
        <div className="container activities-inner">
          <div>
            <span className="eyebrow">Training structure</span>
            <h2 style={{ marginTop: 12 }}>How the programme runs</h2>
            <p className="muted" style={{ marginTop: 14 }}>A clear, week-by-week structure that balances learning with real, supervised fieldwork.</p>
            <div className="timeline" style={{ marginTop: 22 }}>
              {TRAINING.map((t, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-date">{t.t}</div>
                  <p style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{t.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow">Benefits & certificate</span>
            <h2 style={{ marginTop: 12 }}>What you take away</h2>
            <div className="card" style={{ padding: 26, marginTop: 18 }}>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BENEFITS.map((b) => (
                  <li key={b} style={{ display: 'flex', gap: 12, color: 'var(--ink-2)' }}>
                    <Icon.checkCircle width={20} height={20} style={{ color: 'var(--green)', flexShrink: 0 }} /> {b}
                  </li>
                ))}
              </ul>
              <div className="note" style={{ marginTop: 18 }}>
                <Icon.award width={18} height={18} />
                <span>Certificates carry a unique verification ID, validating completion and the live project undertaken.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container center">
          <h2>Ready to start your impact career?</h2>
          <p className="muted" style={{ margin: '12px auto 22px', maxWidth: '52ch' }}>Applications are reviewed on a rolling basis. Limited seats per cohort.</p>
          <Link to="/internship/register" className="btn btn--primary btn--lg"><Icon.cap width={19} height={19} /> Apply for the internship</Link>
        </div>
      </section>
    </>
  )
}