import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { VOLUNTEER_BENEFITS, VOLUNTEER_ROLES, STORIES } from '../data/mock'
import { Icon } from '../components/ui/Icons'
import { Reveal, SectionHeading } from '../components/ui/Primitives'
import { formatNumberIN } from '../lib/format'

/* The real volunteer journey — mirrors the backend programme */
const JOURNEY = [
  { step: 1, t: 'Create your account', d: 'One-step signup — you are signed in immediately with your own referral code and dashboard.' },
  { step: 2, t: 'Share your donate link', d: 'Send your personal link to friends, family and your network. Every donation through it counts.' },
  { step: 3, t: 'Raise ₹5,000 in 3 days', d: 'Your activation challenge: reach the target within 72 hours of registering.' },
  { step: 4, t: 'Earn 10% on every donation', d: 'Commission is credited to your wallet instantly on each referred donation — yours to keep either way.' },
  { step: 5, t: 'Become an active volunteer', d: 'Hit the target and you are activated: field roles, tasks from the team, and continued earnings.' },
]

export default function Volunteer() {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.getStats().then(setStats).catch(() => {}) }, [])

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Volunteer</span></div>
            <h1>Give your time. Change a life.</h1>
            <p className="lead">
              {stats?.volunteers ? <><b>{formatNumberIN(stats.volunteers)}+ volunteers</b> power our work — </> : 'Our volunteers power our work — '}
              teaching children, running health camps, raising funds and telling stories that move people to give.
              There's a role for you, and you earn while you help.
            </p>
            <div className="hero__cta" style={{ marginTop: 22 }}>
              <Link to="/volunteer/register" className="btn btn--primary btn--lg"><Icon.person width={19} height={19} /> Become a Volunteer</Link>
              <a href="#how" className="btn btn--ghost btn--lg">How it works</a>
            </div>
            <div className="hero__seals" style={{ marginTop: 22 }}>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> Instant account &amp; dashboard</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> 10% commission per referred donation</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> Wallet credited instantly</span>
            </div>
          </div>
        </div>
      </header>

      {/* Why volunteer */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Why volunteer with SVR Educational Society" title="More than a few good hours"
            sub="You bring skills and time; we bring a transparent, well-run platform where your effort is measured, recognised and genuinely needed." />
          <div className="grid grid-3">
            {VOLUNTEER_BENEFITS.map((b, i) => {
              const I = Icon[b.icon]
              return (
                <Reveal key={b.t} delay={(i % 3) * 80}>
                  <div className="vmv-card" style={{ height: '100%' }}>
                    <div className="vmv-card__icon" style={{ background: 'var(--saffron)' }}><I width={24} height={24} /></div>
                    <h3 style={{ fontSize: '1.25rem' }}>{b.t}</h3>
                    <p style={{ marginTop: 8, color: 'var(--muted)' }}>{b.d}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* The real journey: 3-day target + commission programme */}
      <section className="section activities-band" id="how">
        <div className="container">
          <SectionHeading eyebrow="The volunteer journey" title="From sign-up to active volunteer, in five steps"
            sub="Your activation challenge starts the moment you register — and the earnings start with your very first referred donation." />
          <div className="journey-grid">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.step} delay={i * 70}>
                <div className="journey-card">
                  <span className="journey-card__num">{j.step}</span>
                  <h4>{j.t}</h4>
                  <p className="muted">{j.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="note note--green" style={{ marginTop: 26, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
            <Icon.wallet width={20} height={20} />
            <span><b>Fair by design:</b> even if you don't reach the 3-day target, every rupee of commission you earned
              stays in your wallet — and you can re-apply after 45 days.</span>
          </div>
        </div>
      </section>

      {/* Open roles (static content for active volunteers) */}
      <section className="section" id="roles">
        <div className="container">
          <SectionHeading eyebrow="Open roles" title="Find your fit"
            sub="Once activated, volunteers take on on-ground and remote roles with honest commitment estimates." />
          <div className="grid grid-2">
            {VOLUNTEER_ROLES.map((r, i) => (
              <Reveal key={r.t} delay={(i % 2) * 80}>
                <div className="card card--hover" style={{ padding: 22, display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', height: '100%' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{r.t}</h4>
                    <div className="muted" style={{ fontSize: '.88rem', marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span><Icon.pin width={14} height={14} /> {r.loc}</span>
                      <span><Icon.clock width={14} height={14} /> {r.commit}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className={`badge ${r.type === 'Remote' ? 'badge--blue' : 'badge--green'}`}>{r.type}</span>
                    <div style={{ marginTop: 10 }}><Link to="/volunteer/register" className="btn btn--ghost btn--sm">Apply</Link></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact stories */}
      <section className="section activities-band">
        <div className="container">
          <SectionHeading eyebrow="Impact stories" title="What volunteers make possible" />
          <div className="grid grid-3">
            {STORIES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80}>
                <article className="card card--hover story-card">
                  <div className="story-card__media"><img src={s.image} alt={s.name} loading="lazy" /></div>
                  <div className="story-card__body">
                    <span className="badge badge--saffron">{s.tag}</span>
                    <p>"{s.text}"</p>
                    <div className="story-card__who">— {s.name}, <span className="muted">{s.place}</span></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="center" style={{ marginTop: 40 }}>
            <Link to="/volunteer/register" className="btn btn--primary btn--lg"><Icon.person width={19} height={19} /> Become a Volunteer</Link>
          </div>
        </div>
      </section>
    </>
  )
}