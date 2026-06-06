# SVR Educational Society — Frontend

React 18 + Vite single-page app for the donation, volunteer, and internship
platform of **Sri Vommi Ramana Educational Society** (SVR). Public website,
donor/volunteer/intern dashboards, and a full admin console — all driven by the
`svr-backend` API.

Backend repo: `svr-backend` (Node/Express/MongoDB) — required; deploy together.

---

## Features

**Public site**
- Home with live stats (`/api/stats`), featured causes, banner carousel
- Causes by category with progress (`/what-we-do/:cat`, detail pages by slug)
- Fundraising events with target progress and per-event donate links
- Blog (list + detail), gallery, internship openings (live postings)
- **Donation flow** — 5-step stepper, cause/event preselection via
  `?causeId=` / `?eventId=`, volunteer referral capture via `?ref=`,
  **Razorpay checkout** (with automatic direct-recording fallback while the
  gateway is unconfigured), PAN validation for 80G receipts
- Volunteer registration = instant account + auto sign-in (3-day activation
  challenge explained inline); internship application (free, reviewed by admin)
- `/set-password` — magic-link account activation (donors & approved interns)

**Dashboards** (`/dashboard/:role`)
- Volunteer: target progress + countdown, referral links (6-digit code),
  10% commission wallet, availability toggle, tasks
- Donor: donation history with receipt numbers
- Intern: profile + assigned tasks with status updates

**Admin console** (`/admin`)
- Overview: KPIs, fundraising-events progress panel, category charts, recent
  donations with volunteer attribution, volunteers/interns CSV download
- Content managers (one generic `ResourceManager`): causes, products, blogs,
  fundraising events (target/progress), gallery — with image upload
- Donations (search/pagination), Users & wallets, Volunteers (detail drawer,
  status override), Internships (postings, applications approve/reject,
  intern task assignment)

## Tech stack

React 18, Vite, react-router v6, plain CSS (custom design system in
`src/styles/`), fetch-based API client with silent JWT refresh.
No UI framework; no Redux (context for auth/cart).

## Project structure

```
src/
  lib/        api.js (API client + api.admin namespace), razorpay.js,
              format.js (INR/date helpers)
  context/    AuthContext (token + user), CartContext
  components/ layout (Header auth-aware, Footer, BannerCarousel), ui (Icons,
              Primitives)
  pages/      public pages, Donate, Login, Dashboard, SetPassword,
              Volunteer(+Register), Internship(+Register), Blog, Events, ...
  pages/admin AdminLayout, AdminDashboard, ResourceManager + resourceConfig,
              AdminDonations, AdminUsers, AdminVolunteers, InternshipModule,
              cms.jsx (Modal/ImageUploader/Field)
  styles/     base, theme, components, pages, admin, responsive
  data/mock.js  static site content (ORG identity, stories, FAQs) — NOT app data
vite.config.js  dev proxy: /api and /uploads → http://127.0.0.1:4000
```

## Local development

Run the backend first (`svr-backend`, port 4000), then:

```bash
npm install
npm run dev          # http://localhost:5173
```

**Same-origin by design:** the API client uses relative URLs (`/api/...`).
In dev, `vite.config.js` proxies `/api` and `/uploads` to the backend; in
production, nginx does the same. There is **no CORS** in this setup and no API
URL to configure. Only set `VITE_API_URL` if the API is intentionally hosted on
a different domain.

Demo accounts: created by the backend seed (`npm run seed:admin`) — log in at
`/login` with the seeded admin credentials; register volunteers/donors through
the UI.

## Build & production deployment

```bash
npm ci
npm run build        # outputs dist/
```

Serve `dist/` with nginx on the **same origin** as the API (full server setup
in the backend README):

```nginx
root /var/www/svr/svr-frontend/dist;
location /         { try_files $uri $uri/ /index.html; }   # SPA routing
location /api/     { proxy_pass http://127.0.0.1:4000; }
location /uploads/ { proxy_pass http://127.0.0.1:4000; }
```

The `try_files ... /index.html` line is required — deep links like
`/dashboard/volunteer` 404 without it.

To redeploy after changes: `git pull && npm ci && npm run build` (nginx picks
up `dist/` immediately; no process to restart).

## Conventions for contributors

- API access only through `src/lib/api.js` (it handles auth headers and the
  silent refresh-retry); admin endpoints via the `api.admin.*` namespace.
- Public-page fetchers (`getCauses`, `getEvents`, …) are **soft** — they return
  empty data on failure so pages render during partial backend availability.
- Payments only through `src/lib/razorpay.js` (`payAndDonate` with
  `donateDirect` fallback).
- `data/mock.js` holds static *content* (org identity, testimonials, FAQs);
  anything transactional comes from the API. Don't add app data to it.
- Admin resource tables: add/extend resources in `pages/admin/resourceConfig.js`
  (columns + form fields must match backend model field names).

## Known gaps / roadmap

- Store / ProductDetail / Cart pages still run on mock data — pending the shop
  & order-tracking backend (next sprint)
- Gallery page wiring to `/api/gallery`
- Volunteer withdrawal UI (pending backend feature)

## License

Proprietary — built for Sri Vommi Ramana Educational Society.