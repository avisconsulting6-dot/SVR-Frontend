import { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ============================================================
   SVR Educational Society — Volunteer Dashboard
   Consumes: GET /api/volunteer/profile  (see DEMO_PROFILE shape)
   - Live countdown to target window end
   - Donation target progress ring
   - Referral link sharing (donate + shop) with copy feedback
   - Wallet balance + transaction ledger
   - Status handling: pending / approved / rejected (+ reapply)
   - Demo-data fallback for static deploys & client demos
   ============================================================ */

const API_BASE = import.meta?.env?.VITE_API_URL || "";
const PROFILE_ENDPOINT = `${API_BASE}/api/volunteer/profile`;

const DEMO_PROFILE = {
  success: true,
  profile: {
    applicationId: "VOL-K9KTBANZ",
    status: "pending",
    referredBy: "SVR-COMPANY",
    donateLink: "http://localhost:5173/donate?ref=VOL-K9KTBANZ",
    shopLink: "http://localhost:5173/shop?ref=VOL-K9KTBANZ",
  },
  target: {
    startedAt: "2026-06-04T13:43:27.811Z",
    endsAt: "2026-06-07T13:43:27.811Z",
    msRemaining: 250132952,
    donations: { referred: 0, required: 5000, remaining: 5000, percent: 0 },
    products: { sold: 0 },
  },
  payout: { rejectionPayoutPercent: 20, earned: 0 },
  wallet: {
    balance: 150,
    transactions: [
      {
        type: "referral_reward",
        amount: 150,
        description: "Referral reward — Suresh Kumar's first donation",
        date: "2026-06-04T13:44:38.139Z",
      },
    ],
  },
  reapply: null,
};

/* ---------- helpers ---------- */

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const splitMs = (ms) => {
  const clamped = Math.max(0, ms);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped % 86400000) / 3600000),
    minutes: Math.floor((clamped % 3600000) / 60000),
    seconds: Math.floor((clamped % 60000) / 1000),
    expired: clamped <= 0,
  };
};

const TXN_META = {
  referral_reward: { label: "Referral Reward", icon: "🪙" },
  donation_bonus: { label: "Donation Bonus", icon: "🎁" },
  payout: { label: "Payout", icon: "🏦" },
  redemption: { label: "Redemption", icon: "🛍️" },
  adjustment: { label: "Adjustment", icon: "⚙️" },
};

const STATUS_META = {
  pending: {
    label: "Pending Review",
    color: "#b45309",
    bg: "#fef3c7",
    note: "Hit your donation target before the deadline to be approved as a volunteer.",
  },
  approved: {
    label: "Approved Volunteer",
    color: "#166534",
    bg: "#dcfce7",
    note: "Congratulations — you are an approved SVR volunteer.",
  },
  rejected: {
    label: "Not Approved",
    color: "#991b1b",
    bg: "#fee2e2",
    note: "Your target window has ended. A partial payout has been credited.",
  },
};

/* ---------- countdown hook ---------- */

function useCountdown(endsAt) {
  const [ms, setMs] = useState(() =>
    endsAt ? new Date(endsAt).getTime() - Date.now() : 0
  );
  useEffect(() => {
    if (!endsAt) return;
    const tick = () => setMs(new Date(endsAt).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return splitMs(ms);
}

/* ---------- small components ---------- */

function ProgressRing({ percent = 0, size = 168 }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Target progress ${p}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e9e2d4" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#svrGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * p) / 100}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.22,1,.36,1)" }}
      />
      <defs>
        <linearGradient id="svrGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e6b4a" />
          <stop offset="100%" stopColor="#e8862e" />
        </linearGradient>
      </defs>
      <text x="50%" y="46%" textAnchor="middle" fontSize={size * 0.2} fontWeight="800" fill="#16302b" fontFamily="inherit">
        {p}%
      </text>
      <text x="50%" y="62%" textAnchor="middle" fontSize={size * 0.075} fill="#6b7a72" letterSpacing="1.5">
        OF TARGET
      </text>
    </svg>
  );
}

function CountdownUnit({ value, label }) {
  return (
    <div className="vd-count-unit">
      <span className="vd-count-num">{String(value).padStart(2, "0")}</span>
      <span className="vd-count-label">{label}</span>
    </div>
  );
}

