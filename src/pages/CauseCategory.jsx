import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { Reveal } from '../components/ui/Primitives'
import { formatINRShort } from '../lib/format'

const ICONS = { medical: 'health', education: 'cap', devotional: 'heart', awareness: 'shield', service: 'hands' }
const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s

export default function CauseCategory() {
  const { cat } = useParams()
  const [causes, setCauses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCauses().then((c) => { setCauses(c || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // group flat causes list into categories client-side
  const categories = useMemo(() => {
    const map = new Map()
    for (const c of causes) {
      if (!map.has(c.categoryKey)) map.set(c.categoryKey, { key: c.categoryKey, label: cap(c.category), items: [] })
      map.get(c.categoryKey).items.push(c)
    }
    return [...map.values()]
  }, [causes])

  if (loading) return <div className="section container"><p className="muted">Loading...</p></div>
  const category = categories.find((c) => c.key === cat)
  if (!category) return categories.length ? <Navigate to={`/what-we-do/${categories[0].key}`} replace /> : (
    <div className="section container">
      <div className="stub"><div className="stub__icon"><Icon.heart width={32} height={32} /></div>
        <h3>No causes yet</h3><p className="muted">Causes will appear here once published.</p>
        <Link to="/donate" className="btn btn--primary" style={{ marginTop: 14 }}>Donate to general fund</Link>
      </div>
    </div>
  )
  const I = Icon[ICONS[cat]] || Icon.heart

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>What We Do</span> / <span>{category.label}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <span className="vmv-card__icon" style={{ background: 'var(--saffron)', margin: 0 }}><I width={26} height={26} /></span>
              <h1 style={{ margin: 0 }}>{category.label}</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="pill-row" style={{ marginBottom: 30 }}>
            {categories.map((c) => (
              <Link key={c.key} to={`/what-we-do/${c.key}`} className={`filter-pill ${c.key === cat ? 'active' : ''}`}>{c.label}</Link>
            ))}
          </div>

          <div className="grid grid-3">
            {category.items.map((it, i) => (
              <Reveal key={it.id} delay={(i % 3) * 80}>
                <article className="card card--hover ccard">
                  <Link to={`/what-we-do/${cat}/${it.slug}`} className="ccard__media">
                    <img src={imgUrl(it.image)} alt={it.title} loading="lazy" />
                    <span className="ccard__cat badge badge--saffron"><span className="dot" />{category.label}</span>
                  </Link>
                  <div className="ccard__body">
                    <h3 className="ccard__title">
                      <Link to={`/what-we-do/${cat}/${it.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{it.title}</Link>
                    </h3>
                    <p style={{ fontSize: '.92rem', color: 'var(--muted)' }}>{(it.description || '').slice(0, 110)}{(it.description || '').length > 110 ? '…' : ''}</p>
                    <div style={{ marginTop: 'auto' }}>
                      <div className="progress"><div className="progress__fill" style={{ width: `${it.percent}%` }} /></div>
                      <div className="progress__row"><span><b>{formatINRShort(it.raisedAmount)}</b> raised</span><span>goal {formatINRShort(it.goalAmount)}</span></div>
                    </div>
                    <Link to={`/donate?causeId=${it.id}`} className="btn btn--primary btn--block btn--sm">Donate <Icon.arrowRight width={16} height={16} /></Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}