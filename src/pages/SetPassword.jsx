import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/ui/Icons'

/**
 * /set-password?token=...  — donor & intern account activation.
 * The token arrives in the magic-link email after a first donation
 * or an approved internship application.
 */
export default function SetPassword() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const pwdOk = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  const match = password && password === confirm

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!pwdOk) return setError('Password must be 8+ characters with at least one letter and one number.')
    if (!match) return setError('Passwords do not match.')
    setBusy(true)
    try {
      await api.setPassword(token, password)
      setDone(true)
      setTimeout(() => nav('/login', { replace: true }), 2500)
    } catch (err) {
      if (err.code === 'MAGIC_LINK_INVALID') setError('This link is invalid or has expired. Make a donation again or contact us for a new link.')
      else if (err.code === 'PASSWORD_ALREADY_SET') setError('Your password is already set — you can log in directly.')
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section">
      <div className="container form-shell" style={{ maxWidth: 480 }}>
        <div className="form-card">
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <span className="brand__logo brand__logo--lg" style={{ margin: '0 auto 14px' }}>
              <img src="/logo.png" alt="SVR Educational Society logo" />
            </span>
            <h2 style={{ fontSize: '1.6rem' }}>Set your password</h2>
            <p className="muted" style={{ fontSize: '.92rem', marginTop: 6 }}>
              Create a password to activate your account and access your dashboard.
            </p>
          </div>

          {!token ? (
            <div className="note">
              <Icon.shield width={18} height={18} />
              <span>This page needs the link from your email. Open the "Set your password" button in the email we sent you.</span>
            </div>
          ) : done ? (
            <div className="success-screen" style={{ padding: '10px 0' }}>
              <div className="tick"><Icon.checkCircle width={42} height={42} /></div>
              <h3>Password set!</h3>
              <p className="muted">Taking you to the sign-in page…</p>
              <Link to="/login" className="btn btn--primary" style={{ marginTop: 14 }}>Sign in now</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="field"><label>New password <span className="req">*</span></label>
                <input className="input" type="password" value={password} autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters, a letter and a number" />
                {password && !pwdOk && <span className="field__err">8+ characters with at least one letter and one number</span>}
              </div>
              <div className="field"><label>Confirm password <span className="req">*</span></label>
                <input className="input" type="password" value={confirm} autoComplete="new-password"
                  onChange={(e) => setConfirm(e.target.value)} />
                {confirm && !match && <span className="field__err">Passwords do not match</span>}
              </div>
              {error && <div className="field__err" style={{ marginBottom: 12 }}>{error}</div>}
              <button className="btn btn--primary btn--block btn--lg" disabled={busy || !pwdOk || !match}>
                {busy ? 'Saving…' : 'Set password & activate'} <Icon.arrowRight width={17} height={17} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}