# Deploying SVR Educational Society

## Why "some sections weren't loading"

Sections like Shop, What We Do, Blog, Events and Gallery load their content **from the API**.
When the site was deployed, the frontend was still calling `http://localhost:4000` — which
only exists on a developer's own machine, not for visitors. So those data-driven sections
came back empty while static parts (hero, footer) showed fine.

**This is now fixed two ways:**

1. **Automatic demo fallback** — if the backend can't be reached, the site automatically
   serves built-in demo content, so every section fills in. Your client demo works even with
   **no backend deployed at all**. (Donations/checkout/login simulate success in this mode.)
2. **Real backend support** — set `VITE_API_BASE` to your deployed API and the site uses live
   data instead.

---

## Option A — Quickest demo (frontend only, no backend)

Perfect for showing the client. Everything renders from demo data.

```bash
npm install
npm run build        # outputs dist/
```

Deploy the **`dist/`** folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare
Pages, or any web server). The included `public/_redirects` (Netlify) and `vercel.json`
(Vercel) handle SPA routing so deep links don't 404 on refresh.

- **Netlify:** drag-and-drop the `dist` folder, or connect the repo (build command
  `npm run build`, publish directory `dist`).
- **Vercel:** import the repo; framework preset **Vite**; it picks up `vercel.json`.
- **Force demo mode explicitly** (skip any network attempt): set env `VITE_DEMO=1` before build.

> On Apache, add a `.htaccess` with a fallback to `index.html`. On nginx, use
> `try_files $uri /index.html;`. This makes `/store`, `/what-we-do/medical` etc. work on refresh.

---

## Option B — Full live site (frontend + real backend)

1. **Deploy the backend** (`server/`) to Render / Railway / a VPS:
   ```bash
   cd server
   npm install
   npm run setup     # creates DB + seeds data (use a real DB in prod — see server/README)
   npm start         # serves on $PORT (default 4000)
   ```
   Note its public URL, e.g. `https://svr-api.onrender.com`.

2. **Allow your frontend domain in CORS.** In `server/src/index.js`, replace `app.use(cors())`
   with:
   ```js
   app.use(cors({ origin: ['https://your-frontend-domain.com'] }))
   ```

3. **Point the frontend at it.** Set this env var on your frontend host **before building**:
   ```
   VITE_API_BASE=https://svr-api.onrender.com/api
   ```
   (Both must be HTTPS — an HTTPS site cannot call an HTTP API; browsers block it as
   "mixed content".)

4. Build & deploy the frontend as in Option A.

---

## Quick diagnosis checklist

Open the deployed site → **F12 → Console / Network**, reload:

| What you see | Cause | Fix |
|---|---|---|
| Sections fill from demo data | Backend unreachable → fallback active | Fine for demo; set `VITE_API_BASE` for live data |
| `Failed to fetch` / connection refused | Wrong/missing API URL | Set `VITE_API_BASE` to the deployed API |
| `CORS policy` blocked | Backend not allowing your domain | Add your domain to `cors({ origin: [...] })` |
| `Mixed Content` | HTTP API on an HTTPS site | Serve the API over HTTPS |
| 404 when refreshing `/store` | SPA fallback missing | Use the provided `_redirects` / `vercel.json` / nginx rule |
