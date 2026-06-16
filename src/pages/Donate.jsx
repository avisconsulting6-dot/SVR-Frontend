import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { payAndDonate, donateDirect } from '../lib/razorpay'
import { Icon } from '../components/ui/Icons'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../lib/format'

const STEPS = ['Choose cause', 'Amount', 'Your details', 'Payment', 'Done']
const PRESETS = [
  { v: 500, note: 'Feeds a child for a week' },
  { v: 1000, note: 'A month of school supplies' },
  { v: 2500, note: 'A health camp screening' },
  { v: 5000, note: 'Books for a classroom' },
]
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/

export default function Donate() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const ref = params.get('ref') || ''          // volunteer referral (?ref=616581 or VOL-...)
  const eventId = params.get('eventId') || ''  // fundraising event preselection
  const urlCauseId = params.get('causeId') || ''

  const [causes, setCauses] = useState([])
  const [event, setEvent] = useState(null)     // the preselected event, for the banner
  const [step, setStep] = useState(0)
  const [causeId, setCauseId] = useState(urlCauseId)   // '' = "Where most needed"
  const [amount, setAmount] = useState(1000)
  const [custom, setCustom] = useState('')
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', pan: '', anon: false, want80G: false })
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { api.getCauses().then((c) => setCauses(c || [])).catch(() => {}) }, [])
  useEffect(() => {
    if (!eventId) return
    api.getEvents().then((evts) => setEvent((evts || []).find((e) => String(e.id) === eventId) || null)).catch(() => {})
  }, [eventId])
  useEffect(() => {
    if (user) setDonor((d) => ({ ...d, name: d.name || user.name, email: d.email || user.email }))
  }, [user])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [step])

  const finalAmount = custom ? Number(custom) : amount
  const causeObj = causes.find((c) => (c.id ?? c._id) === causeId)
  const causeTitle = event ? `Event: ${event.title}` : causeObj ? causeObj.title : 'Where most needed'

  const canNext = () => {
    if (step === 1) return finalAmount > 0
    if (step === 2) {
      const base = donor.name.trim().length >= 2 &&
        /^\S+@\S+\.\S+$/.test(donor.email) &&
        /^[6-9]\d{9}$/.test(donor.phone)
      // PAN only required when the donor wants an 80G receipt
      if (donor.want80G) return base && PAN_RE.test(donor.pan)
      // if they typed a PAN without wanting 80G, it must still be valid (or blank)
      return base && (!donor.pan || PAN_RE.test(donor.pan))
    }
    return true
  }

  async function pay() {
    setProcessing(true); setError('')
    const payload = {
      amount: finalAmount,
      name: donor.name.trim(),
      email: donor.email.trim().toLowerCase(),
      phone: donor.phone.trim(),
      want80G: donor.want80G,
      ...(donor.pan.trim() ? { pan: donor.pan.toUpperCase().trim() } : {}),
      ...(eventId ? { eventId } : causeId ? { causeId } : {}),
      ...(ref ? { ref } : {}),
    }
    try {
      let res
      try {
        res = await payAndDonate(payload)              // Razorpay checkout flow
      } catch (e) {
        // gateway not configured yet (dev) -> record directly so testing works
        if (/not configured/i.test(e.message)) res = await donateDirect(payload)
        else throw e
      }
      setResult(res)
      setStep(4)
    } catch (e) {
      setError(e.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <section className="section">
      <div className="container form-shell">
        <div className="breadcrumb" style={{ marginBottom: 14 }}><Link to="/">Home</Link> / <span>Donate</span></div>
        <h1 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)', marginBottom: 8 }}>Make a donation</h1>
        <p className="muted" style={{ marginBottom: 30 }}>Secure payment via Razorpay · instant 80G tax receipt.</p>

        {event && step < 4 && (
          <div className="note note--green" style={{ marginBottom: 18 }}>
            <Icon.heart width={18} height={18} />
            <span>You're donating to the fundraiser <b>{event.title}</b>{event.targetAmount ? <> — {event.percent}% of {formatINR(event.targetAmount)} reached</> : null}.</span>
          </div>
        )}
        {ref && step < 4 && (
          <div className="note note--green" style={{ marginBottom: 18 }}>
            <Icon.users width={18} height={18} />
            <span>You're donating through a volunteer's referral (<b>{ref}</b>). Your gift supports their campaign too.</span>
          </div>
        )}

        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
              <span className="step__num">{i < step ? <Icon.check width={16} height={16} /> : i + 1}</span>
              <span className="step__label">{s}</span>
              {i < STEPS.length - 1 && <span className="step__line" />}
            </div>
          ))}
        </div>

        <div className="form-card">
          {step === 0 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Where should your gift go?</h3>
              <p className="muted" style={{ marginBottom: 20 }}>Pick a cause, or choose "Where most needed".</p>
              <div className="grid" style={{ gap: 12, maxHeight: 380, overflowY: 'auto' }}>
                <label className={`amount-chip ${!causeId ? 'sel' : ''}`} style={{ textAlign: 'left', cursor: 'pointer' }}>
                  <input type="radio" name="cause" hidden checked={!causeId} onChange={() => setCauseId('')} />
                  Where most needed <small>Our team allocates to the highest-priority cause</small>
                </label>
                {causes.map((c) => {
                  const cid = c.id ?? c._id
                  return (
                    <label key={cid} className={`amount-chip ${causeId === cid ? 'sel' : ''}`} style={{ textAlign: 'left', cursor: 'pointer' }}>
                      <input type="radio" name="cause" hidden checked={causeId === cid} onChange={() => setCauseId(cid)} />
                      {c.title} <small>{c.category}</small>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Choose an amount</h3>
              <p className="muted" style={{ marginBottom: 20 }}>You'll receive an 80G tax-exemption certificate by email.</p>
              <div className="amount-grid">
                {PRESETS.map((p) => (
                  <button key={p.v} className={`amount-chip ${!custom && amount === p.v ? 'sel' : ''}`} onClick={() => { setAmount(p.v); setCustom('') }}>
                    {formatINR(p.v)}<small>{p.note}</small>
                  </button>
                ))}
              </div>
              <div className="field" style={{ marginTop: 16 }}>
                <label>Or enter a custom amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: 12, color: 'var(--muted)' }}>₹</span>
                  <input className="input" style={{ paddingLeft: 28 }} type="number" min="1" placeholder="Custom amount" value={custom} onChange={(e) => setCustom(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Your details</h3>
              <p className="muted" style={{ marginBottom: 20 }}>Your details for the donation. PAN is only needed if you want an 80G tax receipt.</p>
              <div className="field"><label>Full name <span className="req">*</span></label>
                <input className="input" value={donor.name} onChange={(e) => setDonor({ ...donor, name: e.target.value })} placeholder="As per PAN" /></div>
              <div className="row-2">
                <div className="field"><label>Email <span className="req">*</span></label>
                  <input className="input" type="email" value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} placeholder="you@example.com" /></div>
                <div className="field"><label>Mobile <span className="req">*</span></label>
                  <input className="input" value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} placeholder="10-digit number" />
                  {donor.phone && !/^[6-9]\d{9}$/.test(donor.phone) && <span className="field__err">Enter a valid 10-digit mobile number</span>}</div>
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '.92rem', margin: '4px 0 14px' }}>
                <input type="checkbox" checked={donor.want80G} onChange={(e) => setDonor({ ...donor, want80G: e.target.checked })} style={{ marginTop: 3 }} />
                <span>I want an <b>80G tax-exemption receipt</b> (requires your PAN)</span>
              </label>
              {donor.want80G && (
                <div className="field"><label>PAN <span className="req">*</span></label>
                  <input className="input" value={donor.pan} onChange={(e) => setDonor({ ...donor, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} />
                  {donor.pan && !PAN_RE.test(donor.pan) && <span className="field__err">Enter a valid PAN (e.g. ABCDE1234F)</span>}</div>
              )}
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '.92rem' }}>
                <input type="checkbox" checked={donor.anon} onChange={(e) => setDonor({ ...donor, anon: e.target.checked })} /> Donate anonymously (we'll hide your name in public lists)
              </label>
              {!user && <div className="note" style={{ marginTop: 16 }}><Icon.person width={18} height={18} /><span>A donor account will be created for you — check your email after donating to set a password and track receipts.</span></div>}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Confirm &amp; pay</h3>
              <p className="muted" style={{ marginBottom: 20 }}>You'll be taken to Razorpay's secure checkout — UPI, cards, and netbanking supported.</p>
              <div className="receipt" style={{ marginBottom: 20 }}>
                <div className="receipt-row"><span>Cause</span><b>{causeTitle}</b></div>
                <div className="receipt-row"><span>Donor</span><b>{donor.name}</b></div>
                {donor.want80G && donor.pan && <div className="receipt-row"><span>PAN</span><b>{donor.pan}</b></div>}
                <div className="receipt-row"><span>80G receipt</span><b>{donor.want80G ? 'Yes' : 'No'}</b></div>
                {ref && <div className="receipt-row"><span>Referred by</span><b>{ref}</b></div>}
                <div className="receipt-row"><span>Amount</span><b>{formatINR(finalAmount)}</b></div>
              </div>
              {error && <div className="field__err" style={{ marginBottom: 12 }}>{error}</div>}
              <button className="btn btn--primary btn--block btn--lg" disabled={processing} onClick={pay}>
                {processing ? 'Processing…' : `Pay ${formatINR(finalAmount)} securely`} <Icon.arrowRight width={17} height={17} />
              </button>
              <p className="muted" style={{ fontSize: '.8rem', marginTop: 10, textAlign: 'center' }}>
                <Icon.shield width={14} height={14} /> Payments are processed by Razorpay. We never see your card details.
              </p>
            </div>
          )}

          {step === 4 && result && (
            <div className="success-screen">
              <div className="tick"><Icon.checkCircle width={48} height={48} /></div>
              <h2>Thank you, {donor.anon ? 'friend' : donor.name.split(' ')[0]}!</h2>
              <p className="muted" style={{ margin: '8px auto 0', maxWidth: '46ch' }}>
                Your gift of <b style={{ color: 'var(--ink)' }}>{formatINR(result.donation.amount)}</b> is confirmed.
                Your 80G receipt has been sent to {donor.email}.
              </p>
              <div className="receipt">
                <div className="receipt-row"><span>Donation ID</span><b>{String(result.donation.id).slice(-8).toUpperCase()}</b></div>
                <div className="receipt-row"><span>80G Receipt No.</span><b>{result.donation.receiptNo}</b></div>
                <div className="receipt-row"><span>Cause</span><b>{result.donation.cause}</b></div>
                <div className="receipt-row"><span>Amount</span><b>{formatINR(result.donation.amount)}</b></div>
                <div className="receipt-row"><span>Organisation</span><b>SVR Educational Society</b></div>
              </div>
              {!user && (
                <div className="note note--green" style={{ marginTop: 18, textAlign: 'left' }}>
                  <Icon.person width={20} height={20} />
                  <span>We've emailed you a link to <b>create your donor account</b> — set a password to track your donations and download receipts anytime.</span>
                </div>
              )}
              <div className="hero__cta" style={{ justifyContent: 'center', marginTop: 24 }}>
                {user && <Link to="/dashboard/donor" className="btn btn--ghost">View dashboard</Link>}
                <Link to="/" className="btn btn--primary">Back to home</Link>
              </div>
            </div>
          )}

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
              <button className="btn btn--ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
              {step < 3 && <button className="btn btn--primary" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>Continue <Icon.arrowRight width={16} height={16} /></button>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}