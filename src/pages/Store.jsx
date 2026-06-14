import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  const [params] = useSearchParams()

  // a volunteer's ?ref= on the shop link is remembered through checkout
  useEffect(() => {
    const r = params.get('ref')
    if (r) sessionStorage.setItem('svr_shop_ref', r)
  }, [params])

  useEffect(() => {
    api.getProducts()
      .then((p) => setProducts(Array.isArray(p) ? p : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const safe = Array.isArray(products) ? products : []
  const cats = ['All', ...new Set(safe.map((p) => p.category).filter(Boolean))]
  const list = useMemo(() => (cat === 'All' ? safe : safe.filter((p) => p.category === cat)), [safe, cat])

  // preserve ref on the cart link
  const ref = params.get('ref') || sessionStorage.getItem('svr_shop_ref') || ''
  const cartLink = ref ? `/cart?ref=${ref}` : '/cart'

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'unset', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="breadcrumb"><Link to="/">Home</Link> / <span>Shop</span></div>
              <h1>Shop for a cause</h1>
              <p className="lead">Handmade by the women and artisans in our livelihood programmes. Every purchase funds the maker and the cause.</p>
            </div>
            <Link to={cartLink} className="btn btn--ghost"><Icon.cart width={18} height={18} /> Cart ({count})</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="muted">Loading products…</p>
          ) : safe.length === 0 ? (
            <div className="stub"><div className="stub__icon"><Icon.cart width={32} height={32} /></div><h3>No products yet</h3><p className="muted">The team will add products from the admin panel.</p></div>
          ) : (
            <>
              <div className="pill-row" style={{ marginBottom: 28 }}>
                {cats.map((c) => <button key={c} className={`filter-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
              </div>
              <div className="product-grid">
                {list.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) * 70}>
                    <article className="card card--hover pcard">
                      <Link to={`/store/${p.slug}`} className="pcard__media" style={{ display: 'block' }}><img src={imgUrl(p.image)} alt={p.name} loading="lazy" /></Link>
                      <div className="pcard__body">
                        {p.category && <span className="badge badge--blue">{p.category}</span>}
                        <Link to={`/store/${p.slug}`} className="pcard__name" style={{ marginTop: 8, display: 'block', color: 'var(--ink)', textDecoration: 'none' }}>{p.name}</Link>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                          <span className="pcard__price">{formatINR(p.price)}</span>
                          <button className="btn btn--primary btn--sm" disabled={p.stock < 1} onClick={() => add(p)}>
                            {p.stock < 1 ? 'Sold out' : <>Add <Icon.cart width={15} height={15} /></>}
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}