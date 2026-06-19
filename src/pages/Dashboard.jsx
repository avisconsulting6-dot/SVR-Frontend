import { useEffect, useState } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Icon } from '../components/ui/Icons'
import { formatINR, formatDate } from '../lib/format'

const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In progress', submitted: 'Submitted', completed: 'Completed' }
const STATUS_BADGE = { assigned: 'badge--blue', in_progress: 'badge--saffron', submitted: 'badge', completed: 'badge--green' }
const NEXT_STATUS = { assigned: 'in_progress', in_progress: 'submitted', submitted: 'completed' }

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { role } = useParams()

  if (loading) return <section className="section"><div className="container"><p className="muted">Loading…</p></div></section>
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  // URL says one role but the account is another -> send to the real one
  if (role && role !== user.role) return <Navigate to={`/dashboard/${user.role}`} replace />

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          <div>
            <span className="badge badge--saffron" style={{ marginBottom: 8 }}>{user.role} dashboard</span>
            <h1 style={{ fontSize: '2rem' }}>Welcome back, {user.name}</h1>
          </div>
          <Link to="/" className="btn btn--ghost">Back to site</Link>
        </div>

        {user.role === 'donor' && (
          <>
            <DonorView />
            <WalletReferral />
          </>
        )}

        {user.role === 'volunteer' && (
          <>
            <VolunteerTarget />
            <MyTasks />
          </>
        )}

        {user.role === 'intern' && (
          <>
            <InternProfile />
            <MyTasks />
          </>
        )}
      </div>
    </section>
  )
}

function StatCard({ icon, label, value, sub, color = 'var(--saffron)' }) {
  const I = Icon[icon]
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat__num" style={{ fontSize: '1.8rem' }}>{value}</div>
          <div className="muted" style={{ fontSize: '.86rem' }}>{label}</div>
        </div>
        <span style={{ color, background: 'color-mix(in srgb, currentColor 12%, white)', padding: 8, borderRadius: 10, display: 'grid' }}><I width={22} height={22} /></span>
      </div>
      {sub && <div style={{ marginTop: 10, fontSize: '.82rem', color: 'var(--green-700)' }}>{sub}</div>}
    </div>
  )
}

