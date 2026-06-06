import { Link } from 'react-router-dom'
import { ORG, TEAM, JOURNEY } from '../data/mock'
import { Icon } from '../components/ui/Icons'
import { Reveal, SectionHeading } from '../components/ui/Primitives'

const VALUES = [
  { icon: 'shield', color: 'var(--saffron)', t: 'Vision', d: 'A just India where every child, woman and family has dignity, opportunity and the means to thrive — regardless of where they were born.' },
  { icon: 'heart', color: 'var(--blue)', t: 'Mission', d: 'To deliver high-impact, transparent and locally-led programmes in education, health, livelihoods and environment, accountable to donors and communities alike.' },
  { icon: 'checkCircle', color: 'var(--green)', t: 'Values', d: 'Transparency in every rupee, dignity for every beneficiary, evidence over assumption, and partnership over charity.' },
]

export default function About() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>About Us</span></div>
            <h1>Empowering communities, built on trust</h1>
            <p className="lead">{ORG.fullName} is a non-profit founded in {ORG.founded}, working across India
              in child education, women empowerment, healthcare and social welfare — and publishing every account for anyone to review.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="vmv">
            {VALUES.map((v, i) => {
              const I = Icon[v.icon]
              return (
                <Reveal key={v.t} delay={i * 90}>
                  <div className="vmv-card">
                    <div className="vmv-card__icon" style={{ background: v.color }}><I width={26} height={26} /></div>
                    <h3>{v.t}</h3>
                    <p style={{ marginTop: 10, color: 'var(--muted)' }}>{v.d}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section activities-band">
        <div className="container">
          <div className="founder">
            <Reveal><img src={TEAM[0].image} alt={TEAM[0].name} /></Reveal>
            <Reveal delay={120}>
              <span className="eyebrow">Founder's message</span>
              <h2 style={{ margin: '14px 0 18px' }}>"We don't do charity. We build dignity."</h2>
              <p style={{ color: 'var(--ink-2)' }}>
                When I started SVR Educational Society with thirty children under a tin roof, I made one promise:
                every person who trusts us with a rupee will see exactly where it goes. Sixteen
                years on, that promise is the reason we publish audited accounts, photograph every
                camp, and let donors track campaigns in real time.
              </p>
              <p style={{ color: 'var(--ink-2)', marginTop: 14 }}>
                Impact is not a slogan for us — it is a number we report, a child who finished
                school, a village that no longer walks 4 km for water. Thank you for walking with us.
              </p>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{TEAM[0].name}</div>
                <div className="muted">{TEAM[0].role}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="The people behind SVR Educational Society" title="Our team"
            sub="A lean core team and thousands of volunteers, led by people who have spent their careers in the development sector." />
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 70}>
                <div className="team-card">
                  <img src={m.image} alt={m.name} loading="lazy" />
                  <h4>{m.name}</h4>
                  <div className="muted">{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="section activities-band">
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHeading eyebrow="Our journey" title="From a tin roof to six states" />
          <div className="timeline">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.year} delay={i * 60} className="tl-item">
                <div className="tl-date">{j.year}</div>
                <div className="tl-title">{j.title}</div>
                <p>{j.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & documents */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Compliance &amp; transparency" title="Certifications &amp; registration"
            sub="All statutory registrations are current. Documents available on request and in our annual report." />
          <div className="cert-grid">
            {[
              { b: '80G Certified', s: ORG.reg80G }, { b: '12A Registered', s: ORG.reg12A },
              { b: 'FCRA Approved', s: ORG.fcra }, { b: 'CSR Eligible', s: ORG.csr },
            ].map((c) => (
              <div className="cert" key={c.b}>
                <Icon.shield width={28} height={28} />
                <b>{c.b}</b><span>{c.s}</span>
              </div>
            ))}
          </div>
          <div className="note" style={{ marginTop: 24 }}>
            <Icon.doc width={20} height={20} />
            <span>Download the <b>FY 2025–26 Annual Report</b>, audited financial statements and our 80G/12A/FCRA certificates from the document centre. (Wire these to your asset storage in production.)</span>
          </div>
        </div>
      </section>
    </>
  )
}
