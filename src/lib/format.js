// Indian number system formatting (lakh / crore grouping)

export function formatINR(amount, { paise = false } = {}) {
  if (amount == null || isNaN(amount)) return '₹0'
  const fmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: paise ? 2 : 0,
    maximumFractionDigits: paise ? 2 : 0,
  })
  return fmt.format(amount)
}

// Short Indian form: 1,25,00,000 -> "₹1.25 Cr", 50,00,000 -> "₹50 L"
export function formatINRShort(amount) {
  if (amount == null || isNaN(amount)) return '₹0'
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(amount % 1e7 === 0 ? 0 : 2)} Cr`
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(amount % 1e5 === 0 ? 0 : 1)} L`
  if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(0)} K`
  return formatINR(amount)
}

export function formatNumberIN(n) {
  if (n == null || isNaN(n)) return '0'
  return new Intl.NumberFormat('en-IN').format(n)
}

export function pct(raised, goal) {
  if (!goal) return 0
  return Math.min(100, Math.round((raised / goal) * 100))
}

export function daysLeft(dateStr) {
  const end = new Date(dateStr).getTime()
  const diff = Math.ceil((end - Date.now()) / 86400000)
  return diff > 0 ? diff : 0
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function maskPhone(p) {
  return p ? p.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2') : ''
}
