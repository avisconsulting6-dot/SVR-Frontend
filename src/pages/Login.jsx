import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Icon } from '../components/ui/Icons'

// Self-registration is for volunteers only; donor accounts are created
// through the donation flow, intern accounts through admin approval,
// and admin accounts are seeded on the backend.

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('login') // 'login' | 'register'

  /* ---------- login state ---------- */
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [notice, setNotice] = useState('')

  /* ---------- register state ---------- */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [regBusy, setRegBusy] = useState(false)
  const [regError, setRegError] = useState('')

  // capture referral id from ?ref=VOL-XXXX and switch to signup
  useEffect(() => {
    const ref = params.get('ref')
    if (ref) {
      setReferral(ref.toUpperCase())
      setMode('register')
    }
  }, [params])

  /* ================= LOGIN ================= */
  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoginBusy(true)
    try {
      // goes through AuthContext so the user state updates BEFORE navigation
      const user = await login(loginEmail.trim().toLowerCase(), loginPassword)
      nav(user.role === 'admin' ? '/admin' : `/dashboard/${user.role}`, { replace: true })
    } catch (err) {
      if (err.code === 'PASSWORD_NOT_SET') {
        setLoginError('Please set your password first using the link emailed to you.')
      } else {
        setLoginError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoginBusy(false)
    }
  }

  /* ============ REGISTER (volunteer only) ============ */
  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')
    setRegBusy(true)
    try {
      await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: number.trim(),
        password,
        role: 'volunteer',
        // backend expects referralId: the referring volunteer's VOL- code
        ...(referral.trim() ? { referralId: referral.trim() } : {}),
      })

      // No token comes back from register — force a fresh sign-in.
      setMode('login')
      setLoginEmail(email.trim().toLowerCase())
      setLoginPassword('')
      setNotice('Account created! Please sign in with your email and password.')
      setName(''); setEmail(''); setNumber(''); setPassword(''); setReferral('')
    } catch (err) {
      setRegError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setRegBusy(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setLoginError(''); setRegError(''); setNotice('')
  }

  return (
    <section className="section">
      <div className="container form-shell" style={{ maxWidth: 520 }}>
        <div className="form-card">
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <span className="brand__logo brand__logo--lg" style={{ margin: '0 auto 14px' }}>
              <img src="/logo.png" alt="SVR Educational Society logo" />
            </span>
            <h2 style={{ fontSize: '1.7rem' }}>{mode === 'login' ? 'Sign in to SVR' : 'Become a Volunteer'}</h2>
            <p className="muted" style={{ fontSize: '.92rem', marginTop: 6 }}>
              {mode === 'login'
                ? 'Welcome back.'
                : 'Join SVR as a volunteer. Reach the 3-day target through your personal referral link to become an active volunteer.'}
            </p>
          </div>

          {/* mode toggle */}
          <div className="pill-row" style={{ justifyContent: 'center', marginBottom: 20 }}>
            <button type="button" className={`filter-pill ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>Sign in</button>
            <button type="button" className={`filter-pill ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>Volunteer signup</button>
          </div>

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              {notice && (
                <div className="note" style={{ marginBottom: 14 }}>
                  <Icon.shield width={18} height={18} />
                  <span>{notice}</span>
                </div>
              )}
              <div className="field"><label>Email <span className="req">*</span></label>
                <input className="input" type="email" value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" /></div>
              <div className="field"><label>Password <span className="req">*</span></label>
                <input className="input" type="password" value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete="current-password" /></div>
              {loginError && <div className="field__err" style={{ marginBottom: 12 }}>{loginError}</div>}
              <button className="btn btn--primary btn--block btn--lg" disabled={loginBusy}>
                {loginBusy ? 'Signing in…' : 'Sign in'} <Icon.arrowRight width={17} height={17} />
              </button>
            </form>
          )}

          {/* ================= REGISTER FORM ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="row-2">
                <div className="field"><label>Full name <span className="req">*</span></label>
                  <input className="input" value={name}
                    onChange={(e) => setName(e.target.value)} required autoComplete="name" /></div>
                <div className="field"><label>Mobile <span className="req">*</span></label>
                  <input className="input" type="tel" inputMode="numeric" value={number}
                    onChange={(e) => setNumber(e.target.value)} required
                    pattern="[6-9][0-9]{9}" title="10-digit mobile number starting with 6-9"
                    autoComplete="tel" /></div>
              </div>
              <div className="field"><label>Email <span className="req">*</span></label>
                <input className="input" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
              <div className="field"><label>Password <span className="req">*</span></label>
                <input className="input" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  placeholder="8+ characters, with a letter and a number" autoComplete="new-password" /></div>
              <div className="field"><label>Referral ID <span className="muted">(optional)</span></label>
                <input className="input" value={referral}
                  onChange={(e) => setReferral(e.target.value.toUpperCase())}
                  placeholder="VOL-XXXXXXXX (the volunteer who referred you)" />
                {referral && <span className="field__hint">Your application will be linked to this volunteer. Leave blank to join under SVR directly.</span>}
              </div>
              {regError && <div className="field__err" style={{ marginBottom: 12 }}>{regError}</div>}
              <button className="btn btn--primary btn--block btn--lg" disabled={regBusy}>
                {regBusy ? 'Creating account…' : 'Create volunteer account'} <Icon.arrowRight width={17} height={17} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}