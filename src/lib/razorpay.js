/**
 * src/lib/razorpay.js — Razorpay checkout flow for donations.
 *
 * Usage from the Donate page:
 *   import { payAndDonate } from '../lib/razorpay'
 *   const result = await payAndDonate({ amount, name, email, phone, pan, causeId, ref })
 *   // result = { receiptNo, message, ... } on success; throws on failure/cancel
 */
import { api } from './api'

const BASE = import.meta.env.VITE_API_URL || ''

let scriptPromise = null

/** Load checkout.js once. */
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = resolve
      s.onerror = () => reject(new Error('Could not load the payment widget. Check your connection.'))
      document.body.appendChild(s)
    })
  }
  return scriptPromise
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data
}

/**
 * Full flow: create order -> open checkout -> verify -> donation recorded.
 * donor: { amount, name, email, phone, pan, causeId?, ref? }
 */
export async function payAndDonate(donor) {
  await loadRazorpayScript()

  // 1) create the order (validates donor fields server-side too)
  const order = await post('/api/donations/create-order', donor)

  // 2) open checkout; resolve/reject from its callbacks
  const payment = await new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,         // paise, from the server
      currency: order.currency,
      order_id: order.orderId,
      name: 'SVR Educational Society',
      description: 'Donation',
      prefill: { name: donor.name, email: donor.email, contact: donor.phone },
      theme: { color: '#16a34a' },
      handler: resolve,             // { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled.')),
      },
    })
    rzp.on('payment.failed', (resp) =>
      reject(new Error(resp?.error?.description || 'Payment failed. You were not charged.')))
    rzp.open()
  })

  // 3) verify on the server -> records donation, attribution, receipt email
  return post('/api/donations/verify', { ...donor, ...payment })
}

/** Direct (no-gateway) donation — used while Razorpay keys aren't configured. */
export function donateDirect(donor) {
  return api.donate(donor)
}