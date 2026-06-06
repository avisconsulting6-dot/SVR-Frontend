import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { formatINR } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { items, setQty, remove, clear, subtotal, count } = useCart()
  const { user, refresh } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [useCoins, setUseCoins] = useState(0)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' })
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      api.getWallet().then((w) => setWalletBalance(w.balance)).catch(() => {})
      setCustomer((c) => ({ ...c, name: c.name || user.name, email: c.email || user.email }))
    }
  }, [user])

  const maxCoins = Math.min(walletBalance, subtotal)
  const coins = Math.min(useCoins, maxCoins)
  const total = Math.max(0, subtotal - coins)

  async function placeOrder() {
    setError(''); setPlacing(true)
    try {
      const res = await api.checkout({
        items: items.map((i) => ({ productId: i.id, qty: i.qty })),
        customer, coinsUsed: coins,
      })
      setOrder(res.order)
      if (user) await refresh()
      clear()
    } catch (e) { setError(e.message) } finally { setPlacing(false) }
  }

  if (order) {
    return (
      <section className="section"><div className="container form-shell">
        <div className="form-card success-screen">
          <div className="tick"><Icon.checkCircle width={48} height={48} /></div>
          <h2>Order confirmed!</h2>
          <p className="muted" style={{ margin: '8px auto 0', maxWidth: '46ch' }}>
            Thank you, {order.customerName.split(' ')[0]}. Your order <b style={{ color: 'var(--ink)' }}>#{order.id.slice(-8).toUpperCase()}</b> is confirmed.
          </p>
          <div className="receipt">
            <div className="receipt-row"><span>Subtotal</span><b>{formatINR(order.subtotal)}</b></div>
            {order.coinsUsed > 0 && <div className="receipt-row"><span>Coins redeemed</span><b style={{ color: 'var(--green-700)' }}>−{formatINR(order.coinsUsed)}</b></div>}
            <div className="receipt-row"><span>Total paid</span><b>{formatINR(order.total)}</b></div>
          </div>
          <div className="hero__cta" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Link to="/store" className="btn btn--ghost">Continue shopping</Link>
            {user && <Link to="/dashboard/donor" className="btn btn--primary">View dashboard</Link>}
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
              <h4 style={{ marginBottom: 14 }}>Delivery details</h4>
              <div className="row-2">
                <div className="field"><label>Name <span className="req">*</span></label>
                  <input className="input" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></div>
                <div className="field"><label>Email <span className="req">*</span></label>
                  <input className="input" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} /></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Phone</label>
                  <input className="input" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></div>
                <div className="field"><label>Address</label>
                  <input className="input" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} /></div>
              </div>
            </div>
          </div>

          <aside>
            <div className="cd-aside">
              <h4 style={{ marginBottom: 14 }}>Order summary</h4>
              <div className="receipt-row"><span>Subtotal ({count} items)</span><b>{formatINR(subtotal)}</b></div>

              {user ? (
                walletBalance > 0 ? (
                  <div className="note note--green" style={{ margin: '14px 0', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon.wallet width={18} height={18} /><span>Redeem coins (you have <b>{walletBalance}</b>)</span></div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input type="range" min="0" max={maxCoins} value={coins} onChange={(e) => setUseCoins(Number(e.target.value))} style={{ flex: 1 }} />
                      <b style={{ minWidth: 80, textAlign: 'right' }}>−{formatINR(coins)}</b>
                    </div>
                  </div>
                ) : <div className="muted" style={{ fontSize: '.84rem', margin: '10px 0' }}>Earn coins by referring friends — redeem them here next time.</div>
              ) : (
                <div className="note" style={{ margin: '14px 0' }}><Icon.bell width={18} height={18} /><span><Link to="/login">Log in</Link> to pay with reward coins.</span></div>
              )}

              <hr className="divider" style={{ margin: '10px 0' }} />
              <div className="receipt-row" style={{ fontSize: '1.15rem' }}><span><b>Total</b></span><b style={{ color: 'var(--saffron-700)' }}>{formatINR(total)}</b></div>

              {error && <div className="field__err" style={{ marginTop: 10 }}>{error}</div>}
              <button className="btn btn--primary btn--block btn--lg" style={{ marginTop: 16 }}
                disabled={placing || !customer.name || !/^\S+@\S+\.\S+$/.test(customer.email)}
                onClick={placeOrder}>
                {placing ? 'Placing order…' : <>Place order <Icon.arrowRight width={17} height={17} /></>}
              </button>
              <div className="seal" style={{ justifyContent: 'center', marginTop: 14 }}><Icon.shield width={16} height={16} /> Secure checkout</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
