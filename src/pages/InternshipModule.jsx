import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { Icon } from '../../components/ui/Icons'
import { Modal, Field } from './cms.jsx'
import { formatDate } from '../../lib/format'

/**
 * Internship management — REAL backend version.
 * Tabs: Postings (CRUD) · Applications (approve/reject) · Interns (+ tasks)
 */
const TABS = [
  { key: 'postings', label: 'Postings', icon: 'doc' },
  { key: 'applications', label: 'Applications', icon: 'users' },
  { key: 'interns', label: 'Interns & tasks', icon: 'cap' },
]

export default function InternshipModule() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'postings'
  const [postings, setPostings] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
  setLoading(true)
  try {
    const [p, a] = await Promise.all([api.admin.internships(), api.admin.internApplications()])
    setPostings(p || [])
    setApplications(a || [])
  } catch (e) {
    console.error('Failed to load internships:', e)
  } finally {
    setLoading(false)  // always runs, never stays stuck
  }
}, [])
  useEffect(() => { load() }, [load])

  const pending = applications.filter((a) => a.status === 'applied').length

  return (
    <>
      <div className="admin__head">
        <div><h1>Internship management</h1><p className="muted" style={{ fontSize: '.9rem' }}>Postings, applications &amp; intern tasks</p></div>
        <button className="btn btn--ghost btn--sm" onClick={() => api.admin.downloadInternsCsv().catch((e) => alert(e.message))}>
          <Icon.doc width={15} height={15} /> Interns CSV
        </button>
      </div>

      <div className="pill-row" style={{ marginBottom: 20 }}>
        {TABS.map((t) => {
          const I = Icon[t.icon]
          return (
            <button key={t.key} className={`filter-pill ${tab === t.key ? 'active' : ''}`} onClick={() => setParams({ tab: t.key })}>
              <I width={15} height={15} /> {t.label}
              {t.key === 'applications' && pending > 0 && <b style={{ marginLeft: 6 }}>({pending})</b>}
            </button>
          )
        })}
      </div>

      {loading ? <p className="muted">Loading…</p> : (
        <>
          {tab === 'postings' && <Postings postings={postings} onChanged={load} />}
          {tab === 'applications' && <Applications applications={applications} onChanged={load} />}
          {tab === 'interns' && <Interns applications={applications} />}
        </>
      )}
    </>
  )
}

