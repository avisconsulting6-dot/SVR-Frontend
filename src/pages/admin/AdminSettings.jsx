import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

/**
 * Admin → Settings. Edits the platform config that used to live in .env:
 * donation target, product target, commission %, activation window,
 * reapply cooldown, activation rule, minimum withdrawal.
 */
const FIELDS = [
  { key: 'donationTarget', label: 'Donation target (₹)', hint: 'Referred donations a volunteer must raise to activate.', type: 'number', min: 0 },
  { key: 'productTarget', label: 'Product sales target (₹)', hint: 'Shop sales target. Set 0 to disable (donation target alone applies).', type: 'number', min: 0 },
  { key: 'donationCommissionPercent', label: 'Donation commission (%)', hint: 'Credited to the volunteer wallet on every referred donation. (Product commission is set per-product when adding products.)', type: 'number', min: 0, max: 100 },
  { key: 'windowDays', label: 'Activation window (days)', hint: 'Time to hit the target, counted from when admin accepts the application.', type: 'number', min: 1 },
  { key: 'reapplyAfterDays', label: 'Re-apply cooldown (days)', hint: 'Wait before a rejected volunteer can apply again.', type: 'number', min: 0 },
  { key: 'minWithdrawal', label: 'Minimum withdrawal (₹)', hint: 'Smallest payout a volunteer can request.', type: 'number', min: 1 },
]

export default function AdminSettings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    api.admin.getSettings().then(setForm).catch((e) => setErr(e.message))
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setSaving(true); setMsg(''); setErr('')
    try {
      const saved = await api.admin.saveSettings(form)
      setForm(saved)
      setMsg('Settings saved. Changes apply to new evaluations immediately.')
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return <div className="admin-page"><p className="muted">{err || 'Loading settings…'}</p></div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1>Platform settings</h1>
        <p className="muted">Volunteer programme targets, commission and payout rules. Stored in the database — no redeploy needed.</p>
      </div>

      <form className="card" style={{ padding: 24, maxWidth: 640 }} onSubmit={save}>
        <div style={{ display: 'grid', gap: 18 }}>
          {FIELDS.map((f) => (
            <div key={f.key} className="field">
              <label>{f.label}</label>
              <input
                className="input"
                type={f.type}
                min={f.min}
                max={f.max}
                value={form[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
              />
              <div className="field__hint">{f.hint}</div>
            </div>
          ))}

          <div className="field">
            <label>Activation rule</label>
            <select className="select" value={form.activationRule} onChange={(e) => set('activationRule', e.target.value)}>
              <option value="either">Either target met (donation OR product)</option>
              <option value="both">Both targets required (donation AND product)</option>
            </select>
            <div className="field__hint">Only matters when a product target is set. "Either" is more forgiving.</div>
          </div>
        </div>

        {msg && <div className="note note--green" style={{ marginTop: 18 }}>{msg}</div>}
        {err && <div className="field__err" style={{ marginTop: 18 }}>{err}</div>}

        <button className="btn btn--primary" style={{ marginTop: 22 }} disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  )
}