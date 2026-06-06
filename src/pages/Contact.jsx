import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ORG } from '../data/mock'
import { Icon } from '../components/ui/Icons'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' })

  function submit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
            <h1>We'd love to hear from you</h1>
            <p className="lead">Questions about donating, volunteering, CSR partnerships or our work — reach out and a real person will reply within two working days.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container cd-grid">
          <div className="form-card">
            {sent ? (
              <div className="success-screen">
                <div className="tick"><Icon.checkCircle width={48} height={48} /></div>
                <h2>Message sent</h2>
                <p className="muted" style={{ marginTop: 8 }}>Thank you, {form.name.split(' ')[0] || 'friend'}. We'll be in touch at {form.email}.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 style={{ marginBottom: 18 }}>Send a message</h3>
                <div className="row-2">
                  <div className="field"><label>Name <span className="req">*</span></label>
                    <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="field"><label>Email <span className="req">*</span></label>
                    <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div className="field"><label>Subject</label>
                  <select className="select" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option>General enquiry</option><option>Donation / 80G receipt</option>
                    <option>Volunteering</option><option>CSR / corporate partnership</option>
                    <option>Media</option>
                  </select>
                </div>
                <div className="field"><label>Message <span className="req">*</span></label>
                  <textarea className="textarea" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                <button className="btn btn--primary btn--lg" type="submit">Send message <Icon.arrowRight width={17} height={17} /></button>
              </form>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ padding: 22 }}>
              <h4 style={{ marginBottom: 14 }}>Head office</h4>
              <p style={{ display: 'flex', gap: 10, color: 'var(--ink-2)' }}><Icon.pin width={20} height={20} />{ORG.address}</p>
              <p style={{ display: 'flex', gap: 10, marginTop: 12 }}><Icon.mail width={18} height={18} /><a href={`mailto:${ORG.email}`}>{ORG.email}</a></p>
              <p style={{ display: 'flex', gap: 10, marginTop: 10 }}><Icon.phone width={18} height={18} /><a href={`tel:${ORG.phone}`}>{ORG.phone}</a></p>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/10', background: 'var(--paper-2)', display: 'grid', placeItems: 'center', color: 'var(--muted)', position: 'relative' }}>
                <div style={{ textAlign: 'center' }}>
                  <Icon.pin width={32} height={32} />
                  <div style={{ fontSize: '.85rem', marginTop: 8 }}>Google Maps embed goes here</div>
                  <div style={{ fontSize: '.75rem' }}>Indiranagar, Bengaluru</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <h4 style={{ marginBottom: 12 }}>Follow our work</h4>
              <div className="pill-row">
                {['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'X'].map((s) => (
                  <a key={s} className="filter-pill" href="#">{s}</a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