/* ---------------- Postings: CRUD ---------------- */
function Postings({ postings, onChanged }) {
  const [editing, setEditing] = useState(null)

  return (
    <>
      <div className="admin__head" style={{ marginBottom: 12 }}>
        <p className="muted" style={{ fontSize: '.9rem' }}>{postings.length} posting{postings.length !== 1 ? 's' : ''}</p>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing('new')}><Icon.doc width={15} height={15} /> New posting</button>
      </div>
      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Title</th><th>Track</th><th>Duration</th><th>Location</th><th>Applications</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {postings.length === 0 ? <tr><td colSpan={7} className="muted" style={{ padding: 20 }}>No postings yet.</td></tr>
                : postings.map((p) => (
                  <tr key={p._id}>
                    <td><b>{p.title}</b></td>
                    <td><span className="badge badge--blue">{p.track}</span></td>
                    <td className="muted">{p.duration || '—'}</td>
                    <td className="muted">{p.location || '—'}</td>
                    <td>{p.applications ? `${p.applications.applied || 0} new · ${p.applications.approved || 0} approved` : '—'}</td>
                    <td><span className={`badge ${p.isOpen ? 'badge--green' : ''}`}>{p.isOpen ? 'Open' : 'Closed'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" title="Edit" onClick={() => setEditing(p)}><Icon.pencil width={16} height={16} /></button>
                        <button className="icon-btn icon-btn--danger" title="Delete" onClick={async () => {
                          if (!confirm(`Delete "${p.title}"?`)) return
                          try {
                            await api.admin.deleteInternship(p._id);
                            onChanged()
                          } catch (e) { alert(e.message) }
                        }}><Icon.trash width={16} height={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing && <PostingModal posting={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onChanged() }} />}
    </>
  )
}

function PostingModal({ posting, onClose, onSaved }) {
  const [f, setF] = useState({
    title: posting?.title || '', track: posting?.track || 'tech',
    description: posting?.description || '', duration: posting?.duration || '3 months',
    location: posting?.location || 'Remote', openings: posting?.openings || 1,
    isOpen: posting ? posting.isOpen : true,
  })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  async function save() {
    if (!f.title.trim()) return setErr('Title is required.')
    setBusy(true); setErr('')
    try {
     if (posting) {
  await api.admin.updateInternship(posting._id, f)   // not api.admin.update('internships', ...)
} else {
  await api.admin.createInternship(f)                // not api.admin.create('internships', ...)
}
      onSaved()
    } catch (e) { setErr(e.message); setBusy(false) }
  }

  return (
    <Modal title={posting ? 'Edit posting' : 'New internship posting'} onClose={onClose}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </>}>
      <Field label="Title" required><input className="input" value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <div className="grid grid-2" style={{ gap: 12 }}>
        <Field label="Track" required>
          <select className="select" value={f.track} onChange={(e) => set('track', e.target.value)}>
            {['tech', 'design', 'content', 'social-work', 'fundraising', 'operations'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Openings"><input className="input" type="number" min="1" value={f.openings} onChange={(e) => set('openings', +e.target.value)} /></Field>
      </div>
      <div className="grid grid-2" style={{ gap: 12 }}>
        <Field label="Duration"><input className="input" value={f.duration} onChange={(e) => set('duration', e.target.value)} /></Field>
        <Field label="Location"><input className="input" value={f.location} onChange={(e) => set('location', e.target.value)} /></Field>
      </div>
      <Field label="Description"><textarea className="textarea" rows={4} value={f.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '.92rem' }}>
        <input type="checkbox" checked={f.isOpen} onChange={(e) => set('isOpen', e.target.checked)} /> Open for applications
      </label>
      {err && <div className="field__err">{err}</div>}
    </Modal>
  )
}

/* ---------------- Applications: approve / reject ---------------- */
const APP_BADGE = { applied: 'badge--blue', approved: 'badge--green', rejected: '' }

function Applications({ applications, onChanged }) {
  const [filter, setFilter] = useState('applied')
  const [busy, setBusy] = useState(null)
  const list = applications.filter((a) => filter === 'all' || a.status === filter)

  async function act(a, action) {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} ${a.name}'s application?`)) return
    setBusy(a._id)
    try {
      if (action === 'approve') await api.admin.approveApplication(a._id)
      else await api.admin.rejectApplication(a._id)
      onChanged()
    } catch (e) { alert(e.message) } finally { setBusy(null) }
  }

  return (
    <>
      <div className="pill-row" style={{ marginBottom: 14 }}>
        {['applied', 'approved', 'rejected', 'all'].map((s) => (
          <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? `All (${applications.length})` : `${s[0].toUpperCase() + s.slice(1)} (${applications.filter((a) => a.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Candidate</th><th>Applied for</th><th>Qualification</th><th>Status</th><th>Applied</th><th>Actions</th></tr></thead>
            <tbody>
              {list.length === 0 ? <tr><td colSpan={6} className="muted" style={{ padding: 20 }}>No applications in this view.</td></tr>
                : list.map((a) => (
                  <tr key={a._id}>
                    <td><b>{a.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{a.email} · {a.phone}</div></td>
                    <td>{a.internshipId?.title || '—'}<div className="muted" style={{ fontSize: '.76rem' }}>{a.internshipId?.track}</div></td>
                    <td className="muted">{a.qualification || '—'}</td>
                    <td><span className={`badge ${APP_BADGE[a.status]}`}>{a.status}</span></td>
                    <td className="muted">{formatDate(a.createdAt)}</td>
                    <td>
                      {a.status === 'applied' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn--primary btn--sm" disabled={busy === a._id} onClick={() => act(a, 'approve')}>Approve</button>
                          <button className="btn btn--ghost btn--sm" disabled={busy === a._id} onClick={() => act(a, 'reject')}>Reject</button>
                        </div>
                      )}
                      {a.status === 'approved' && <span className="muted" style={{ fontSize: '.78rem' }}>Magic link sent</span>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {applications.some((a) => a.message) && filter === 'applied' && (
        <p className="muted" style={{ fontSize: '.8rem', marginTop: 10 }}>Tip: approving sends the candidate a set-password email and creates their intern account.</p>
      )}
    </>
  )
}

/* ---------------- Interns: approved people + task assignment ---------------- */
function Interns({ applications }) {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [assigning, setAssigning] = useState(null)   // user object

  const load = () => Promise.all([
    api.admin.users('?role=intern').then(setUsers),
    api.admin.tasks('?role=intern').then(setTasks),
  ]).catch(() => {})
  useEffect(() => { load() }, [])

  const tasksFor = (userId) => tasks.filter((t) => String(t.assignee?.id) === String(userId))

  return (
    <>
      <div className="card admin__panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Intern</th><th>Account</th><th>Tasks</th><th>Actions</th></tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={4} className="muted" style={{ padding: 20 }}>No intern accounts yet — approve applications first.</td></tr>
                : users.map((u) => {
                  const ts = tasksFor(u.id)
                  const open = ts.filter((t) => t.status !== 'completed').length
                  return (
                    <tr key={u.id}>
                      <td><b>{u.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>{u.email}</div></td>
                      <td><span className={`badge ${u.status === 'active' ? 'badge--green' : 'badge--saffron'}`}>{u.status === 'active' ? 'Active' : 'Awaiting password'}</span></td>
                      <td>{ts.length ? <>{ts.length} total · <b>{open}</b> open</> : <span className="muted">none</span>}</td>
                      <td><button className="btn btn--primary btn--sm" onClick={() => setAssigning(u)}>+ Assign task</button></td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* all intern tasks */}
      <div className="card admin__panel" style={{ marginTop: 22, padding: 0 }}>
        <div className="admin__panel-head" style={{ padding: '18px 18px 0' }}><h4>All intern tasks</h4></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Task</th><th>Assigned to</th><th>Deadline</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {tasks.length === 0 ? <tr><td colSpan={5} className="muted" style={{ padding: 20 }}>No tasks yet.</td></tr>
                : tasks.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.title}</b>{t.description && <div className="muted" style={{ fontSize: '.78rem' }}>{t.description.slice(0, 60)}</div>}</td>
                    <td>{t.assignee?.name || '—'}</td>
                    <td className="muted">{t.deadline ? formatDate(t.deadline) : '—'}</td>
                    <td>
                      <select className="input input--sm" value={t.status}
                        onChange={async (e) => { await api.admin.updateTask(t.id, { status: e.target.value }); load() }}>
                        {['assigned', 'in_progress', 'submitted', 'completed'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td><button className="icon-btn icon-btn--danger" title="Delete" onClick={async () => { if (confirm('Delete task?')) { await api.admin.deleteTask(t.id); load() } }}><Icon.trash width={14} height={14} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {assigning && <TaskModal user={assigning} onClose={() => setAssigning(null)} onSaved={() => { setAssigning(null); load() }} />}
    </>
  )
}

function TaskModal({ user, onClose, onSaved }) {
  const [f, setF] = useState({ title: '', description: '', deadline: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function save() {
    if (!f.title.trim()) return setErr('Title is required.')
    setBusy(true); setErr('')
    try {
      await api.admin.createTask({
        title: f.title, description: f.description,
        deadline: f.deadline || null, assignedTo: user.id,
      })
      onSaved()
    } catch (e) { setErr(e.message); setBusy(false) }
  }

  return (
    <Modal title={`Assign task — ${user.name}`} onClose={onClose}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={busy} onClick={save}>{busy ? 'Assigning…' : 'Assign (email sent)'}</button>
      </>}>
      <Field label="Task title" required><input className="input" value={f.title} onChange={(e) => setF((s) => ({ ...s, title: e.target.value }))} /></Field>
      <Field label="Description"><textarea className="textarea" rows={3} value={f.description} onChange={(e) => setF((s) => ({ ...s, description: e.target.value }))} /></Field>
      <Field label="Deadline"><input className="input" type="date" value={f.deadline} onChange={(e) => setF((s) => ({ ...s, deadline: e.target.value }))} /></Field>
      {err && <div className="field__err">{err}</div>}
    </Modal>
  )
}