function ShareLink({ title, hint, url }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }, [url]);

  const share = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      copy();
    }
  }, [title, url, copy]);

  return (
    <div className="vd-sharelink">
      <div className="vd-sharelink-head">
        <span className="vd-sharelink-title">{title}</span>
        <span className="vd-sharelink-hint">{hint}</span>
      </div>
      <div className="vd-sharelink-row">
        <code className="vd-sharelink-url" title={url}>{url}</code>
        <button className={`vd-btn vd-btn-copy ${copied ? "is-copied" : ""}`} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <button className="vd-btn vd-btn-share" onClick={share}>Share</button>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */

export default function VolunteerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = localStorage.getItem("svr_volunteer_token");
        const res = await fetch(PROFILE_ENDPOINT, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error("API returned failure");
        if (alive) setData(json);
      } catch {
        // Demo-data fallback for static deploys / client presentations
        if (alive) {
          setData(DEMO_PROFILE);
          setIsDemo(true);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const profile = data?.profile;
  const target = data?.target;
  const wallet = data?.wallet;
  const payout = data?.payout;
  const reapply = data?.reapply;

  const countdown = useCountdown(target?.endsAt);
  const status = STATUS_META[profile?.status] || STATUS_META.pending;

  const donationStats = useMemo(() => {
    const d = target?.donations || {};
    return [
      { label: "Raised via your link", value: inr(d.referred) },
      { label: "Target", value: inr(d.required) },
      { label: "Remaining", value: inr(d.remaining) },
      { label: "Products sold", value: target?.products?.sold ?? 0 },
    ];
  }, [target]);

  if (loading) {
    return (
      <div className="vd-root">
        <Style />
        <div className="vd-loading">
          <div className="vd-spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vd-root">
      <Style />

      {/* ===== Header ===== */}
      <header className="vd-header">
        <div>
          <p className="vd-eyebrow">SVR Educational Society · Volunteer Programme</p>
          <h1 className="vd-title">Volunteer Dashboard</h1>
          <div className="vd-meta-row">
            <span className="vd-chip vd-chip-id">ID&nbsp;<strong>{profile.applicationId}</strong></span>
            <span className="vd-chip" style={{ color: status.color, background: status.bg }}>
              ● {status.label}
            </span>
            {profile.referredBy && (
              <span className="vd-chip vd-chip-soft">Referred by {profile.referredBy}</span>
            )}
            {isDemo && <span className="vd-chip vd-chip-demo">Demo data</span>}
          </div>
        </div>
        <div className="vd-wallet-pill">
          <span className="vd-wallet-icon">🪙</span>
          <div>
            <span className="vd-wallet-balance">{wallet.balance}</span>
            <span className="vd-wallet-label">SVR Coins</span>
          </div>
        </div>
      </header>

      <p className="vd-status-note">{status.note}</p>

      {/* ===== Reapply banner (shown only when API sends reapply info) ===== */}
      {reapply && (
        <div className="vd-reapply">
          <strong>Want another shot?</strong>
          <span>{reapply.message || "You're eligible to reapply for the volunteer programme."}</span>
          <button className="vd-btn vd-btn-primary">Reapply Now</button>
        </div>
      )}

      {/* ===== Main grid ===== */}
      <div className="vd-grid">
        {/* Target progress */}
        <section className="vd-card vd-card-target">
          <h2 className="vd-card-title">Donation Target</h2>
          <div className="vd-target-body">
            <ProgressRing percent={target.donations.percent} />
            <div className="vd-target-stats">
              {donationStats.map((s) => (
                <div key={s.label} className="vd-stat">
                  <span className="vd-stat-value">{s.value}</span>
                  <span className="vd-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="vd-window">
            Window: {fmtDate(target.startedAt)} → {fmtDate(target.endsAt)}
          </div>
        </section>

        {/* Countdown */}
        <section className={`vd-card vd-card-count ${countdown.expired ? "is-expired" : ""}`}>
          <h2 className="vd-card-title vd-card-title-light">
            {countdown.expired ? "Target Window Ended" : "Time Remaining"}
          </h2>
          {countdown.expired ? (
            <p className="vd-expired-text">
              Your 3-day window has closed. {payout.rejectionPayoutPercent}% of referred
              donations ({inr(payout.earned)}) will be credited as payout.
            </p>
          ) : (
            <div className="vd-count-row">
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="vd-count-sep">:</span>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <span className="vd-count-sep">:</span>
              <CountdownUnit value={countdown.minutes} label="Mins" />
              <span className="vd-count-sep">:</span>
              <CountdownUnit value={countdown.seconds} label="Secs" />
            </div>
          )}
          <div className="vd-payout-line">
            <span>Earned so far</span>
            <strong>{inr(payout.earned)}</strong>
          </div>
          <p className="vd-payout-fine">
            If the target isn't met, {payout.rejectionPayoutPercent}% of donations referred
            by you is still paid out to you.
          </p>
        </section>

        {/* Share links */}
        <section className="vd-card vd-card-share">
          <h2 className="vd-card-title">Your Referral Links</h2>
          <p className="vd-card-sub">
            Every donation or shop purchase made through these links counts toward your target.
          </p>
          <ShareLink
            title="Donate Link"
            hint="Counts toward your ₹ target"
            url={profile.donateLink}
          />
          <ShareLink
            title="Shop Link"
            hint="Product sales credited to you"
            url={profile.shopLink}
          />
        </section>

        {/* Wallet */}
        <section className="vd-card vd-card-wallet">
          <h2 className="vd-card-title">Coin Wallet</h2>
          <p className="vd-card-sub">
            Rewards earned from referrals. Redeemable in the SVR shop.
          </p>
          <ul className="vd-txn-list">
            {wallet.transactions.length === 0 && (
              <li className="vd-txn-empty">No transactions yet — share your links to start earning.</li>
            )}
            {wallet.transactions.map((t, i) => {
              const meta = TXN_META[t.type] || { label: t.type, icon: "•" };
              return (
                <li key={i} className="vd-txn">
                  <span className="vd-txn-icon">{meta.icon}</span>
                  <div className="vd-txn-body">
                    <span className="vd-txn-desc">{t.description}</span>
                    <span className="vd-txn-date">{fmtDate(t.date)} · {meta.label}</span>
                  </div>
                  <span className={`vd-txn-amt ${t.amount >= 0 ? "is-credit" : "is-debit"}`}>
                    {t.amount >= 0 ? "+" : ""}{t.amount}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ---------- styles (scoped, self-contained) ---------- */

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Albert+Sans:wght@400;500;600;700;800&display=swap');

      .vd-root {
        --green: #0e6b4a;
        --green-deep: #16302b;
        --saffron: #e8862e;
        --cream: #faf6ec;
        --card: #ffffff;
        --ink: #1f2a26;
        --muted: #6b7a72;
        --line: #e9e2d4;
        font-family: 'Albert Sans', sans-serif;
        background:
          radial-gradient(1100px 500px at 85% -10%, #efe6cf 0%, transparent 60%),
          var(--cream);
        color: var(--ink);
        min-height: 100vh;
        padding: clamp(16px, 4vw, 44px);
        box-sizing: border-box;
      }
      .vd-root *, .vd-root *::before, .vd-root *::after { box-sizing: border-box; }

      /* header */
      .vd-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
      .vd-eyebrow { margin: 0 0 6px; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--green); font-weight: 700; }
      .vd-title { margin: 0 0 12px; font-family: 'Fraunces', serif; font-weight: 800; font-size: clamp(28px, 4.5vw, 44px); color: var(--green-deep); letter-spacing: -0.5px; }
      .vd-meta-row { display: flex; gap: 8px; flex-wrap: wrap; }
      .vd-chip { font-size: 12.5px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line); }
      .vd-chip-id strong { font-family: ui-monospace, monospace; }
      .vd-chip-soft { color: var(--muted); }
      .vd-chip-demo { background: #1f2a26; color: #ffd98a; border-color: #1f2a26; }

      .vd-wallet-pill { display: flex; align-items: center; gap: 12px; background: var(--green-deep); color: #fff; padding: 14px 22px; border-radius: 18px; box-shadow: 0 12px 28px -12px rgba(22,48,43,.45); }
      .vd-wallet-icon { font-size: 26px; }
      .vd-wallet-balance { display: block; font-family: 'Fraunces', serif; font-size: 26px; font-weight: 800; line-height: 1; }
      .vd-wallet-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; opacity: .75; }

      .vd-status-note { margin: 14px 0 24px; color: var(--muted); max-width: 640px; }

      /* reapply */
      .vd-reapply { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: #fff7ed; border: 1px dashed var(--saffron); padding: 14px 18px; border-radius: 14px; margin-bottom: 22px; }

      /* grid */
      .vd-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; }
      .vd-card { background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: clamp(18px, 2.5vw, 28px); box-shadow: 0 10px 30px -22px rgba(31,42,38,.35); animation: vdRise .5s cubic-bezier(.22,1,.36,1) both; }
      .vd-card-target { grid-column: span 7; animation-delay: .05s; }
      .vd-card-count  { grid-column: span 5; background: linear-gradient(150deg, #103a2e, var(--green-deep)); color: #f3efe2; border: none; animation-delay: .12s; }
      .vd-card-share  { grid-column: span 7; animation-delay: .19s; }
      .vd-card-wallet { grid-column: span 5; animation-delay: .26s; }
      @media (max-width: 900px) { .vd-card-target, .vd-card-count, .vd-card-share, .vd-card-wallet { grid-column: span 12; } }
      @keyframes vdRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

      .vd-card-title { margin: 0 0 6px; font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; color: var(--green-deep); }
      .vd-card-title-light { color: #f3efe2; }
      .vd-card-sub { margin: 0 0 18px; font-size: 14px; color: var(--muted); }

      /* target */
      .vd-target-body { display: flex; align-items: center; gap: clamp(16px, 3vw, 36px); flex-wrap: wrap; margin-top: 10px; }
      .vd-target-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 28px; flex: 1; min-width: 220px; }
      .vd-stat-value { display: block; font-family: 'Fraunces', serif; font-size: 22px; font-weight: 800; color: var(--green-deep); }
      .vd-stat-label { font-size: 12px; color: var(--muted); letter-spacing: .3px; }
      .vd-window { margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--line); font-size: 13px; color: var(--muted); }

      /* countdown */
      .vd-count-row { display: flex; align-items: center; gap: 8px; margin: 18px 0 22px; }
      .vd-count-unit { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 12px 0; text-align: center; flex: 1; }
      .vd-count-num { display: block; font-family: 'Fraunces', serif; font-size: clamp(24px, 3vw, 34px); font-weight: 800; font-variant-numeric: tabular-nums; }
      .vd-count-label { font-size: 10px; letter-spacing: 1.8px; text-transform: uppercase; opacity: .65; }
      .vd-count-sep { font-size: 22px; opacity: .4; }
      .vd-payout-line { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid rgba(255,255,255,.15); padding-top: 14px; font-size: 14px; }
      .vd-payout-line strong { font-family: 'Fraunces', serif; font-size: 20px; color: #ffd98a; }
      .vd-payout-fine { margin: 10px 0 0; font-size: 12.5px; opacity: .65; line-height: 1.5; }
      .vd-expired-text { margin: 16px 0 20px; line-height: 1.6; opacity: .9; }

      /* share links */
      .vd-sharelink { border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; margin-top: 12px; background: #fffdf8; }
      .vd-sharelink-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; gap: 10px; flex-wrap: wrap; }
      .vd-sharelink-title { font-weight: 700; font-size: 14.5px; color: var(--green-deep); }
      .vd-sharelink-hint { font-size: 12px; color: var(--muted); }
      .vd-sharelink-row { display: flex; gap: 8px; align-items: center; }
      .vd-sharelink-url { flex: 1; min-width: 0; font-size: 12.5px; background: #f3eee1; border-radius: 8px; padding: 9px 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #4a564f; }
      .vd-btn { font-family: inherit; font-weight: 700; font-size: 13px; border-radius: 9px; padding: 9px 14px; border: none; cursor: pointer; transition: transform .15s ease, background .2s ease; white-space: nowrap; }
      .vd-btn:active { transform: scale(.96); }
      .vd-btn-copy { background: var(--green-deep); color: #fff; }
      .vd-btn-copy.is-copied { background: var(--green); }
      .vd-btn-share { background: var(--saffron); color: #fff; }
      .vd-btn-primary { background: var(--saffron); color: #fff; margin-left: auto; }

      /* wallet txns */
      .vd-txn-list { list-style: none; margin: 0; padding: 0; }
      .vd-txn { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); }
      .vd-txn:last-child { border-bottom: none; }
      .vd-txn-icon { font-size: 20px; }
      .vd-txn-body { flex: 1; min-width: 0; }
      .vd-txn-desc { display: block; font-weight: 600; font-size: 14px; }
      .vd-txn-date { font-size: 12px; color: var(--muted); }
      .vd-txn-amt { font-family: 'Fraunces', serif; font-weight: 800; font-size: 17px; }
      .vd-txn-amt.is-credit { color: var(--green); }
      .vd-txn-amt.is-debit { color: #b3422e; }
      .vd-txn-empty { color: var(--muted); font-size: 14px; padding: 10px 0; }

      /* loading */
      .vd-loading { display: grid; place-items: center; gap: 14px; min-height: 50vh; color: var(--muted); }
      .vd-spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--green); animation: vdSpin .8s linear infinite; }
      @keyframes vdSpin { to { transform: rotate(360deg); } }
    `}</style>
  );
}