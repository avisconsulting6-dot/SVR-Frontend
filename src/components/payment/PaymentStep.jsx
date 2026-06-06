import { useState } from 'react'
import { Icon } from '../ui/Icons'
import { PayLogo, detectCardBrand } from './PayLogos'
import { formatINR } from '../../lib/format'

const METHODS = [
  { k: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more', logos: ['gpay', 'phonepe', 'paytm', 'bhim', 'upi'], tag: 'Most popular' },
  { k: 'card', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay, Amex', logos: ['visa', 'mastercard', 'rupay', 'amex'] },
  { k: 'netbanking', title: 'Net Banking', sub: 'All major Indian banks', logos: ['sbi', 'hdfc', 'icici', 'axis'] },
  { k: 'wallet', title: 'Wallets', sub: 'Amazon Pay, Paytm Wallet', logos: ['amazonpay', 'paytmwallet'] },
]

const UPI_APPS = [
  { k: 'gpay', label: 'Google Pay' },
  { k: 'phonepe', label: 'PhonePe' },
  { k: 'paytm', label: 'Paytm' },
  { k: 'bhim', label: 'BHIM' },
]
const BANKS = [
  { k: 'sbi', label: 'SBI' },
  { k: 'hdfc', label: 'HDFC Bank' },
  { k: 'icici', label: 'ICICI Bank' },
  { k: 'axis', label: 'Axis Bank' },
]
const WALLETS = [
  { k: 'amazonpay', label: 'Amazon Pay' },
  { k: 'paytmwallet', label: 'Paytm Wallet' },
]

const TRUST = [
  { icon: 'lock', label: 'SSL secure payment' },
  { icon: 'doc', label: '80G tax benefit' },
  { icon: 'mail', label: 'Instant e-receipt' },
  { icon: 'shield', label: 'Secure gateway' },
  { icon: 'checkCircle', label: 'Registered NGO' },
  { icon: 'wallet', label: 'Payment protected' },
]

function fmtCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function fmtExpiry(v) {
  const n = v.replace(/\D/g, '').slice(0, 4)
  return n.length > 2 ? n.slice(0, 2) + ' / ' + n.slice(2) : n
}

export default function PaymentStep({ causeTitle, finalAmount, coins, payable, method, setMethod, error, processing, onPay }) {
  const [upiApp, setUpiApp] = useState('gpay')
  const [vpa, setVpa] = useState('')
  const [card, setCard] = useState({ num: '', name: '', exp: '', cvv: '' })
  const [bank, setBank] = useState('sbi')
  const [wallet, setWallet] = useState('amazonpay')
  const brand = detectCardBrand(card.num)
  const fullyCovered = payable === 0

  return (
    <div className="pay">
      <div className="pay__head">
        <h3>Complete your donation</h3>
        <p className="muted">All transactions are encrypted and processed through a secure gateway.</p>
      </div>

      <div className="pay-grid">
        {/* ============ LEFT — payment methods & details ============ */}
        <div className="pay__left">
          {fullyCovered ? (
            <div className="note note--green pay-covered">
              <Icon.wallet width={20} height={20} />
              <span>Your reward coins fully cover this donation — no payment needed. Review the summary and confirm.</span>
            </div>
          ) : (
            <>
              <div className="pay__sectiontitle">Select a payment method</div>
              <div className="pay-methods" role="radiogroup" aria-label="Payment method">
                {METHODS.map((m, i) => (
                  <button
                    key={m.k}
                    type="button"
                    role="radio"
                    aria-checked={method === m.k}
                    className={`pay-method ${method === m.k ? 'sel' : ''}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => setMethod(m.k)}
                  >
                    <span className="pay-method__check" aria-hidden="true"><Icon.check width={13} height={13} /></span>
                    <span className="pay-method__body">
                      <span className="pay-method__title">
                        {m.title}
                        {m.tag && <em className="pay-method__tag">{m.tag}</em>}
                      </span>
                      <span className="pay-method__sub">{m.sub}</span>
                    </span>
                    <span className="pay-method__logos">
                      {m.logos.map((l) => {
                        const L = PayLogo[l]
                        return <span key={l} className="logo-chip"><L /></span>
                      })}
                    </span>
                  </button>
                ))}
              </div>

              {/* ---- per-method detail panel ---- */}
              <div className="pay-detail" key={method}>
                {method === 'upi' && (
                  <>
                    <div className="pay__sectiontitle">Pay with your UPI app</div>
                    <div className="pay-apps">
                      {UPI_APPS.map((a) => {
                        const L = PayLogo[a.k]
                        return (
                          <button key={a.k} type="button" className={`pay-app ${upiApp === a.k ? 'sel' : ''}`} onClick={() => setUpiApp(a.k)} aria-pressed={upiApp === a.k}>
                            <span className="pay-app__logo"><L /></span>
                            <span className="pay-app__label">{a.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="field" style={{ marginTop: 14, marginBottom: 0 }}>
                      <label htmlFor="pay-vpa">Or enter your UPI ID</label>
                      <input id="pay-vpa" className="input" placeholder="yourname@upi" value={vpa} onChange={(e) => setVpa(e.target.value)} inputMode="email" autoComplete="off" />
                      <span className="field__hint">A collect request will be sent to this UPI ID.</span>
                    </div>
                  </>
                )}

                {method === 'card' && (
                  <>
                    <div className="pay__sectiontitle">Card details</div>
                    <div className="field">
                      <label htmlFor="pay-cardnum">Card number</label>
                      <div className="pay-cardnum">
                        <input id="pay-cardnum" className="input" placeholder="1234 5678 9012 3456" value={card.num} onChange={(e) => setCard({ ...card, num: fmtCard(e.target.value) })} inputMode="numeric" autoComplete="cc-number" />
                        <span className={`pay-cardnum__brand ${brand ? 'show' : ''}`} aria-hidden="true">
                          {brand && (() => { const B = PayLogo[brand]; return <B /> })()}
                        </span>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="pay-cardname">Name on card</label>
                      <input id="pay-cardname" className="input" placeholder="As printed on the card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} autoComplete="cc-name" />
                    </div>
                    <div className="row-2">
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label htmlFor="pay-exp">Expiry</label>
                        <input id="pay-exp" className="input" placeholder="MM / YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExpiry(e.target.value) })} inputMode="numeric" autoComplete="cc-exp" />
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label htmlFor="pay-cvv">CVV</label>
                        <input id="pay-cvv" className="input" type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} inputMode="numeric" autoComplete="cc-csc" />
                      </div>
                    </div>
                    <p className="pay-finehint"><Icon.lock width={13} height={13} /> Card details are encrypted — we never store your card information.</p>
                  </>
                )}

                {method === 'netbanking' && (
                  <>
                    <div className="pay__sectiontitle">Choose your bank</div>
                    <div className="pay-apps">
                      {BANKS.map((b) => {
                        const L = PayLogo[b.k]
                        return (
                          <button key={b.k} type="button" className={`pay-app ${bank === b.k ? 'sel' : ''}`} onClick={() => setBank(b.k)} aria-pressed={bank === b.k}>
                            <span className="pay-app__logo"><L /></span>
                            <span className="pay-app__label">{b.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="field" style={{ marginTop: 14, marginBottom: 0 }}>
                      <label htmlFor="pay-bank">Other banks</label>
                      <select id="pay-bank" className="input" defaultValue="">
                        <option value="" disabled>Select another bank…</option>
                        {['Bank of Baroda', 'Canara Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Union Bank of India', 'Yes Bank'].map((b) => <option key={b}>{b}</option>)}
                      </select>
                      <span className="field__hint">You'll be redirected to your bank's secure login.</span>
                    </div>
                  </>
                )}

                {method === 'wallet' && (
                  <>
                    <div className="pay__sectiontitle">Choose a wallet</div>
                    <div className="pay-apps pay-apps--two">
                      {WALLETS.map((w) => {
                        const L = PayLogo[w.k]
                        return (
                          <button key={w.k} type="button" className={`pay-app ${wallet === w.k ? 'sel' : ''}`} onClick={() => setWallet(w.k)} aria-pressed={wallet === w.k}>
                            <span className="pay-app__logo"><L /></span>
                            <span className="pay-app__label">{w.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <span className="field__hint" style={{ display: 'block', marginTop: 10 }}>You'll be redirected to the wallet to authorise the payment.</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* ============ RIGHT — sticky donation summary ============ */}
        <aside className="pay-summary" aria-label="Donation summary">
          <div className="pay-summary__band">
            <Icon.heart width={17} height={17} />
            <span>Donation summary</span>
          </div>
          <div className="pay-summary__body">
            <div className="pay-summary__cause">
              <span className="muted">Donating to</span>
              <b>{causeTitle}</b>
            </div>

            <div className="pay-summary__rows">
              <div className="pay-row"><span>Donation amount</span><b>{formatINR(finalAmount)}</b></div>
              {coins > 0 && <div className="pay-row"><span>Coins redeemed</span><b className="pay-row__green">−{formatINR(coins)}</b></div>}
              <div className="pay-row"><span>Platform fee</span><b className="pay-row__green">₹0 · Free</b></div>
              <div className="pay-row pay-row--total"><span>Total payable</span><b>{formatINR(payable)}</b></div>
            </div>

            <div className="pay-taxnote">
              <Icon.doc width={15} height={15} />
              <span>Eligible for <b>50% tax deduction</b> under Section 80G. Receipt emailed instantly.</span>
            </div>

            {error && <div className="field__err" role="alert" style={{ marginBottom: 12 }}>{error}</div>}

            <button className={`btn-pay ${processing ? 'loading' : ''}`} disabled={processing} onClick={onPay}>
              {processing
                ? <><span className="btn-pay__spin" aria-hidden="true" /> Processing…</>
                : <><Icon.lock width={17} height={17} /> {fullyCovered ? 'Confirm Donation' : `Donate Securely ${formatINR(payable)}`}</>}
            </button>

            <div className="pay-secureline">
              <Icon.shield width={13} height={13} /> 256-bit SSL encrypted · PCI-DSS compliant gateway
            </div>

            <div className="trust-grid">
              {TRUST.map((b) => {
                const I = Icon[b.icon]
                return (
                  <div key={b.label} className="trust-item">
                    <span className="trust-item__icon"><I width={14} height={14} /></span>
                    {b.label}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
