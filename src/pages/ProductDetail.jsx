import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { formatINR } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams() // slug
  const nav = useNavigate()
  const { add } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [err, setErr] = useState(false)

  useEffect(() => {
    setErr(false)
    setProduct(null)
    api.getProduct(id).then((p) => {
      setProduct(p)
      api.getProducts().then((all) => setRelated((all || []).filter((x) => x.slug !== id).slice(0, 3)))
    }).catch(() => setErr(true))
  }, [id])

  if (err) return <div className="section container"><h2>Product not found</h2><Link to="/store" className="btn btn--primary" style={{ marginTop: 16 }}>Back to store</Link></div>
  if (!product) return <div className="section container"><p className="muted">Loading…</p></div>

  const img = imgUrl(product.image)

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb" style={{ marginBottom: 18 }}>
          <Link to="/">Home</Link> / <Link to="/store">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="cd-grid">
          <div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <img src={img} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            </div>
          </div>

          <div>
            {product.category && <span className="badge badge--blue">{product.category}</span>}
            <h1 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', margin: '12px 0 8px' }}>{product.name}</h1>
            <div className="cd-amount">{formatINR(product.price)}</div>
            <div className="muted" style={{ fontSize: '.9rem', marginBottom: 18 }}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'} · secure online payment
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}>+</button>
              </div>
              <button className="btn btn--primary btn--lg" style={{ flex: 1 }} disabled={product.stock < 1}
                onClick={() => { add(product, qty); setAdded(true) }}>
                <Icon.cart width={18} height={18} /> {added ? 'Added to cart' : `Add ${qty} to cart`}
              </button>
            </div>
            <button className="btn btn--ghost btn--block" disabled={product.stock < 1}
              onClick={() => { add(product, qty); nav('/cart') }}>Buy now</button>

            <div className="note note--green" style={{ marginTop: 18 }}>
              <Icon.checkCircle width={20} height={20} />
              <span><b>Fair-trade promise.</b> The maker is paid a fair wage; the margin funds our programmes.</span>
            </div>

            {product.description && <div style={{ marginTop: 24 }}><h3 style={{ fontSize: '1.2rem' }}>Description</h3><p style={{ marginTop: 8 }}>{product.description}</p></div>}
            {product.story && <div style={{ marginTop: 20 }}><h3 style={{ fontSize: '1.2rem' }}>The story behind it</h3><p style={{ marginTop: 8, color: 'var(--ink-2)' }}>{product.story}</p></div>}
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 'var(--h3)', marginBottom: 18 }}>You may also like</h2>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {related.map((rp) => (
                <Link key={rp.id} to={`/store/${rp.slug}`} className="card card--hover pcard" style={{ textDecoration: 'none' }}>
                  <div className="pcard__media"><img src={imgUrl(rp.image)} alt={rp.name} loading="lazy" /></div>
                  <div className="pcard__body">
                    <div className="pcard__name">{rp.name}</div>
                    <div className="pcard__price">{formatINR(rp.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}