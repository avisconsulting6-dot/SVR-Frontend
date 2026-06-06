import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { Reveal } from '../components/ui/Primitives'
import { formatINR } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function Store() {
  const [products, setProducts] = useState([])
  const [cat, setCat] = useState('All')
  const [loading, setLoading] = useState(true)
  const { add, count } = useCart()

  useEffect(() => { api.getProducts().then((p) => { setProducts(p); setLoading(false) }).catch(() => setLoading(false)) }, [])
  const cats = ['All', ...new Set(products.map((p) => p.category))]
  const list = useMemo(() => cat === 'All' ? products : products.filter((p) => p.category === cat), [products, cat])

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'unset', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="breadcrumb"><Link to="/">Home</Link> / <span>Shop</span></div>
              <h1>Shop for a cause</h1>
              <p className="lead">Handmade by the women and artisans in our livelihood programmes. Every purchase funds the maker and the cause — and you can pay with reward coins.</p>
            </div>
            <Link to="/cart" className="btn btn--ghost"><Icon.cart width={18} height={18} /> Cart ({count})</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="pill-row" style={{ marginBottom: 28 }}>
            {cats.map((c) => <button key={c} className={`filter-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          {loading ? <p className="muted">Loading products…</p> : (
            <div className="product-grid">
              {list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 70}>
                  <article className="card card--hover pcard">
                    <Link to={`/store/${p.slug}`} className="pcard__media" style={{ display: 'block' }}><img src={imgUrl(p.image)} alt={p.name} loading="lazy" /></Link>
                    <div className="pcard__body">
                      <span className="badge badge--blue">{p.category}</span>
                      <Link to={`/store/${p.slug}`} className="pcard__name" style={{ marginTop: 8, display: 'block', color: 'var(--ink)', textDecoration: 'none' }}>{p.name}</Link>
                      <div className="muted" style={{ fontSize: '.82rem' }}>by {p.maker}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <span className="pcard__price">{formatINR(p.price)}</span>
                        <button className="btn btn--primary btn--sm" onClick={() => add(p)}>Add <Icon.cart width={15} height={15} /></button>
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
