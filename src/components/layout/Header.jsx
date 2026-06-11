import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ORG, WHATWEDO } from '../../data/mock'
import { api } from '../../lib/api'
import { Icon } from '../ui/Icons'
import { useAuth } from '../../context/AuthContext'

/* ---- Navigation model ---- */
const SHOP = [
  { label: 'All Products', to: '/store' },
  { label: 'Spiritual Items', to: '/store' },
  { label: 'Foot Ware', to: '/store' },
  { label: 'SVR Subscriptions', to: '/store' },
]
const CAREER = [
  { label: 'Internship Programme', to: '/internship' },
  { label: 'Volunteer With Us', to: '/volunteer' },
]
const MEDIA = [
  { label: 'Photo Gallery', to: '/gallery' },
  { label: 'Video Gallery', to: '/gallery/video' },
  { label: 'Blog', to: '/blog' },
  { label: 'Events', to: '/events' },
  { label: 'Achievements', to: '/achievements' },
]

const dashboardPath = (user) => (user?.role === 'admin' ? '/admin' : `/dashboard/${user?.role}`)

function SvrLogo() {
  return (
    <Link to="/" className="svr-logo" aria-label="SVR Educational Society — home">
      <img src="/svr-logo.jpeg" alt="SVR Educational Society" className="svr-logo__img" />
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)
  const [mAccordion, setMAccordion] = useState(null)
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const closeTimer = useRef(null)

  useEffect(() => { setOpen(null); setMobile(false); setMAccordion(null) }, [loc.pathname])

  const enter = (key) => { clearTimeout(closeTimer.current); setOpen(key) }
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(null), 120) }

  async function signOut() {
    await logout()
    nav('/')
  }

  return (
    <>
      {/* Utility bar */}
      <div className="utilbar">
        <div className="container">
          <div className="utilbar__reg">
            <span><Icon.shield width={14} height={14} /> <b>80G &amp; 12A</b> tax-exempt</span>
            <span><Icon.mail width={14} height={14} /> {ORG.email}</span>
            <span><Icon.checkCircle width={14} height={14} /> Reg. society · since {ORG.founded}</span>
          </div>
          <div className="utilbar__right">
            <button className="lang-toggle"><Icon.globe width={13} height={13} /> EN / తెలుగు</button>
            {user
              ? <Link to={dashboardPath(user)} title="Open your dashboard"><Icon.person width={13} height={13} /> {user.name}</Link>
              : <Link to="/login">Sign in</Link>}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="header">
        <div className="container header__bar">
          <SvrLogo />

          <nav className="nav nav--main">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>

            <div className="navdd" onMouseEnter={() => enter('wwd')} onMouseLeave={leave}>
              <button className={`navdd__trigger ${open === 'wwd' ? 'open' : ''}`} onClick={() => setOpen(open === 'wwd' ? null : 'wwd')}>
                What We Do? <Icon.chevron width={15} height={15} />
              </button>
              {open === 'wwd' && <MegaMenu />}
            </div>

            <Dropdown label="Shop" items={SHOP} k="shop" open={open} enter={enter} leave={leave} setOpen={setOpen} />
            <Dropdown label="Media" items={MEDIA} k="media" open={open} enter={enter} leave={leave} setOpen={setOpen} />
            <Dropdown label="Career" items={CAREER} k="career" open={open} enter={enter} leave={leave} setOpen={setOpen} />

            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact Us</NavLink>
          </nav>

          {/* ---- auth-aware actions ---- */}
          <div className="header__actions">
            <Link to="/donate" className="btn btn--donate">Donate Now</Link>

            {!user && (
              <Link to="/login" className="btn btn--admin" title="Sign in to your account">
                <Icon.person width={16} height={16} /> Sign in
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin" className="btn btn--admin" title="Open admin console">
                <Icon.shield width={16} height={16} /> Admin
              </Link>
            )}

            {user && user.role !== 'admin' && (
              <Link to={dashboardPath(user)} className="btn btn--admin" title="Open your dashboard">
                <Icon.person width={16} height={16} /> {firstName(user.name)}
              </Link>
            )}

            {user && (
              <button className="btn btn--ghost btn--sm" title="Sign out" aria-label="Sign out" onClick={signOut}>
                <Icon.logout width={16} height={16} />
              </button>
            )}

            <button className="burger" aria-label="Open menu" onClick={() => setMobile(true)}><Icon.menu /></button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mobile-nav ${mobile ? 'open' : ''}`} onClick={() => setMobile(false)}>
        <div className="mobile-nav__panel" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <SvrLogo />
            <button className="mobile-nav__close" onClick={() => setMobile(false)}>×</button>
          </div>

          {/* signed-in chip */}
          {user && (
            <Link to={dashboardPath(user)} className="m-userchip" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', fontWeight: 600 }}>
              <Icon.person width={18} height={18} /> {user.name}
              <span className="badge badge--blue" style={{ marginLeft: 'auto', textTransform: 'capitalize' }}>{user.role}</span>
            </Link>
          )}

          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>

          <MobileAccordion label="What We Do?" id="wwd" active={mAccordion} setActive={setMAccordion}>
            {WHATWEDO.map((c) => (
              <Link key={c.key} to={`/what-we-do/${c.key}`} className="m-group__item">{c.label}</Link>
            ))}
          </MobileAccordion>

          <MobileAccordion label="Shop" id="shop" active={mAccordion} setActive={setMAccordion}>
            {SHOP.map((s) => <Link key={s.label} to={s.to} className="m-group__item">{s.label}</Link>)}
          </MobileAccordion>

          <MobileAccordion label="Media" id="media" active={mAccordion} setActive={setMAccordion}>
            {MEDIA.map((s) => <Link key={s.label} to={s.to} className="m-group__item">{s.label}</Link>)}
          </MobileAccordion>

          <MobileAccordion label="Career" id="career" active={mAccordion} setActive={setMAccordion}>
            {CAREER.map((s) => <Link key={s.label} to={s.to} className="m-group__item">{s.label}</Link>)}
          </MobileAccordion>

          <Link to="/contact">Contact Us</Link>

          <div className="mobile-nav__cta">
            <Link to="/donate" className="btn btn--donate btn--block">Donate Now</Link>
            {!user && <Link to="/login" className="btn btn--admin btn--block"><Icon.person width={16} height={16} /> Sign in</Link>}
            {user && (
              <>
                <Link to={dashboardPath(user)} className="btn btn--admin btn--block">
                  {user.role === 'admin' ? <><Icon.shield width={16} height={16} /> Admin console</> : <><Icon.person width={16} height={16} /> My dashboard</>}
                </Link>
                <button className="btn btn--ghost btn--block" onClick={signOut}><Icon.logout width={16} height={16} /> Sign out</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const firstName = (n) => String(n || '').split(' ')[0]

/* ---- Simple dropdown ---- */
function Dropdown({ label, items, k, open, enter, leave, setOpen }) {
  return (
    <div className="navdd" onMouseEnter={() => enter(k)} onMouseLeave={leave}>
      <button className={`navdd__trigger ${open === k ? 'open' : ''}`} onClick={() => setOpen(open === k ? null : k)}>
        {label} <Icon.chevron width={15} height={15} />
      </button>
      {open === k && (
        <div className="navdd__panel">
          {items.map((it) => <Link key={it.label} to={it.to} className="navdd__item">{it.label}</Link>)}
        </div>
      )}
    </div>
  )
}

/* ---- Mega menu: groups the live flat causes list into categories ---- */
function MegaMenu() {
  const staticCats = WHATWEDO.map((c) => ({ key: c.key, label: c.label, intro: c.intro, items: [] }))
  const [causes, setCauses] = useState(null)   // null = not loaded yet
  const [cat, setCat] = useState(staticCats[0]?.key)

  useEffect(() => {
    api.getCauses().then((list) => setCauses(list || [])).catch(() => setCauses([]))
  }, [])

  const categories = useMemo(() => {
    if (!causes?.length) return staticCats
    const map = new Map()
    for (const c of causes) {
      const key = c.categoryKey
      if (!map.has(key)) {
        const staticMatch = WHATWEDO.find((w) => w.key === key)
        map.set(key, {
          key,
          label: staticMatch?.label || (c.category ? c.category[0].toUpperCase() + c.category.slice(1) : key),
          intro: staticMatch?.intro || '',
          items: [],
        })
      }
      map.get(key).items.push(c)
    }
    return [...map.values()]
  }, [causes])

  useEffect(() => {
    if (categories.length && !categories.find((c) => c.key === cat)) setCat(categories[0].key)
  }, [categories])

  const active = categories.find((c) => c.key === cat) || categories[0]
  const iconFor = (key) => Icon[WHATWEDO.find((w) => w.key === key)?.icon] || Icon.heart

  return (
    <div className="mega">
      <div className="mega__cats">
        {categories.map((c) => {
          const I = iconFor(c.key)
          return (
            <Link key={c.key} to={`/what-we-do/${c.key}`} className={`mega__cat ${cat === c.key ? 'active' : ''}`} onMouseEnter={() => setCat(c.key)}>
              <span className="mega__cat-ic"><I width={18} height={18} /></span>
              <span>{c.label}</span>
              <Icon.chevron width={15} height={15} style={{ marginLeft: 'auto', transform: 'rotate(-90deg)' }} />
            </Link>
          )
        })}
      </div>
      <div className="mega__items">
        <div className="mega__items-head">
          <span className="eyebrow" style={{ margin: 0 }}>{active?.label}</span>
          <Link to={`/what-we-do/${active?.key}`} className="mega__viewall">View all <Icon.arrowRight width={14} height={14} /></Link>
        </div>
        {active?.intro && <p className="mega__intro">{active.intro}</p>}
        <div className="mega__list">
          {(active?.items || []).slice(0, 6).map((it) => (
            <Link key={it.id} to={`/what-we-do/${active.key}/${it.slug}`} className="mega__link">
              <Icon.arrowRight width={15} height={15} /> <span>{it.title}</span>
            </Link>
          ))}
          {(!active?.items || active.items.length === 0) && (
            <Link to={`/what-we-do/${active?.key}`} className="mega__link"><Icon.arrowRight width={15} height={15} /> <span>View all {active?.label} causes</span></Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Mobile accordion ---- */
function MobileAccordion({ label, id, active, setActive, children }) {
  const isOpen = active === id
  return (
    <div className="m-acc">
      <button className={`m-acc__head ${isOpen ? 'open' : ''}`} onClick={() => setActive(isOpen ? null : id)}>
        {label} <Icon.chevron width={16} height={16} />
      </button>
      {isOpen && <div className="m-acc__body">{children}</div>}
    </div>
  )
}