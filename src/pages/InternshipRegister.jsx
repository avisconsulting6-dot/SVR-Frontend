import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/ui/Icons'

const STEPS = ['Personal', 'Education', 'Choose internship', 'Review', 'Done']
const TRACK_ICON = { tech: 'cap', design: 'image', content: 'doc', 'social-work': 'hands', fundraising: 'rupee', operations: 'grid' }

/**
 * Free application — no programme fee. Submits to the backend; the
 * admin reviews it, and approval sends a set-password email that
 * activates the intern account.
 */
export default function InternshipRegister() {
  const [params] = useSearchParams()
  const preselect = params.get('internship') || ''

  const [postings, setPostings] = useState([])
  const [step, setStep] = useState(0)
  const [f, setF] = useState({
    name: '', email: '', phone: '', city: '',
    qualification: '', institution: '', yearOfStudy: '', stream: '',
    internshipId: preselect, message: '',
  })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  useEffect(() => { api.internships().then((p) => setPostings(p || [])).catch(() => {}) }, [])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [step])

  const posting = postings.find((p) => p._id === f.internshipId)

  const canNext = () => {
    if (step === 0) return f.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(f.email) && /^[6-9]\d{9}$/.test(f.phone) && f.city.trim()
    if (step === 1) return f.qualification && f.institution.trim()
    if (step === 2) return !!f.internshipId
    return true
  }

  async function submit() {
    setBusy(true); setError('')
    try {
      const qualification = [f.qualification, f.stream, f.institution, f.yearOfStudy].filter(Boolean).join(' · ')
      const message = [`City: ${f.city}`, f.message].filter(Boolean).join('\n')
      const res = await api.applyInternship(f.internshipId, {
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.trim(),
        qualification,
        message,
      })
      setResult(res)
      setStep(4)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section">
      <div className="container form-shell">
        <div className="breadcrumb" style={{ marginBottom: 14 }}><Link to="/">Home</Link> / <Link to="/internship">Internship</Link> / <span>Apply</span></div>
        <h1 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)', marginBottom: 8 }}>Internship application</h1>
        <p className="muted" style={{ marginBottom: 28 }}>Free to apply — our team reviews every application and emails you the decision.</p>

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
              <h3 style={{ marginBottom: 16 }}>Personal details</h3>
              <div className="row-2">
                <div className="field"><label>Full name <span className="req">*</span></label>
                  <input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></div>
                <div className="field"><label>Email <span className="req">*</span></label>
                  <input className="input" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} /></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Mobile <span className="req">*</span></label>
                  <input className="input" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="10-digit number" />
                  {f.phone && !/^[6-9]\d{9}$/.test(f.phone) && <span className="field__err">Enter a valid 10-digit mobile number</span>}</div>
                <div className="field"><label>City <span className="req">*</span></label>
                  <input className="input" value={f.city} onChange={(e) => set('city', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: 16 }}>Education</h3>
              <div className="row-2">
                <div className="field"><label>Highest qualification <span className="req">*</span></label>
                  <select className="select" value={f.qualification} onChange={(e) => set('qualification', e.target.value)}>
                    <option value="">Select…</option>
                    {['Class 12', 'Undergraduate', 'Postgraduate', 'Working professional'].map((q) => <option key={q}>{q}</option>)}
                  </select></div>
                <div className="field"><label>Stream / discipline</label>
                  <input className="input" value={f.stream} onChange={(e) => set('stream', e.target.value)} placeholder="e.g. Social Work, Engineering" /></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Institution <span className="req">*</span></label>
                  <input className="input" value={f.institution} onChange={(e) => set('institution', e.target.value)} /></div>
                <div className="field"><label>Year of study</label>
                  <input className="input" value={f.yearOfStudy} onChange={(e) => set('yearOfStudy', e.target.value)} placeholder="e.g. 2nd year / 2026" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Choose your internship</h3>
              <p className="muted" style={{ marginBottom: 18 }}>Open positions — pick the one that fits your interests.</p>
              {postings.length === 0 ? (
                <div className="note">
                  <Icon.bell width={18} height={18} />
                  <span>No internships are open right now. Check back soon, or <Link to="/volunteer/register">apply as a volunteer</Link> meanwhile.</span>
                </div>
              ) : (
                <div className="grid" style={{ gap: 12 }}>
                  {postings.map((p) => (
                    <label key={p._id} className={`amount-chip ${f.internshipId === p._id ? 'sel' : ''}`} style={{ textAlign: 'left', cursor: 'pointer' }}>
                      <input type="radio" name="posting" hidden checked={f.internshipId === p._id} onChange={() => set('internshipId', p._id)} />
                      {p.title} <small>{p.track} · {p.duration || 'flexible'} · {p.location} · {p.openings} opening{p.openings !== 1 ? 's' : ''}</small>
                    </label>
                  ))}
                </div>
              )}
              <div className="field" style={{ marginTop: 16 }}>
                <label>Why do you want to join? (optional)</label>
                <textarea className="textarea" rows={3} value={f.message} onChange={(e) => set('message', e.target.value)}
                  placeholder="A few lines about your interest and any relevant experience" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: 6 }}>Review &amp; submit</h3>
              <p className="muted" style={{ marginBottom: 18 }}>No fee — submitting sends your application for review.</p>
              <div className="receipt">
                <div className="receipt-row"><span>Name</span><b>{f.name}</b></div>
                <div className="receipt-row"><span>Email</span><b>{f.email}</b></div>
                <div className="receipt-row"><span>Mobile</span><b>{f.phone}</b></div>
                <div className="receipt-row"><span>Internship</span><b>{posting?.title || '—'}</b></div>
                <div className="receipt-row"><span>Track</span><b>{posting?.track}</b></div>
                <div className="receipt-row"><span>Qualification</span><b>{f.qualification}{f.institution ? ` · ${f.institution}` : ''}</b></div>
              </div>
              {error && <div className="field__err" style={{ marginTop: 12 }}>{error}</div>}
              <div className="note" style={{ marginTop: 16 }}>
                <Icon.mail width={18} height={18} />
                <span>If approved, you'll receive an email with a link to <b>set your password</b> and access the intern dashboard.</span>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="success-screen">
              <div className="tick"><Icon.checkCircle width={48} height={48} /></div>
              <h2>Application received, {f.name.split(' ')[0]}!</h2>
              <p className="muted" style={{ margin: '8px auto 0', maxWidth: '48ch' }}>
                You've applied for <b style={{ color: 'var(--ink)' }}>{posting?.title}</b>. We've emailed a confirmation
                to {f.email} — our team will review your application and notify you of the decision.
              </p>
              <div className="receipt">
                <div className="receipt-row"><span>Application ID</span><b>{String(result.applicationId).slice(-8).toUpperCase()}</b></div>
                <div className="receipt-row"><span>Internship</span><b>{posting?.title}</b></div>
                <div className="receipt-row"><span>Status</span><b>Under review</b></div>
              </div>
              <div className="hero__cta" style={{ justifyContent: 'center', marginTop: 24 }}>
                <Link to="/internship" className="btn btn--ghost">Back to programme</Link>
                <Link to="/" className="btn btn--primary">Go home</Link>
              </div>
            </div>
          )}

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
              <button className="btn btn--ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
              {step < 3
                ? <button className="btn btn--primary" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>Continue <Icon.arrowRight width={16} height={16} /></button>
                : <button className="btn btn--green" disabled={busy || !posting} onClick={submit}>{busy ? 'Submitting…' : <>Submit application <Icon.check width={16} height={16} /></>}</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}