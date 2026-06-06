// =====================================================================
// Payment brand marks — lightweight stylized SVG chips in official
// brand colours so every payment option is instantly recognizable.
// (Simplified marks, not exact trademark artwork.)
// =====================================================================

const W = { width: 46, height: 28, viewBox: '0 0 46 28', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
const t = { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700 }

export const PayLogo = {
  /* ---------- UPI & apps ---------- */
  upi: (p) => (
    <svg {...W} {...p} aria-label="UPI">
      <path d="M28 4l7 10-7 10" fill="#F97316"/>
      <path d="M33 4l7 10-7 10" fill="#16A34A"/>
      <text x="3" y="19.5" style={{ ...t, fontSize: 12, fontStyle: 'italic' }} fill="#374151">UPI</text>
    </svg>
  ),
  gpay: (p) => (
    <svg {...W} {...p} aria-label="Google Pay">
      <circle cx="11" cy="14" r="8.5" fill="#fff" stroke="#e5e7eb"/>
      <path d="M11 5.5a8.5 8.5 0 0 1 7.6 4.7l-4.1 2A4 4 0 0 0 11 10Z" fill="#EA4335"/>
      <path d="M18.6 10.2A8.5 8.5 0 0 1 19.5 14c0 .7-.1 1.4-.3 2.1l-4.4-1.2c.1-.3.2-.6.2-.9 0-.6-.2-1.3-.5-1.8Z" fill="#4285F4"/>
      <path d="M19.2 16.1a8.5 8.5 0 0 1-5 5.6l-1.7-4.2a4 4 0 0 0 2.3-2.6Z" fill="#34A853"/>
      <path d="M14.2 21.7a8.5 8.5 0 0 1-11-4.6 8.5 8.5 0 0 1 .3-7l3.9 2.3a4 4 0 0 0 5.1 5.1Z" fill="#FBBC04"/>
      <text x="23" y="18.5" style={{ ...t, fontSize: 11 }} fill="#5f6368">Pay</text>
    </svg>
  ),
  phonepe: (p) => (
    <svg {...W} {...p} aria-label="PhonePe">
      <circle cx="14" cy="14" r="10" fill="#5F259F"/>
      <text x="14" y="18.6" textAnchor="middle" style={{ ...t, fontSize: 11.5 }} fill="#fff">पे</text>
      <text x="26.5" y="18" style={{ ...t, fontSize: 9 }} fill="#5F259F">Pe</text>
    </svg>
  ),
  paytm: (p) => (
    <svg {...W} {...p} aria-label="Paytm">
      <text x="3" y="18.8" style={{ ...t, fontSize: 12.5 }} fill="#002E6E">pay</text>
      <text x="26" y="18.8" style={{ ...t, fontSize: 12.5 }} fill="#00B9F1">tm</text>
    </svg>
  ),
  bhim: (p) => (
    <svg {...W} {...p} aria-label="BHIM">
      <text x="4" y="18.8" style={{ ...t, fontSize: 12, fontStyle: 'italic' }} fill="#F97316">BH</text>
      <text x="22.5" y="18.8" style={{ ...t, fontSize: 12, fontStyle: 'italic' }} fill="#16A34A">IM</text>
    </svg>
  ),

  /* ---------- Card networks ---------- */
  visa: (p) => (
    <svg {...W} {...p} aria-label="Visa">
      <text x="5" y="19.5" style={{ ...t, fontSize: 14, fontStyle: 'italic', letterSpacing: '.5px' }} fill="#1A1F71">VISA</text>
    </svg>
  ),
  mastercard: (p) => (
    <svg {...W} {...p} aria-label="Mastercard">
      <circle cx="18" cy="14" r="9" fill="#EB001B"/>
      <circle cx="28" cy="14" r="9" fill="#F79E1B"/>
      <path d="M23 6.8a9 9 0 0 1 0 14.4 9 9 0 0 1 0-14.4Z" fill="#FF5F00"/>
    </svg>
  ),
  rupay: (p) => (
    <svg {...W} {...p} aria-label="RuPay">
      <text x="2" y="19" style={{ ...t, fontSize: 11.5, fontStyle: 'italic' }} fill="#1B3281">RuPay</text>
      <path d="M37 6l6 8-6 8z" fill="#F47920"/>
      <path d="M40.5 6l6 8-6 8z" fill="#2E7D32" opacity=".9"/>
    </svg>
  ),
  amex: (p) => (
    <svg {...W} {...p} aria-label="American Express">
      <rect x="4" y="5" width="38" height="18" rx="3" fill="#2E77BC"/>
      <text x="23" y="17.6" textAnchor="middle" style={{ ...t, fontSize: 8.5, letterSpacing: '.4px' }} fill="#fff">AMEX</text>
    </svg>
  ),

  /* ---------- Banks ---------- */
  sbi: (p) => (
    <svg {...W} {...p} aria-label="State Bank of India">
      <circle cx="14" cy="14" r="9.5" fill="#2D6CB5"/>
      <circle cx="14" cy="11.5" r="3.4" fill="#fff"/>
      <rect x="12.7" y="11.5" width="2.6" height="8" rx="1.2" fill="#fff"/>
      <text x="26" y="18.4" style={{ ...t, fontSize: 10 }} fill="#2D6CB5">SBI</text>
    </svg>
  ),
  hdfc: (p) => (
    <svg {...W} {...p} aria-label="HDFC Bank">
      <rect x="5" y="5" width="18" height="18" fill="#ED232A"/>
      <rect x="9" y="9" width="10" height="10" fill="#fff"/>
      <rect x="12" y="12" width="4" height="4" fill="#004C8F"/>
      <text x="26" y="18.4" style={{ ...t, fontSize: 8.4 }} fill="#004C8F">HDFC</text>
    </svg>
  ),
  icici: (p) => (
    <svg {...W} {...p} aria-label="ICICI Bank">
      <path d="M14 4c4.5 0 7.5 4.4 7.5 10S18.5 24 14 24 6.5 19.6 6.5 14 9.5 4 14 4Z" fill="#F58220" opacity=".9"/>
      <path d="M14 7.5c2.7 0 4.5 2.9 4.5 6.5s-1.8 6.5-4.5 6.5S9.5 17.6 9.5 14s1.8-6.5 4.5-6.5Z" fill="#fff"/>
      <text x="24" y="18.2" style={{ ...t, fontSize: 7.8 }} fill="#B02A30">ICICI</text>
    </svg>
  ),
  axis: (p) => (
    <svg {...W} {...p} aria-label="Axis Bank">
      <path d="M14 5l8 16h-4.4L14 13.4 10.4 21H6Z" fill="#97144D"/>
      <text x="25" y="18.4" style={{ ...t, fontSize: 8.4 }} fill="#97144D">AXIS</text>
    </svg>
  ),

  /* ---------- Wallets ---------- */
  amazonpay: (p) => (
    <svg {...W} {...p} aria-label="Amazon Pay">
      <text x="4" y="15" style={{ ...t, fontSize: 9.5 }} fill="#232F3E">amazon</text>
      <text x="4" y="24" style={{ ...t, fontSize: 8.5 }} fill="#232F3E">pay</text>
      <path d="M22 19c4 2.6 12 2.4 17-.6" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M39 16.5l1.6 2-2.5.4" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  paytmwallet: (p) => (
    <svg {...W} {...p} aria-label="Paytm Wallet">
      <rect x="4" y="7" width="20" height="14" rx="3" fill="#00B9F1"/>
      <rect x="17" y="11.5" width="7" height="5" rx="2" fill="#002E6E"/>
      <text x="27" y="13.5" style={{ ...t, fontSize: 7.4 }} fill="#002E6E">pay</text>
      <text x="27" y="21.5" style={{ ...t, fontSize: 7.4 }} fill="#00B9F1">tm</text>
    </svg>
  ),
}

/** Detect card network from the number prefix (for inline brand hint). */
export function detectCardBrand(num = '') {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^(60|65|81|82|508)/.test(n)) return 'rupay'
  if (/^3[47]/.test(n)) return 'amex'
  return null
}
