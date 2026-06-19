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
  const [loginVisible, setLoginVisible] = useState(false)

  /* ---------- register state ---------- */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [regBusy, setRegBusy] = useState(false)
  const [regVisible, setRegVisible] = useState(false)
  const [regError, setRegError] = useState('')

  /* ---------- forgot password state ---------- */
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotBusy, setForgotBusy] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

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
        ...(referral.trim() ? { referralId: referral.trim() } : {}),
      })
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

  /* ============ FORGOT PASSWORD ============ */
  function openForgot() {
    setForgotEmail(loginEmail) // pre-fill if user already typed their email
    setForgotError('')
    setForgotSuccess(false)
    setForgotOpen(true)
  }

  function closeForgot() {
    setForgotOpen(false)
    setForgotEmail('')
    setForgotError('')
    setForgotSuccess(false)
  }

  async function handleForgot(e) {
    e.preventDefault()
    setForgotError('')
    setForgotBusy(true)
    try {
      await api.forgotPassword({ email: forgotEmail.trim().toLowerCase() })
      setForgotSuccess(true)
    } catch (err) {
      setForgotError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setForgotBusy(false)
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

              <div className="field">
                <label>Email <span className="req">*</span></label>
                <input
                  className="input"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label>Password <span className="req">*</span></label>
                {/* Wrapper gives the input + toggle button a single bordered box */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="input"
                    style={{ flex: 1, paddingRight: 40 }}
                    type={loginVisible ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute', right: 10,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 0, display: 'flex', alignItems: 'center',
                      color: 'var(--muted, #888)',
                    }}
                    onClick={() => setLoginVisible((v) => !v)}
                    tabIndex={-1}
                    aria-label={loginVisible ? 'Hide password' : 'Show password'}
                  >
                    {loginVisible
                      ? Icon.passwordvisible({ width: 18, height: 18 })
                      : Icon.passwordhidden({ width: 18, height: 18 })}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 14 }}>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontSize: '.88rem',
                    color: 'var(--primary, #2563eb)',
                    textDecoration: 'underline',
                  }}
                  onClick={openForgot}
                >
                  Forgot password?
                </button>
              </div>

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
                <div className="field">
                  <label>Full name <span className="req">*</span></label>
                  <input className="input" value={name}
                    onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                </div>
                <div className="field">
                  <label>Mobile <span className="req">*</span></label>
                  <input className="input" type="tel" inputMode="numeric" value={number}
                    onChange={(e) => setNumber(e.target.value)} required
                    pattern="[6-9][0-9]{9}" title="10-digit mobile number starting with 6-9"
                    autoComplete="tel" />
                </div>
              </div>

              <div className="field">
                <label>Email <span className="req">*</span></label>
                <input className="input" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>

              <div className="field">
                <label>Password <span className="req">*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="input"
                    style={{ flex: 1, paddingRight: 40 }}
                    type={regVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="8+ characters, with a letter and a number"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute', right: 10,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 0, display: 'flex', alignItems: 'center',
                      color: 'var(--muted, #888)',
                    }}
                    onClick={() => setRegVisible((v) =>!v)} 
                    tabIndex={-1}
                    aria-label={setRegVisible ? 'Hide password' : 'Show password'}
                  >
                   {setRegVisible
                      ? Icon.passwordvisible({ width: 18, height: 18 })
                      : Icon.passwordhidden({ width: 18, height: 18 })}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Referral ID <span className="muted">(optional)</span></label>
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

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {forgotOpen && (
        <div
          onClick={closeForgot}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg, #fff)',
              borderRadius: 12,
              padding: '28px 28px 24px',
              width: '100%', maxWidth: 420,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0 }}>Reset password</h3>
              <button
                type="button"
                onClick={closeForgot}
                aria-label="Close"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.1rem', lineHeight: 1, padding: 4,
                  color: 'var(--muted, #888)',
                }}
              >✕</button>
            </div>

            {forgotSuccess ? (
              <div>
                <div className="note" style={{ marginBottom: 16 }}>
                  <Icon.shield width={18} height={18} />
                  <span>Password reset link sent! Check your inbox (and spam folder).</span>
                </div>
                <button className="btn btn--primary btn--block" onClick={closeForgot}>
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot}>
                <p className="muted" style={{ fontSize: '.92rem', marginBottom: 16 }}>
                  Enter your registered email address. We'll send you a link to reset your password.
                </p>
                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <input
                    className="input"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
                {forgotError && <div className="field__err" style={{ marginBottom: 12 }}>{forgotError}</div>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn btn--secondary btn--block" onClick={closeForgot}>
                    Cancel
                  </button>
                  <button className="btn btn--primary btn--block" disabled={forgotBusy}>
                    {forgotBusy ? 'Sending…' : 'Send reset link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}