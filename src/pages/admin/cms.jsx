import { useState } from 'react'
import { api, imgUrl } from '../../lib/api'
import { Icon } from '../../components/ui/Icons'

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  )
}

export function ImageUploader({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function pick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setErr('')
    try {
      const { url } = await api.admin.upload(file)
      onChange(url)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="field">
      <label>Image</label>
      <div className="uploader">
        {value
          ? <img className="uploader__preview" src={imgUrl(value)} alt="preview" />
          : <span className="uploader__preview uploader__preview--empty"><Icon.image width={24} height={24} /></span>}
        <div style={{ flex: 1 }}>
          <input type="file" accept="image/*" onChange={pick} disabled={busy} />
          {busy && <div className="muted" style={{ fontSize: '.8rem', marginTop: 6 }}>Uploading…</div>}
          {err && <div className="field__err">{err}</div>}
          <div className="field__hint">Or paste an image URL below.</div>
          <input className="input" style={{ marginTop: 6 }} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /uploads/…" />
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children, required }) {
  return (
    <div className="field">
      <label>{label} {required && <span className="req">*</span>}</label>
      {children}
    </div>
  )
}
