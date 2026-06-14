import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { imgUrl } from '../lib/api'
import { payForOrder } from '../lib/razorpay'
import { Icon } from '../components/ui/Icons'
import { formatINR } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { items, setQty, remove, clear, subtotal, count } = useCart()
  const { user } = useAuth()
  const [params] = useSearchParams()
  const refFromUrl = params.get('ref') || sessionStorage.getItem('svr_shop_ref') || ''

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '' })
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  // persist a referral arriving on the shop link so it survives navigation
  useEffect(() => {
    const r = params.get('ref')
    if (r) sessionStorage.setItem('svr_shop_ref', r)
  }, [params])

  useEffect(() => {
    if (user) setCustomer((c) => ({ ...c, name: c.name || user.name, email: c.email || user.email }))
  }, [user])

  const setC = (k, v) => setCustomer((c) => ({ ...c, [k]: v }))
  const setA = (k, v) => setAddress((a) => ({ ...a, [k]: v }))

  const valid =
    customer.name.trim() &&
    /^\S+@\S+\.\S+$/.test(customer.email) &&
    address.line1.trim() && address.city.trim() && address.state.trim() &&
    /^\d{6}$/.test(address.pincode)

  async function placeOrder() {
    setError(''); setPlacing(true)
    try {
      const placed = await payForOrder({
        items: items.map((i) => ({ productId: i.id, qty: i.qty })),
        customer,
        address,
        ...(refFromUrl ? { ref: refFromUrl } : {}),
      })
      setOrder(placed)
      sessionStorage.removeItem('svr_shop_ref')
      clear()
    } catch (e) {
      setError(e.message)
    } finally {
      setPlacing(false)
    }
  }

  if (order) {
    return (
      <section className="section"><div className="container form-shell">
        <div className="form-card success-screen">
          <div className="tick"><Icon.checkCircle width={48} height={48} /></div>
          <h2>Order confirmed!</h2>
          <p className="muted" style={{ margin: '8px auto 0', maxWidth: '46ch' }}>
            Thank you, {order.customerName.split(' ')[0]}. Your order <b style={{ color: 'var(--ink)' }}>{order.orderNo}</b> is confirmed.
            A confirmation has been emailed to {order.customerEmail}.
          </p>
          <div className="receipt">
            <div className="receipt-row"><span>Items</span><b>{order.items.reduce((n, i) => n + i.qty, 0)}</b></div>
            <div className="receipt-row"><span>Total paid</span><b>{formatINR(order.total)}</b></div>
          </div>
          <div className="hero__cta" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Link to="/store" className="btn btn--primary">Continue shopping</Link>
          </div>
        </div>
      </div></section>
    )
  }

  if (!count) {
    return (
      <section className="section"><div className="container">
        <div className="stub">
          <div className="stub__icon"><Icon.cart width={32} height={32} /></div>
          <h3>Your cart is empty</h3>
          <Link to="/store" className="btn btn--primary">Browse the shop</Link>
        </div>
      </div></section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb" style={{ marginBottom: 14 }}><Link to="/">Home</Link> / <Link to="/store">Shop</Link> / <span>Cart</span></div>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', marginBottom: 24 }}>Your cart</h1>

        <div className="cd-grid">
          <div>
            {items.map((it) => (
              <div key={it.id} className="card cart-row" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                <img src={imgUrl(it.image)} alt={it.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink)' }}>{it.name}</div>
                  <div className="muted" style={{ fontSize: '.85rem' }}>{formatINR(it.price)} each</div>
                </div>
                <div className="qty">
                  <button onClick={() => setQty(it.id, it.qty - 1)}>−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)}>+</button>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, minWidth: 80, textAlign: 'right' }}>{formatINR(it.price * it.qty)}</div>
                <button className="btn btn--ghost btn--sm" onClick={() => remove(it.id)}>Remove</button>
              </div>
            ))}

            <div className="card" style={{ padding: 22, marginTop: 8 }}>
              <h4 style={{ marginBottom: 14 }}>Contact details</h4>
              <div className="row-2">
                <div className="field"><label>Name <span className="req">*</span></label>
                  <input className="input" value={customer.name} onChange={(e) => setC('name', e.target.value)} /></div>
                <div className="field"><label>Email <span className="req">*</span></label>
                  <input className="input" type="email" value={customer.email} onChange={(e) => setC('email', e.target.value)} /></div>
              </div>
              <div className="field"><label>Phone</label>
                <input className="input" value={customer.phone} onChange={(e) => setC('phone', e.target.value)} placeholder="10-digit number" /></div>

              <h4 style={{ margin: '18px 0 14px' }}>Delivery address</h4>
              <div className="field"><label>Address line 1 <span className="req">*</span></label>
                <input className="input" value={address.line1} onChange={(e) => setA('line1', e.target.value)} placeholder="House no., street" /></div>
              <div className="field"><label>Address line 2</label>
                <input className="input" value={address.line2} onChange={(e) => setA('line2', e.target.value)} placeholder="Area, landmark (optional)" /></div>
              <div className="row-2">
                <div className="field"><label>City <span className="req">*</span></label>
                  <input className="input" value={address.city} onChange={(e) => setA('city', e.target.value)} /></div>
                <div className="field"><label>State <span className="req">*</span></label>
                  <input className="input" value={address.state} onChange={(e) => setA('state', e.target.value)} /></div>
              </div>
              <div className="field" style={{ maxWidth: 200 }}><label>Pincode <span className="req">*</span></label>
                <input className="input" value={address.pincode} onChange={(e) => setA('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 digits" />
                {address.pincode && !/^\d{6}$/.test(address.pincode) && <span className="field__err">Enter a valid 6-digit pincode</span>}
              </div>
            </div>
          </div>

          <aside>
            <div className="cd-aside">
              <h4 style={{ marginBottom: 14 }}>Order summary</h4>
              <div className="receipt-row"><span>Subtotal ({count} item{count !== 1 ? 's' : ''})</span><b>{formatINR(subtotal)}</b></div>
              {refFromUrl && (
                <div className="note note--green" style={{ margin: '12px 0', fontSize: '.84rem' }}>
                  <Icon.checkCircle width={16} height={16} /> Supporting volunteer <b>{refFromUrl}</b>
                </div>
              )}
              <hr className="divider" style={{ margin: '10px 0' }} />
              <div className="receipt-row" style={{ fontSize: '1.15rem' }}><span><b>Total</b></span><b style={{ color: 'var(--saffron-700)' }}>{formatINR(subtotal)}</b></div>

              {error && <div className="field__err" style={{ marginTop: 10 }}>{error}</div>}
              <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 16 }}
                disabled={placing || !valid} onClick={placeOrder}>
                {placing ? 'Opening payment…' : <>Pay {formatINR(subtotal)} <Icon.arrowRight width={17} height={17} /></>}
              </button>
              <div className="seal" style={{ justifyContent: 'center', marginTop: 14 }}><Icon.shield width={16} height={16} /> Secure online payment via Razorpay</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}