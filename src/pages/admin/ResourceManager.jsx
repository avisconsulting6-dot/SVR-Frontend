import { useEffect, useState } from 'react'
import { api, imgUrl } from '../../lib/api'
import { Icon } from '../../components/ui/Icons'
import { Modal, ImageUploader, Field } from './cms.jsx'
import { formatINR, formatDate } from '../../lib/format'

/**
 * Admin table + create/edit modal for a backend resource.
 * Works against api.admin.list/create/update/remove (real backend).
 */
export default function ResourceManager({ resource, title, icon = 'grid', config }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // row object or 'new'
  const I = Icon[icon] || Icon.grid

  const load = () => {
    setLoading(true)
    api.admin.list(resource)
      .then((r) => { setRows(r || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [resource])

  async function remove(row) {
    if (!confirm(`Delete "${row[config.titleField] || row.id}"? This cannot be undone.`)) return
    await api.admin.remove(resource, row.id)
    load()
  }

  return (
    <>
      <div className="admin__head">
        <div><h1>{title}</h1><p className="muted" style={{ fontSize: '.9rem' }}>{rows.length} item{rows.length !== 1 ? 's' : ''}</p></div>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing('new')}><I width={15} height={15} /> Add new</button>
      </div>

      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr>{config.columns.map((c) => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={config.columns.length + 1} className="muted" style={{ padding: 20 }}>Loading…</td></tr>
                : rows.length === 0 ? <tr><td colSpan={config.columns.length + 1} className="muted" style={{ padding: 20 }}>Nothing here yet. Click "Add new".</td></tr>
                : rows.map((row) => (
                  <tr key={row.id}>
                    {config.columns.map((c) => <td key={c.key}>{renderCell(row, c, config)}</td>)}
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" onClick={() => setEditing(row)} title="Edit" aria-label="Edit"><Icon.pencil width={16} height={16} /></button>
                        <button className="icon-btn icon-btn--danger" onClick={() => remove(row)} title="Delete" aria-label="Delete"><Icon.trash width={16} height={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditModal resource={resource} config={config}
          row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }} />
      )}
    </>
  )
}

function renderCell(row, c, config) {
  const v = row[c.key]
  if (c.type === 'image') return v ? <img className="thumb-sm" src={imgUrl(v)} alt="" /> : <span className="thumb-sm" />
  if (c.type === 'money') return v == null ? <span className="muted">—</span> : <b>{formatINR(v || 0)}</b>
  if (c.type === 'percent') return v == null ? <span className="muted">open</span> : (
    <div style={{ minWidth: 90 }}>
      <div className="muted" style={{ fontSize: '.74rem', marginBottom: 3 }}>{v}%</div>
      <div style={{ height: 6, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden' }}>
        <span style={{ display: 'block', width: `${Math.min(100, v)}%`, height: '100%', background: v >= 100 ? 'var(--green)' : 'var(--saffron)' }} />
      </div>
    </div>
  )
  if (c.type === 'date') return <span className="muted">{v ? formatDate(v) : '—'}</span>
  if (c.type === 'bool') return <span className={`badge ${v ? 'badge--green' : ''}`}>{v ? 'Yes' : 'No'}</span>
  if (c.type === 'badge') return v ? <span className="badge badge--blue">{v}</span> : <span className="muted">—</span>
  return c.key === config.titleField ? <b>{v}</b> : (v ?? '—')
}

function EditModal({ resource, config, row, onClose, onSaved }) {
  const init = {}
  for (const f of config.fields) init[f.key] = row?.[f.key] ?? f.default ?? (f.type === 'bool' ? true : '')
  const [form, setForm] = useState(init)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  async function save() {
    setBusy(true); setErr('')
    try {
      const payload = { ...form }
      // numbers arrive as strings from inputs — coerce, empty -> null
      for (const f of config.fields) {
        if (f.type === 'number') payload[f.key] = payload[f.key] === '' ? null : Number(payload[f.key])
      }
      if (row) await api.admin.update(resource, row.id, payload)
      else await api.admin.create(resource, payload)
      onSaved()
    } catch (e) { setErr(e.message); setBusy(false) }
  }

  return (
    <Modal title={`${row ? 'Edit' : 'New'} ${config.singular}`} onClose={onClose}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </>}>
      {config.fields.map((f) => {
        if (f.type === 'image') return <ImageUploader key={f.key} value={form[f.key]} onChange={(v) => set(f.key, v)} />
        if (f.type === 'textarea') return <Field key={f.key} label={f.label} required={f.required}><textarea className="textarea" rows={4} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} /></Field>
        if (f.type === 'number') return <Field key={f.key} label={f.label} required={f.required}><input className="input" type="number" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} /></Field>
        if (f.type === 'select') return <Field key={f.key} label={f.label} required={f.required}><select className="select" value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}><option value="">Select…</option>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>
        if (f.type === 'date') return <Field key={f.key} label={f.label} required={f.required}><input className="input" type="datetime-local" value={toLocal(form[f.key])} onChange={(e) => set(f.key, e.target.value)} /></Field>
        if (f.type === 'bool') return <label key={f.key} style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '8px 0', fontSize: '.92rem' }}><input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} /> {f.label}</label>
        return <Field key={f.key} label={f.label} required={f.required}><input className="input" value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} /></Field>
      })}
      {err && <div className="field__err">{err}</div>}
    </Modal>
  )
}

function toLocal(v) {
  if (!v) return ''
  const d = new Date(v); if (isNaN(d)) return ''
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}