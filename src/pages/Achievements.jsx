import { Link } from 'react-router-dom'
import { AWARDS, RECOGNITION, MEDIA, REPORTS } from '../data/mock'
import { Icon } from '../components/ui/Icons'
import { Reveal, SectionHeading } from '../components/ui/Primitives'

export default function Achievements() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Recognition</span></div>
            <h1>Achievements &amp; recognition</h1>
            <p className="lead">Sixteen years of measurable, audited impact — recognised by government bodies,
              the development sector and the media.</p>
          </div>
        </div>
      </header>

      {/* Awards */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Awards &amp; honours" title="Recognised for impact and transparency" />
          <div className="grid grid-2">
            {AWARDS.map((a, i) => (
              <Reveal key={a.t} delay={(i % 2) * 80}>
                <div className="card card--hover" style={{ padding: 24, display: 'flex', gap: 18, alignItems: 'flex-start', height: '100%' }}>
                  <span className="award-badge"><Icon.award width={26} height={26} /></span>
                  <div>
                    <div className="tl-date">{a.year}</div>
                    <h4 style={{ fontSize: '1.15rem', margin: '4px 0 6px' }}>{a.t}</h4>
                    <p className="muted" style={{ fontSize: '.9rem' }}>{a.by}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Government recognition / certificates */}
      <section className="section activities-band">
        <div className="container">
          <SectionHeading eyebrow="Government recognition &amp; certificates" title="Every registration, in the open"
            sub="All statutory registrations are current and independently verifiable." />
          <div className="cert-grid">
            {RECOGNITION.map((r) => (
              <div className="cert" key={r.t}>
                <Icon.shield width={28} height={28} />
                <b>{r.t}</b><span>{r.id}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact reports */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Impact reports" title="Read the evidence yourself"
            sub="We publish audited accounts and programme impact assessments every year." />
          <div className="grid grid-2">
            {REPORTS.map((r) => (
              <div key={r.t} className="card card--hover" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span className="doc-badge"><Icon.doc width={24} height={24} /></span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.02rem' }}>{r.t}</h4>
                  <span className="muted" style={{ fontSize: '.82rem' }}>{r.type} · {r.size}</span>
                </div>
                <button className="btn btn--ghost btn--sm">Download</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media coverage */}
      <section className="section activities-band">
        <div className="container">
          <SectionHeading eyebrow="In the media" title="Media coverage" />
          <div className="grid grid-2">
            {MEDIA.map((m, i) => (
              <Reveal key={m.t} delay={(i % 2) * 80}>
                <div className="card" style={{ padding: 24, height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="badge badge--blue">{m.src}</span>
                    <span className="muted" style={{ fontSize: '.82rem' }}>{m.date}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink)', fontSize: '1.1rem' }}>{m.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
