/**
 * src/lib/api.js — single API client for the SVR backend.
 *
 * - svr_token in localStorage, attached as Bearer on every request
 * - silent refresh on 401 TOKEN_EXPIRED (httpOnly cookie), then retry once
 * - public-page methods (causes/products/events/blogs/gallery) fail SOFT:
 *   they return empty data instead of crashing the page, so the site
 *   renders even while those backend routes are still being added
 */

// Same-origin by default: Vite's dev proxy (vite.config.js) and nginx in
// production both forward /api and /uploads to the backend. Set VITE_API_URL
// only if the API lives on a different domain.
const BASE = import.meta.env.VITE_API_URL || '';

/* ---------------- token helpers ---------------- */
export function getToken() {
  return localStorage.getItem('svr_token');
}
export function setToken(token) {
  if (token) localStorage.setItem('svr_token', token);
  else { localStorage.removeItem('svr_token'); localStorage.removeItem('svr_user'); }
}

/* ---------------- image helper (legacy export) ---------------- */

export function imgUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

/* ---------------- core request ---------------- */
let refreshing = null;

async function refreshAccessToken() {
  if (!refreshing) {
    refreshing = fetch(`${BASE}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error('refresh failed');
        const data = await r.json();
        setToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

async function request(path, { method = 'GET', body, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (res.status === 401 && data?.code === 'TOKEN_EXPIRED' && retry) {
    try {
      await refreshAccessToken();
      return request(path, { method, body, retry: false });
    } catch { setToken(null); }
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    throw err;
  }
  return data;
}

// soft variant for public pages: never throws, returns fallback
const soft = (promise, fallback) => promise.catch(() => fallback);

/* ================================================================== */

export const api = {
  /* ---------------- auth ---------------- */
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  async login(email, password) {
    const data = await request('/api/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.accessToken);
    return data;                      // { accessToken, user }
  },
  setPassword: (token, password) =>
    request('/api/auth/set-password', { method: 'POST', body: { token, password } }),
  me: () => request('/api/auth/me').then((d) => d.user),
  async logout() {
    try { await request('/api/auth/logout', { method: 'POST' }); } finally { setToken(null); }
  },

  /* ---------------- wallet & referrals (all roles) ---------------- */
  getWallet: () => request('/api/wallet'),
  getReferrals: () => request('/api/wallet/referrals'),

  /* ---------------- donor ---------------- */
  myDonations: () =>
    request('/api/donations/me').then((d) =>
      d.donations.map((x) => ({
        id: x.id, causeTitle: x.cause, amount: x.amount,
        receiptNo: x.receiptNo, createdAt: x.date, status: x.status,
      }))),
  myOrders: () => Promise.resolve([]),          // shop backend not built yet
  donate: (payload) => request('/api/donations', { method: 'POST', body: payload }),

  /* ---------------- volunteer ---------------- */
  volunteerDashboard: () => request('/api/volunteer/dashboard'),
  setAvailability: (availability) =>
    request('/api/volunteer/availability', { method: 'PATCH', body: { availability } }),
  reapply: () => request('/api/volunteer/reapply', { method: 'POST' }),
  requestWithdrawal: (payload) => request('/api/wallet/withdraw', { method: 'POST', body: payload }),
  myWithdrawals: () => request('/api/wallet/withdrawals').then((d) => d.withdrawals),

  /* ---------------- intern ---------------- */
  internDashboard: () => request('/api/intern/dashboard'),

  /* ---------------- tasks ---------------- */
  myTasks: () => request('/api/tasks/mine'),
  updateTaskStatus: (id, status) =>
    request(`/api/tasks/${id}/status`, { method: 'PATCH', body: { status } }),

  /* ---------------- public pages (SOFT: never crash the page) ---- */
  getStats: () => soft(request('/api/stats').then((d) => d.stats), null),
  getCauses: () => soft(request('/api/causes').then((d) => d.causes), []),
  getCause: (slug) => soft(request(`/api/causes/${slug}`).then((d) => d.cause), null),
  // Shop catalogue — real products from the admin panel.
  getProducts: () => soft(request('/api/products').then((d) => d.products), []),
  getProduct: (slug) => request(`/api/products/${slug}`).then((d) => d.product),
  getEvents: () => soft(request('/api/events').then((d) => d.events), []),
  getBlogs: (page = 1) => soft(request(`/api/blogs?page=${page}`).then((d) => d.posts), []),
  getBlog: (id) => soft(request(`/api/blogs/${id}`).then((d) => d.post), null),
  getGallery: (album) => soft(request(`/api/gallery${album ? `?album=${album}` : ''}`).then((d) => d.images || []), []),
  internships: () => soft(request('/api/internships').then((d) => d.internships), []),
  applyInternship: (id, payload) =>
    request(`/api/internships/${id}/apply`, { method: 'POST', body: payload }),
};

/* ================== admin console ================== */

async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST', headers, credentials: 'include', body: fd,   // no Content-Type: browser sets the boundary
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
  return data;                                  // { url }
}

/** Authenticated CSV download (an <a href> can't carry the Bearer header). */
async function downloadCsv(path, filename) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { headers, credentials: 'include' });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

api.admin = {
  overview: () => request('/api/admin/overview'),

  // generic content resources; events have their own controller (target/progress)
  list: (resource) =>
    resource === 'events'
      ? request('/api/admin/events').then((d) => d.events)
      : request(`/api/admin/content/${resource}`).then((d) => d.rows),
  create: (resource, payload) =>
    resource === 'events'
      ? request('/api/admin/events', { method: 'POST', body: payload }).then((d) => d.event)
      : request(`/api/admin/content/${resource}`, { method: 'POST', body: payload }).then((d) => d.row),
  update: (resource, id, payload) =>
    resource === 'events'
      ? request(`/api/admin/events/${id}`, { method: 'PATCH', body: payload }).then((d) => d.event)
      : request(`/api/admin/content/${resource}/${id}`, { method: 'PATCH', body: payload }).then((d) => d.row),
  remove: (resource, id) =>
    resource === 'events'
      ? request(`/api/admin/events/${id}`, { method: 'DELETE' })
      : request(`/api/admin/content/${resource}/${id}`, { method: 'DELETE' }),

  upload: uploadFile,

  donations: (params = '') => request(`/api/admin/donations${params}`),
  users: (params = '') => request(`/api/admin/users${params}`).then((d) => d.users),

  volunteers: (params = '') => request(`/api/admin/volunteers${params}`),
  volunteerDetail: (id) => request(`/api/admin/volunteers/${id}`),
  setVolunteerStatus: (id, status) =>
    request(`/api/admin/volunteers/${id}`, { method: 'PATCH', body: { status } }),
  acceptVolunteer: (id) =>
    request(`/api/admin/volunteers/${id}/accept`, { method: 'POST' }),

  // platform settings (targets, commission, window, reapply, min withdrawal)
  getSettings: () => request('/api/admin/settings').then((d) => d.settings),
  saveSettings: (payload) => request('/api/admin/settings', { method: 'PUT', body: payload }).then((d) => d.settings),

  // orders
  orders: (params = '') => request(`/api/admin/orders${params}`).then((d) => d.orders),
  updateOrder: (id, status) => request(`/api/admin/orders/${id}`, { method: 'PATCH', body: { status } }).then((d) => d.order),

  // withdrawals
  withdrawals: (params = '') => request(`/api/admin/withdrawals${params}`).then((d) => d.withdrawals),
  processWithdrawal: (id, status, adminNote = '') =>
    request(`/api/admin/withdrawals/${id}`, { method: 'PATCH', body: { status, adminNote } }).then((d) => d.withdrawal),

  internships: () => request('/api/admin/internships').then((d) => d.internships),
  internApplications: (params = '') => request(`/api/admin/intern-applications${params}`).then((d) => d.applications),
  approveApplication: (id) => request(`/api/admin/intern-applications/${id}/approve`, { method: 'POST' }),
  rejectApplication: (id) => request(`/api/admin/intern-applications/${id}/reject`, { method: 'POST' }),

  tasks: (params = '') => request(`/api/admin/tasks${params}`).then((d) => d.tasks),
  createTask: (payload) => request('/api/admin/tasks', { method: 'POST', body: payload }),
  updateTask: (id, payload) => request(`/api/admin/tasks/${id}`, { method: 'PATCH', body: payload }),
  deleteTask: (id) => request(`/api/admin/tasks/${id}`, { method: 'DELETE' }),

  downloadVolunteersCsv: () => downloadCsv('/api/admin/volunteers/csv', 'volunteers.csv'),
  downloadInternsCsv: () => downloadCsv('/api/admin/interns/csv', 'interns.csv'),
};