/* =====================================================================
   VOLUNTEER — lifecycle-aware view from GET /api/volunteer/dashboard.
   applied → in_progress (timer + targets) → active / rejected.
   Targets/commission/window are admin-configured · availability toggle ·
   referral links · payout shown after rejection · 45-day re-apply.
===================================================================== */
function VolunteerTarget() {
  const [data, setData] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [wForm, setWForm] = useState(null)   // withdrawal form state (null = closed)

  const load = () => Promise.all([
    api.volunteerDashboard().then(setData),
    api.getWallet().then(setWallet).catch(() => setWallet({ balance: 0, transactions: [] })),
    api.myWithdrawals().then(setWithdrawals).catch(() => setWithdrawals([])),
  ]).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (error) return <p className="muted" style={{ marginBottom: 24 }}>Could not load your volunteer profile: {error}</p>
  if (!data) return <p className="muted">Loading your profile…</p>

  const { profile, target, commission, reapply } = data

  function copy(kind, link) {
    navigator.clipboard?.writeText(link)
    setCopied(kind); setTimeout(() => setCopied(null), 1800)
  }
  async function toggleAvailability() {
    setBusy(true)
    try {
      await api.setAvailability(profile.availability === 'available' ? 'unavailable' : 'available')
      await load()
    } finally { setBusy(false) }
  }
  async function doReapply() {
    if (!window.confirm('Submit a fresh application? It will go to the team for review again.')) return
    setBusy(true)
    try { await api.reapply(); await load() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  /* ---------- STATE 1: APPLIED — awaiting admin review ---------- */
  if (profile.status === 'applied') {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: 'var(--saffron-50)', color: 'var(--saffron-700)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <Icon.clock width={28} height={28} />
        </div>
        <h3 style={{ marginBottom: 8 }}>Application under review</h3>
        <p className="muted" style={{ maxWidth: '42ch', margin: '0 auto 16px' }}>
          Thanks for signing up! Our team will verify your application shortly. Once it's approved,
          your activation challenge begins and you'll get an email with your referral links.
        </p>
        <span className="badge badge--saffron">Awaiting approval</span>
        <p className="muted" style={{ fontSize: '.82rem', marginTop: 16 }}>
          Application ID: <b style={{ letterSpacing: '.06em' }}>{profile.applicationId}</b>
        </p>
      </div>
    )
  }

  /* ---------- STATE 4: REJECTED — window passed, target missed ---------- */
  if (profile.status === 'rejected') {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: 'var(--paper-2)', color: 'var(--muted)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <Icon.clock width={28} height={28} />
        </div>
        <h3 style={{ marginBottom: 8 }}>Activation window closed</h3>
        <p className="muted" style={{ maxWidth: '44ch', margin: '0 auto 14px' }}>
          The target wasn't reached within the window this time.
          {commission?.earned > 0 && <> The <b>{formatINR(commission.earned)}</b> you earned stays in your wallet.</>}
        </p>
        {reapply?.canReapply ? (
          <button className="btn btn--primary btn--sm" disabled={busy} onClick={doReapply}>Re-apply now</button>
        ) : reapply?.availableAt ? (
          <span className="badge badge--blue">Re-apply available from {formatDate(reapply.availableAt)}</span>
        ) : null}
        {wallet?.balance > 0 && <WithdrawBlock wallet={wallet} withdrawals={withdrawals} wForm={wForm} setWForm={setWForm} reload={load} />}
      </div>
    )
  }

  /* ---------- STATES 2 & 3: IN_PROGRESS / ACTIVE — full dashboard ---------- */
  const hasWindow = !!target
  const endsAt = hasWindow && target.endsAt ? new Date(target.endsAt).getTime() : null
  const msLeft = endsAt ? Math.max(0, endsAt - now) : 0
  const d = Math.floor(msLeft / 86_400_000)
  const h = Math.floor((msLeft % 86_400_000) / 3_600_000)
  const m = Math.floor((msLeft % 3_600_000) / 60_000)
  const countdown = msLeft > 0 ? `${d}d ${h}h ${m}m` : 'Window closed'
  const isActive = profile.status === 'active'

  const STATUS_TONE = isActive
    ? { badge: 'badge--green', label: 'Active volunteer' }
    : { badge: 'badge--saffron', label: 'Challenge in progress' }

  const dn = target?.donations
  const pr = target?.products          // { referred, required, percent, sold } | { sold }
  const pct = dn?.percent ?? 0

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon="rupee" label="Donations referred" value={formatINR(dn?.referred ?? 0)}
          color="var(--green)" sub={`of ${formatINR(dn?.required ?? 0)} target`} />
        <StatCard icon="grid" label="Product sales referred" value={formatINR(pr?.referred ?? 0)}
          color="var(--blue)" sub={pr?.required > 0 ? `of ${formatINR(pr.required)} target` : `${pr?.sold ?? 0} items sold`} />
        <StatCard icon="clock" label="Time remaining" value={isActive ? '—' : countdown} color="var(--saffron)"
          sub={!isActive && hasWindow ? `Ends ${formatDate(target.endsAt)}` : isActive ? 'Activated' : undefined} />
        <StatCard icon="wallet" label="Wallet balance" value={formatINR(wallet?.balance ?? 0)} color="#a855f7"
          sub={commission?.earned > 0 ? `${formatINR(commission.earned)} earned` : undefined} />
      </div>

      <div className="card" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon.target width={19} height={19} style={{ color: 'var(--saffron)' }} />
            <h4>My activation target</h4>
            <span className={`badge ${STATUS_TONE.badge}`}>{STATUS_TONE.label}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--green-700)' }}>{pct}%</span>
        </div>
        <div style={{ padding: 22 }}>
          <p className="muted" style={{ fontSize: '.9rem', marginBottom: 12 }}>
            {isActive
              ? <>You hit your target — you're an active SVR volunteer. Keep sharing your links to keep earning <b>{commission.percent}%</b> on every donation.</>
              : <>Raise <b>{formatINR(dn?.required ?? 0)}</b> in donations through your link before the window closes.
                  Every donation counts, and <b>{commission.percent}%</b> is credited to your wallet instantly.</>}
          </p>
          <div style={{ height: 10, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden' }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: pct >= 100 ? 'var(--green)' : 'var(--saffron)', transition: 'width .6s cubic-bezier(.22,1,.36,1)' }} />
          </div>
          <div className="muted" style={{ fontSize: '.8rem', marginTop: 8 }}>
            {formatINR(dn?.referred ?? 0)} raised · {formatINR(dn?.remaining ?? 0)} to go
          </div>
          {/* product sales target */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="muted" style={{ fontSize: '.85rem' }}>
                Shop sales referred{pr?.required > 0 ? <> ({target.rule === 'both' ? 'both targets required' : 'either target activates'})</> : ' (no target set)'}
              </span>
              {pr?.required > 0 && (
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--blue)' }}>{pr.percent}%</span>
              )}
            </div>
            <div style={{ height: 10, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${pr?.percent ?? 0}%`, height: '100%', borderRadius: 99, background: 'var(--blue)', transition: 'width .6s cubic-bezier(.22,1,.36,1)' }} />
            </div>
            <div className="muted" style={{ fontSize: '.8rem', marginTop: 8 }}>
              {pr?.required > 0
                ? <>{formatINR(pr.referred)} of {formatINR(pr.required)} · share your shop link to sell products</>
                : <>{formatINR(pr?.referred ?? 0)} in sales · {pr?.sold ?? 0} items via your shop link</>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h4 style={{ marginBottom: 6 }}>Your referral links</h4>
          <p className="muted" style={{ fontSize: '.9rem', marginBottom: 14 }}>
            Application ID <b style={{ letterSpacing: '.06em' }}>{profile.applicationId}</b>. Donations and orders through these links count toward your target.
          </p>
          <div className="field"><label>Donation link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" readOnly value={profile.donateLink} />
              <button className="btn btn--ghost" onClick={() => copy('donate', profile.donateLink)}>{copied === 'donate' ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
          <div className="field"><label>Shop link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" readOnly value={profile.shopLink} />
              <button className="btn btn--ghost" onClick={() => copy('shop', profile.shopLink)}>{copied === 'shop' ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
          <div className="field"><label>Invite / signup link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" readOnly value={profile.signupLink} />
              <button className="btn btn--ghost" onClick={() => copy('signup', profile.signupLink)}>{copied === 'signup' ? 'Copied!' : 'Copy'}</button>
            </div>
            <span className="field__hint">New accounts created via this link are linked to you.</span>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h4 style={{ marginBottom: 6 }}>My availability</h4>
          <p className="muted" style={{ fontSize: '.9rem', marginBottom: 14 }}>Let the SVR team know if you're available for activities.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`badge ${profile.availability === 'available' ? 'badge--green' : ''}`}>
              {profile.availability === 'available' ? 'Available' : 'Unavailable'}
            </span>
            <button className="btn btn--ghost btn--sm" disabled={busy} onClick={toggleAvailability}>
              {busy ? '…' : profile.availability === 'available' ? 'Set unavailable' : 'Set available'}
            </button>
          </div>
          {isActive && (
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, marginTop: 16 }}>
              <span className="badge badge--green"><Icon.checkCircle width={13} height={13} /> Active SVR volunteer</span>
            </div>
          )}
        </div>
      </div>

      {/* withdrawal */}
      <WithdrawBlock wallet={wallet} withdrawals={withdrawals} wForm={wForm} setWForm={setWForm} reload={load} />

      {/* wallet activity */}
      <div className="card" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Wallet activity</h4></div>
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {wallet?.transactions?.length ? wallet.transactions.map((t, i) => (
            <div key={i} className="donor-row" style={{ padding: '12px 22px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '.9rem' }}>{t.description}</div>
                <div className="muted" style={{ fontSize: '.78rem' }}>{formatDate(t.date)}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: t.amount >= 0 ? 'var(--green-700)' : 'var(--ink)' }}>
                {t.amount >= 0 ? '+' : '−'}{formatINR(Math.abs(t.amount))}
              </div>
            </div>
          )) : <p className="muted" style={{ padding: 22, fontSize: '.9rem' }}>No wallet activity yet. You earn {commission?.percent ?? 10}% of every donation referred.</p>}
        </div>
      </div>
    </>
  )
}

/* Withdrawal request + history block, shared by active and rejected views. */
function WithdrawBlock({ wallet, withdrawals, wForm, setWForm, reload }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const balance = wallet?.balance ?? 0

  function open() { setErr(''); setWForm({ amount: '', method: 'upi', upiId: '', accountName: '', accountNumber: '', ifsc: '' }) }
  const set = (k, v) => setWForm((f) => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await api.requestWithdrawal({
        amount: Number(wForm.amount),
        method: wForm.method,
        ...(wForm.method === 'upi'
          ? { upiId: wForm.upiId }
          : { accountName: wForm.accountName, accountNumber: wForm.accountNumber, ifsc: wForm.ifsc }),
      })
      setWForm(null)
      await reload()
    } catch (e2) { setErr(e2.message) }
    finally { setBusy(false) }
  }

  const badge = { pending: 'badge--saffron', paid: 'badge--green', rejected: 'badge' }

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h4>Withdraw earnings</h4>
          <p className="muted" style={{ fontSize: '.88rem', marginTop: 4 }}>Available balance: <b>{formatINR(balance)}</b></p>
        </div>
        {!wForm && <button className="btn btn--primary btn--sm" disabled={balance <= 0} onClick={open}>Request withdrawal</button>}
      </div>

      {wForm && (
        <form onSubmit={submit} style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <div className="row-2">
            <div className="field"><label>Amount (₹)</label>
              <input className="input" type="number" min="1" max={balance} value={wForm.amount} onChange={(e) => set('amount', e.target.value)} /></div>
            <div className="field"><label>Method</label>
              <select className="select" value={wForm.method} onChange={(e) => set('method', e.target.value)}>
                <option value="upi">UPI</option>
                <option value="bank">Bank account</option>
              </select></div>
          </div>
          {wForm.method === 'upi' ? (
            <div className="field"><label>UPI ID</label>
              <input className="input" value={wForm.upiId} onChange={(e) => set('upiId', e.target.value)} placeholder="name@bank" /></div>
          ) : (
            <>
              <div className="field"><label>Account holder name</label>
                <input className="input" value={wForm.accountName} onChange={(e) => set('accountName', e.target.value)} /></div>
              <div className="row-2">
                <div className="field"><label>Account number</label>
                  <input className="input" value={wForm.accountNumber} onChange={(e) => set('accountNumber', e.target.value)} /></div>
                <div className="field"><label>IFSC</label>
                  <input className="input" value={wForm.ifsc} onChange={(e) => set('ifsc', e.target.value.toUpperCase())} /></div>
              </div>
            </>
          )}
          {err && <div className="field__err" style={{ marginBottom: 10 }}>{err}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--primary btn--sm" disabled={busy}>{busy ? 'Submitting…' : 'Submit request'}</button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setWForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {withdrawals?.length > 0 && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          {withdrawals.map((w) => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '.88rem' }}>
              <span>{formatINR(w.amount)} · {w.method.toUpperCase()} · <span className="muted">{formatDate(w.requestedAt)}</span></span>
              <span className={`badge ${badge[w.status] || 'badge'}`}>{w.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =====================================================================
   INTERN — profile from GET /api/intern/dashboard.
===================================================================== */
function InternProfile() {
  const [data, setData] = useState(null)
  useEffect(() => { api.internDashboard().then(setData).catch(() => setData({ profile: null })) }, [])

  if (!data) return <p className="muted">Loading your profile…</p>
  const p = data.profile
  if (!p) return <p className="muted" style={{ marginBottom: 24 }}>No intern profile found for this account.</p>

  return (
    <div className="grid grid-4" style={{ marginBottom: 24 }}>
      <StatCard icon="award" label="Internship" value={p.internshipTitle || '—'} sub={p.track ? `Track: ${p.track}` : undefined} />
      <StatCard icon="clock" label="Duration" value={p.duration || '—'} color="var(--blue)" />
      <StatCard icon="star" label="Location" value={p.location || '—'} color="var(--green)" />
      <StatCard icon="checkCircle" label="Status" value={p.status} color="#a855f7" sub={p.approvedAt ? `Approved ${formatDate(p.approvedAt)}` : undefined} />
    </div>
  )
}

/* =====================================================================
   WALLET & REFERRALS — GET /api/wallet + /api/wallet/referrals.
===================================================================== */
function WalletReferral() {
  const [wallet, setWallet] = useState(null)
  const [ref, setRef] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.getWallet().then(setWallet).catch(() => {})
    api.getReferrals().then(setRef).catch(() => {})
  }, [])

  const donateLink = ref ? `${window.location.origin}/donate?ref=${ref.referralCode}` : ''
  const shopLink = ref ? `${window.location.origin}/store?ref=${ref.referralCode}` : ''
  function copy(which) {
    const link = which === 'shop' ? shopLink : donateLink
    navigator.clipboard?.writeText(link)
    setCopied(which); setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon="wallet" label="Coin balance" value={wallet ? `${wallet.balance}` : '—'} sub="1 coin = ₹1" />
        <StatCard icon="users" label="Friends referred" value={ref ? ref.totalReferred : '—'} color="var(--blue)" />
        <StatCard icon="checkCircle" label="Rewarded referrals" value={ref ? ref.rewarded : '—'} color="var(--green)" />
        <StatCard icon="star" label="Coins earned (referrals)" value={ref ? ref.totalEarned : '—'} color="var(--saffron)" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h4 style={{ marginBottom: 6 }}>Refer &amp; earn coins</h4>
          <p className="muted" style={{ fontSize: '.9rem', marginBottom: 14 }}>
            Share your code. When a friend makes their first donation through it, you earn <b>10%</b> and they earn <b>5%</b> of it as coins.
          </p>
          <div className="field"><label>Your referral code</label>
            <input className="input" readOnly value={ref?.referralCode || '…'} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.1em' }} />
          </div>
          <div className="field"><label>Donation link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" readOnly value={donateLink} />
              <button className="btn btn--ghost" onClick={() => copy('donate')}>{copied === 'donate' ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
          <div className="field"><label>Shop link</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" readOnly value={shopLink} />
              <button className="btn btn--ghost" onClick={() => copy('shop')}>{copied === 'shop' ? 'Copied!' : 'Copy'}</button>
            </div>
            <span className="field__hint">Share to earn on donations and shop orders made through your links.</span>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Wallet activity</h4></div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {wallet?.transactions?.length ? wallet.transactions.map((t) => (
              <div key={t.id} className="donor-row" style={{ padding: '12px 22px' }}>
                <div className="donor-row__av" style={{ background: t.type === 'credit' ? 'var(--green-50)' : 'var(--saffron-50)', color: t.type === 'credit' ? 'var(--green-700)' : 'var(--saffron-700)' }}>
                  {t.type === 'credit' ? '+' : '−'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '.9rem' }}>{txnLabel(t.reason)}</div>
                  <div className="muted" style={{ fontSize: '.78rem' }}>{formatDate(t.createdAt)}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: t.type === 'credit' ? 'var(--green-700)' : 'var(--ink)' }}>
                  {t.type === 'credit' ? '+' : '−'}{t.amount}
                </div>
              </div>
            )) : <p className="muted" style={{ padding: 22, fontSize: '.9rem' }}>No coin activity yet. Refer a friend to start earning.</p>}
          </div>
        </div>
      </div>

      {ref?.referrals?.length > 0 && (
        <div className="card" style={{ padding: 0, marginBottom: 24 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Your referrals</h4></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dtable">
              <thead><tr><th>Name</th><th>Joined</th><th>Status</th><th>Coins earned</th></tr></thead>
              <tbody>
                {ref.referrals.map((r, i) => (
                  <tr key={i}>
                    <td><b>{r.name}</b></td>
                    <td className="muted">{formatDate(r.joinedAt)}</td>
                    <td><span className={`badge ${r.status === 'rewarded' ? 'badge--green' : 'badge--blue'}`}>{r.status === 'rewarded' ? 'Rewarded' : 'Pending first donation'}</span></td>
                    <td><b>{r.coins}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

function txnLabel(reason) {
  return {
    referral_earned: 'Referral reward (your invite donated)',
    referral_bonus: 'Welcome bonus (first donation)',
    commission: 'Volunteer commission',
    redeem_shop: 'Redeemed at shop',
    redeem_donation: 'Redeemed on donation',
    admin_adjust: 'Adjustment by SVR',
    withdrawal: 'Withdrawal',
  }[reason] || reason
}

/* =====================================================================
   DONOR — contribution summary & history (GET /api/donations/me).
===================================================================== */
function DonorView() {
  const [donations, setDonations] = useState(null)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    api.myDonations().then(setDonations).catch(() => setDonations([]))
    api.myOrders().then(setOrders).catch(() => {})
  }, [])

  if (!donations) return <p className="muted">Loading your contributions…</p>

  const totalAmount = donations.reduce((s, d) => s + (d.amount || 0), 0)
  const categories = [...new Set(donations.map((d) => d.causeTitle))]
  const sorted = donations.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const last = sorted[0]
  const recent = sorted.slice(0, 5)

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon="heart" label="Total donations made" value={donations.length} sub={last ? `Last on ${formatDate(last.createdAt)}` : undefined} />
        <StatCard icon="rupee" label="Total donation amount" value={formatINR(totalAmount)} color="var(--green)" />
        <StatCard icon="leaf" label="Causes supported" value={categories.length} color="var(--blue)" sub={categories.slice(0, 2).join(', ') || undefined} />
        <StatCard icon="chart" label="Average donation" value={donations.length ? formatINR(Math.round(totalAmount / donations.length)) : '—'} color="#a855f7" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Donation history</h4></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dtable">
              <thead><tr><th>Date</th><th>Cause</th><th>Amount</th><th>Receipt</th></tr></thead>
              <tbody>
                {donations.length ? sorted.map((d) => (
                  <tr key={d.id}>
                    <td className="muted">{formatDate(d.createdAt)}</td>
                    <td><b>{d.causeTitle}</b></td>
                    <td><b>{formatINR(d.amount)}</b></td>
                    <td className="muted">{d.receiptNo}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="muted" style={{ padding: 18 }}>No donations yet. <Link to="/donate">Donate now</Link></td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Recent donation activity</h4></div>
          <div style={{ padding: '8px 0' }}>
            {recent.length ? recent.map((d) => (
              <div key={d.id} className="donor-row" style={{ padding: '12px 22px' }}>
                <div className="donor-row__av" style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}><Icon.heart width={16} height={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '.9rem' }}>Donated to {d.causeTitle}</div>
                  <div className="muted" style={{ fontSize: '.78rem' }}>{formatDate(d.createdAt)}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green-700)' }}>{formatINR(d.amount)}</div>
              </div>
            )) : <p className="muted" style={{ padding: 22, fontSize: '.9rem' }}>Your donation activity will appear here.</p>}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}><h4>Shop orders</h4></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.length ? orders.map((o) => (
                <tr key={o.id}><td><b>#{String(o.id).slice(-6).toUpperCase()}</b></td><td>{o.items.length}</td><td>{formatINR(o.total)}</td><td><span className="badge badge--green">{o.status}</span></td></tr>
              )) : <tr><td colSpan={4} className="muted" style={{ padding: 18 }}>No orders yet. <Link to="/store">Visit the shop</Link></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   TASKS — GET /api/tasks/mine + PATCH /api/tasks/:id/status.
   Shared by volunteers and interns.
===================================================================== */
function MyTasks() {
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(null)
  const load = () => api.myTasks().then(setData).catch(() => setData({ tasks: [], profile: {} }))
  useEffect(() => { load() }, [])

  async function advance(task) {
    const next = NEXT_STATUS[task.status]
    if (!next) return
    setBusy(task.id)
    try { await api.updateTaskStatus(task.id, next); await load() }
    catch (e) { alert(e.message) }
    finally { setBusy(null) }
  }

  if (!data) return <p className="muted">Loading your tasks…</p>
  const profile = data.profile?.volunteer || data.profile?.intern
  const tasks = data.tasks || []

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h4>My assigned tasks &amp; deadlines</h4>
        {profile && <span className="badge badge--green">{profile.status}</span>}
      </div>
      {!profile ? (
        <p className="muted" style={{ padding: 22 }}>
          No volunteer/intern profile linked to your account yet. Apply via the <Link to="/volunteer">Volunteer</Link> or <Link to="/internship">Internship</Link> page, then the admin will assign your tasks.
        </p>
      ) : tasks.length === 0 ? (
        <p className="muted" style={{ padding: 22 }}>No tasks assigned yet. Your coordinator will add them here.</p>
      ) : (
        <div style={{ padding: 12 }}>
          {tasks.map((t) => {
            const overdue = t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed'
            return (
              <div key={t.id} className="card" style={{ padding: 18, marginBottom: 10, borderColor: overdue ? '#fca5a5' : 'var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge ${STATUS_BADGE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                      {t.role && <span className="badge">{t.role}</span>}
                      {overdue && <span className="badge" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#b91c1c' }}>Overdue</span>}
                    </div>
                    <h4 style={{ fontSize: '1.08rem', margin: '8px 0 4px' }}>{t.title}</h4>
                    {t.description && <p className="muted" style={{ fontSize: '.9rem' }}>{t.description}</p>}
                    {t.deadline && <div style={{ fontSize: '.84rem', color: overdue ? '#b91c1c' : 'var(--muted)', marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}><Icon.clock width={15} height={15} /> Due {formatDate(t.deadline)}</div>}
                  </div>
                  {t.status !== 'completed' && (
                    <button className="btn btn--primary btn--sm" disabled={busy === t.id} onClick={() => advance(t)}>
                      {busy === t.id ? '…' : t.status === 'assigned' ? 'Start' : t.status === 'in_progress' ? 'Submit' : 'Mark complete'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}