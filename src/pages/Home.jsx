import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { ORG, STORIES, ACTIVITIES, TESTIMONIALS, PARTNERS, IMPACT, BANNER_SLIDES, FAQS, ABOUT_INTRO, TRUST_NOTICE } from '../data/mock'
import { Icon } from '../components/ui/Icons'
import { Reveal, SectionHeading, Counter } from '../components/ui/Primitives'
import BannerCarousel from '../components/layout/BannerCarousel'
import { formatINRShort, formatNumberIN } from '../lib/format'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [stats, setStats] = useState(null)        // live figures from /api/stats
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  useEffect(() => {
    api.getCauses()
      .then((causes) => setFeatured((causes || []).slice(0, 3)))
      .catch(() => setFeatured([]))
    api.getStats().then(setStats).catch(() => {})
  }, [])

  const data = { stories: STORIES, activities: ACTIVITIES, testimonials: TESTIMONIALS, partners: PARTNERS, impact: IMPACT }

  function subscribe(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    setSubbed(true)
  }

  return (
    <>
      {/* ===== SCROLLING BANNER ===== */}
      <BannerCarousel slides={BANNER_SLIDES} />

      {/* ===== TRUST NOTICE ===== */}
      <div className="notice-strip">
        <div className="container">
          <Icon.shield width={18} height={18} />
          <p>{TRUST_NOTICE}</p>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">Registered non-profit · since {ORG.founded}</span>
            <h1>
              Will you be the reason<br />a <span className="hl">child smiles today</span>?
            </h1>
            <p className="lead">
              SVR Society empowers communities across India through child education, women
              empowerment, healthcare and social welfare. Your small help can bring big
              happiness — and you can track exactly where your contribution goes.
            </p>
            <div className="hero__cta">
              <Link to="/donate" className="btn btn--primary btn--lg"><Icon.heart width={19} height={19} /> Donate Now</Link>
              <Link to="/volunteer" className="btn btn--ghost btn--lg"><Icon.hands width={19} height={19} /> Become Volunteer</Link>
              <Link to="/internship" className="btn btn--ghost btn--lg"><Icon.cap width={19} height={19} /> Start Internship</Link>
            </div>
            <div className="hero__seals">
              <span className="seal"><Icon.checkCircle width={18} height={18} /> 80G tax benefit</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> FCRA approved</span>
              <span className="seal"><Icon.checkCircle width={18} height={18} /> Audited &amp; transparent</span>
            </div>
          </div>

          <div className="hero__media">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=75"
              alt="Children at a SVR Educational Society learning centre" />
            {/* live figures from the database; renders once stats arrive */}
            {stats && stats.raisedThisYear > 0 && (
              <div className="hero__card hero__card--top">
                <span className="badge badge--green"><span className="dot" /> Live</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>
                    {formatINRShort(stats.raisedThisYear)} raised
                  </div>
                  <div className="muted" style={{ fontSize: '.82rem' }}>
                    this year across {stats.activeCampaigns} active campaign{stats.activeCampaigns !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
            {stats && stats.volunteers > 0 && (
              <div className="hero__card hero__card--bottom">
                <Icon.users width={26} height={26} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--ink)' }}>
                    {formatNumberIN(stats.volunteers)}+
                  </div>
                  <div className="muted" style={{ fontSize: '.8rem' }}>volunteers &amp; supporters with us</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Icon.shield width={26} height={26} />
              <div>
                <div className="trust-item__v">Registered NGO</div>
                <div className="trust-item__l">80G · 12A · CSR · FCRA</div>
              </div>
            </div>
            <div className="trust-item">
              <Icon.award width={26} height={26} />
              <div><div className="trust-item__v">16+ Years</div><div className="trust-item__l">of continuous service</div></div>
            </div>
            <div className="trust-item">
              <Icon.rupee width={26} height={26} />
              <div>
                <div className="trust-item__v">{stats ? formatINRShort(stats.totalRaised) : '—'}</div>
                <div className="trust-item__l">raised via {stats ? formatNumberIN(stats.donationsCount) : '—'} donations</div>
              </div>
            </div>
            <div className="trust-item">
              <Icon.hands width={26} height={26} />
              <div>
                <div className="trust-item__v">{stats ? `${formatNumberIN(stats.volunteers)}+` : '—'}</div>
                <div className="trust-item__l">active volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section className="section">
        <div className="container">
          <div className="whoweare">
            <div>
              <span className="eyebrow">{ABOUT_INTRO.eyebrow}</span>
              <h2 style={{ marginTop: 12 }}>{ABOUT_INTRO.title}</h2>
              {ABOUT_INTRO.body.map((p, i) => (
                <p key={i} style={{ marginTop: 14, color: 'var(--ink-2)' }}>{p}</p>
              ))}
              <Link to="/about" className="btn btn--ghost" style={{ marginTop: 20 }}>
                Learn more about us <Icon.arrowRight width={16} height={16} />
              </Link>
            </div>
            <div className="whoweare__media">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=75" alt="SVR Society at work" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED CAMPAIGNS ===== */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Active right now"
            title="Featured campaigns"
            sub="Hand-picked, field-verified causes. Every campaign shows real-time funding and a public utilisation report."
            action={<Link to="/what-we-do/medical" className="btn btn--outline-blue">View all causes <Icon.arrowRight width={16} height={16} /></Link>}
          />
          <div className="grid grid-3">
            {featured.map((c, i) => (
              <Reveal key={c.id} delay={i * 90}>
                <article className="card card--hover ccard">
                  <Link to={`/what-we-do/${c.categoryKey}/${c.slug}`} className="ccard__media">
                    <img src={imgUrl(c.image)} alt={c.title} loading="lazy" />
                    <span className="ccard__cat badge badge--saffron"><span className="dot" />{c.category}</span>
                  </Link>
                  <div className="ccard__body">
                    <h3 className="ccard__title">
                      <Link to={`/what-we-do/${c.categoryKey}/${c.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.title}</Link>
                    </h3>
                    <div style={{ marginTop: 'auto' }}>
                      <div className="progress"><div className="progress__fill" style={{ width: `${c.percent}%` }} /></div>
                      <div className="progress__row"><span><b>{formatINRShort(c.raisedAmount)}</b> raised</span><span>goal {formatINRShort(c.goalAmount)}</span></div>
                    </div>
                    <Link to={`/donate?causeId=${c.id}`} className="btn btn--primary btn--block btn--sm">Donate <Icon.arrowRight width={16} height={16} /></Link>
                  </div>
                </article>
              </Reveal>
            ))}
            {!featured.length && <SkeletonCards />}
          </div>
        </div>
      </section>

      {/* ===== OUR IMPACT ===== */}
      <section className="section impact-band">
        <div className="container">
          <div className="center" style={{ marginBottom: 44 }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Measurable outcomes</span>
            <h2 style={{ color: '#fff', marginTop: 12 }}>Our impact, in numbers</h2>
            <p className="lead" style={{ color: 'rgba(255,255,255,.8)', margin: '14px auto 0' }}>
              Independently audited and published every year. Numbers updated to FY 2025–26.
            </p>
          </div>
          <div className="impact-grid">
            {(data?.impact || []).map((s) => (
              <div className="impact-cell" key={s.label}>
                <Counter value={s.value} suffix={s.suffix} />
                <div className="stat__label" style={{ color: 'rgba(255,255,255,.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUCCESS STORIES ===== */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Real people, real change" title="Success stories"
            sub="Behind every statistic is a name, a family and a future rewritten." />
          <div className="grid grid-3">
            {(data?.stories || []).map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
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
        </div>
      </section>

      {/* ===== RECENT ACTIVITIES ===== */}
      <section className="section section--tight activities-band">
        <div className="container activities-inner">
          <div>
            <span className="eyebrow">From the field</span>
            <h2 style={{ marginTop: 12 }}>Recent activities</h2>
            <p className="muted" style={{ marginTop: 14 }}>
              We publish field updates as they happen — camps, plantations, openings and
              every quarter's audited accounts.
            </p>
            <Link to="/gallery" className="btn btn--ghost" style={{ marginTop: 20 }}>
              See the gallery <Icon.arrowRight width={16} height={16} />
            </Link>
          </div>
          <div className="timeline">
            {(data?.activities || []).map((a, i) => (
              <Reveal key={i} delay={i * 70} className="tl-item">
                <div className="tl-date">{a.date}</div>
                <div className="tl-title">{a.title}</div>
                <p>{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Voices of trust" title="What our community says"
            sub="Donors, volunteers and beneficiaries — the people who make SVR Educational Society what it is." />
          <div className="grid grid-2">
            {(data?.testimonials || []).map((t, i) => (
              <Reveal key={i} delay={(i % 2) * 90}>
                <figure className="quote">
                  <div className="quote__mark">"</div>
                  <span className="badge badge--blue" style={{ marginBottom: 6 }}>{t.type}</span>
                  <p>{t.text}</p>
                  <figcaption className="quote__who">
                    <img className="avatar" src={t.avatar} alt={t.name} loading="lazy" />
                    <span>
                      <span className="quote__name">{t.name}</span><br />
                      <span className="quote__role">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="center" style={{ marginBottom: 30 }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Backed by</span>
            <h3 style={{ marginTop: 10 }}>Partners &amp; sponsors</h3>
          </div>
          <div className="logo-wall">
            {(data?.partners || []).map((p) => (
              <div className="logo-wall__item" key={p}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section activities-band">
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHeading eyebrow="Questions & answers" title="Donor frequently asked questions"
            sub="Everything you need to know about giving safely and seeing your impact." />
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="section">
        <div className="container">
          <div className="newsletter">
            <div>
              <span className="eyebrow">Stay connected</span>
              <h2 style={{ marginTop: 12, color: '#fff' }}>Get our monthly impact letter</h2>
              <p style={{ color: 'rgba(255,255,255,.82)', marginTop: 12 }}>
                One honest email a month: where funds went, what changed, and how you can help next.
                No spam, ever.
              </p>
            </div>
            <div>
              {subbed ? (
                <div className="note note--green" style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>
                  <Icon.checkCircle width={20} height={20} /> Thank you — you're subscribed. Check your inbox to confirm.
                </div>
              ) : (
                <form className="newsletter__form" onSubmit={subscribe}>
                  <input className="input" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email address" />
                  <button className="btn btn--primary" type="submit">Subscribe <Icon.arrowRight width={16} height={16} /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function SkeletonCards() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="card" style={{ height: 420, opacity: .5 }}>
      <div style={{ height: 200, background: 'var(--paper-2)' }} />
      <div style={{ padding: 18 }}>
        <div style={{ height: 14, width: '60%', background: 'var(--paper-2)', borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 14, width: '90%', background: 'var(--paper-2)', borderRadius: 6 }} />
      </div>
    </div>
  ))
}

function FaqList({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div key={i} className={`faq__item ${open === i ? 'open' : ''}`}>
          <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{f.q}</span>
            <Icon.chevron width={20} height={20} />
          </button>
          {open === i && <div className="faq__a"><p>{f.a}</p></div>}
        </div>
      ))}
    </div>
  )
}