import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { useAuth } from '../context/AuthContext'

/**
 * Volunteer registration = full account signup. On success the user is
 * signed in automatically and lands on the volunteer dashboard with the
 * 3-day ₹5,000 referral target running.
 */
export default function VolunteerRegister() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [params] = useSearchParams()

  const [f, setF] = useState({
    name: '', email: '', phone: '', city: '',
    password: '', confirm: '',
    referralId: params.get('ref') || '',     // VOL- id or a volunteer's 6-digit code
    consent: false,
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const pwdOk = f.password.length >= 8 && /[A-Za-z]/.test(f.password) && /\d/.test(f.password)
  const valid =
    f.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(f.email) &&
    /^[6-9]\d{9}$/.test(f.phone) &&
    pwdOk && f.password === f.confirm && f.consent

  async function submit(e) {
    e.preventDefault()
    if (!valid) return
    setBusy(true); setError('')
    try {
      await api.register({
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.trim(),
        password: f.password,
        ...(f.referralId.trim() ? { referralId: f.referralId.trim() } : {}),
      })
      // automatic sign-in with the credentials just created
      await login(f.email.trim().toLowerCase(), f.password)
      nav('/dashboard/volunteer', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <section className="section">
      <div className="container form-shell">
        <div className="breadcrumb" style={{ marginBottom: 14 }}><Link to="/">Home</Link> / <Link to="/volunteer">Volunteer</Link> / <span>Register</span></div>
        <h1 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)', marginBottom: 8 }}>Become a volunteer</h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          Create your account in one step — you'll be signed in immediately and your
          3-day activation challenge starts right away.
        </p>

        {f.referralId && (
          <div className="note note--green" style={{ marginBottom: 18 }}>
            <Icon.users width={18} height={18} />
            <span>You were referred by <b>{f.referralId}</b> — you'll be counted in their network.</span>
          </div>
        )}

        <form className="form-card" onSubmit={submit}>
          <h3 style={{ marginBottom: 16 }}>About you</h3>
          <div className="row-2">
            <div className="field"><label>Full name <span className="req">*</span></label>
              <input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div className="field"><label>Email <span className="req">*</span></label>
              <input className="input" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></div>
          </div>
          <div className="row-2">
            <div className="field"><label>Mobile <span className="req">*</span></label>
              <input className="input" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="10-digit number" />
              {f.phone && !/^[6-9]\d{9}$/.test(f.phone) && <span className="field__err">Enter a valid 10-digit mobile number</span>}</div>
            <div className="field"><label>City</label>
              <input className="input" value={f.city} onChange={(e) => set('city', e.target.value)} /></div>
          </div>

          <hr className="divider" style={{ margin: '12px 0 22px' }} />
          <h3 style={{ marginBottom: 16 }}>Account &amp; referral</h3>
          <div className="row-2">
            <div className="field"><label>Password <span className="req">*</span></label>
              <input className="input" type="password" value={f.password} autoComplete="new-password"
                onChange={(e) => set('password', e.target.value)} placeholder="8+ chars, a letter and a number" />
              {f.password && !pwdOk && <span className="field__err">8+ characters with at least one letter and one number</span>}</div>
            <div className="field"><label>Confirm password <span className="req">*</span></label>
              <input className="input" type="password" value={f.confirm} autoComplete="new-password"
                onChange={(e) => set('confirm', e.target.value)} />
              {f.confirm && f.confirm !== f.password && <span className="field__err">Passwords do not match</span>}</div>
          </div>
          <div className="field">
            <label>Referral code (optional)</label>
            <input className="input" value={f.referralId} onChange={(e) => set('referralId', e.target.value)}
              placeholder="VOL-XXXXXXXX or a volunteer's 6-digit code" />
            <div className="field__hint">Joined through a friend? Enter their code so they get credit.</div>
          </div>

          <div className="note" style={{ margin: '6px 0 16px' }}>
            <Icon.clock width={18} height={18} />
            <span><b>How activation works:</b> share your personal donation link and raise <b>₹5,000 in 3 days</b> to
              become an active volunteer. You earn <b>10% commission</b> on every donation referred — credited to your
              wallet instantly, yours to keep either way.</span>
          </div>

          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '.92rem', marginTop: 4 }}>
            <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} style={{ marginTop: 4 }} />
            <span>I confirm the information is accurate and I agree to SVR Educational Society's volunteer code of conduct and child-safeguarding policy. <span className="req">*</span></span>
          </label>

          {error && <div className="field__err" style={{ marginTop: 12 }}>{error}</div>}

          <button className="btn btn--primary btn--lg btn--block" style={{ marginTop: 22 }} disabled={!valid || busy}>
            {busy ? 'Creating your account…' : <>Create account &amp; start <Icon.arrowRight width={17} height={17} /></>}
          </button>
          <p className="muted" style={{ fontSize: '.84rem', textAlign: 'center', marginTop: 12 }}>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  )
}