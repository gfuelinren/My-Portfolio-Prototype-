# Deployment & Fix Notes — My-Portfolio-Prototype-

This document explains what I changed to make your portfolio deploy correctly on Vercel, why the changes were necessary, how to verify them, and how to produce a PDF you can study offline.

---

## Summary of fixes applied

1. vercel.json (repo root)
   - Added `handle: filesystem` so static assets are served from the filesystem when present.
   - Added explicit route rewrites and a SPA fallback so unknown routes resolve to `/Portfolio/index.html`.
   - Added Cache-Control headers for JS/CSS and image assets.

2. Portfolio/index.html
   - Removed an empty `integrity=""` attribute on the Font Awesome stylesheet link (an empty SRI attribute blocks loading).
   - Updated asset paths to absolute paths that point to the deployed locations:
     - `/Portfolio/css/style.css`
     - `/Portfolio/script.js`
     - `/Portfolio/images/1x1.jpg`
   - This ensures the browser requests the actual paths where assets are hosted when `index.html` is served from `/`.

3. Portfolio/script.js
   - Added the missing JavaScript (menu toggle, smooth scroll, welcome message, IntersectionObserver).

---

## Why the site was broken

- The repository contains a `Portfolio/` folder with `index.html`, `css/`, `images/`, and (previously missing) `script.js`.
- Vercel was serving your site root (`/`) from `Portfolio/index.html` (via `vercel.json`), but the HTML referenced `css/style.css` and `script.js` as relative paths (requests like `/css/style.css` and `/script.js`).
- Those paths did not exist at the site root, so the browser received 404s for CSS and JS. Result: unstyled, uninteractive page.
- Additionally, an empty `integrity` attribute on the Font Awesome stylesheet caused the browser to block that resource.

---

## Exact changes (diff-style excerpts)

### vercel.json (updated)
```json
{
  "version": 2,
  "builds": [
    { "src": "Portfolio/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "^/$", "dest": "/Portfolio/index.html" },
    { "src": "^/Portfolio/(.*)$", "dest": "/Portfolio/$1" },
    { "src": "^/(.*)$", "dest": "/Portfolio/index.html" }
  ],
  "headers": [
    {
      "source": "/Portfolio/(.*)\\.(js|css)$",
      "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ]
    },
    {
      "source": "/Portfolio/(.*)\\.(png|jpg|jpeg|svg|webp|gif)$",
      "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ]
    }
  ]
}
```

Notes: this file is at the repository root (`vercel.json`) and is already committed.


### Portfolio/index.html (updated asset paths)
```html
<!-- BEFORE -->
<link rel="stylesheet" href="css/style.css" />
<script src="script.js"></script>
<img src="images/1x1.jpg" alt="Profile" />

<!-- AFTER -->
<link rel="stylesheet" href="/Portfolio/css/style.css" />
<script src="/Portfolio/script.js"></script>
<img src="/Portfolio/images/1x1.jpg" alt="Profile" />
```

Also removed: `integrity=""` from the Font Awesome `<link>`.

### Portfolio/script.js (added)
- Contains the DOMContentLoaded listener that handles:
  - menu toggle open/close
  - smooth scrolling for nav links
  - scroll indicator behavior
  - welcome message button
  - IntersectionObserver to highlight nav links

(Full file is present at `Portfolio/script.js` in the repo.)

---

## How to verify locally

Option A (simple static server from repo root):

1. From your repo root (the parent of `Portfolio/`) start a static server so absolute paths like `/Portfolio/...` resolve correctly.
   - Using `serve` (npm):
     - Install: `npm i -g serve`
     - Run: `serve .` (serves the current folder, typically on http://localhost:5000)
   - Or with Python 3 built-in server:
     - `python -m http.server 5000`
2. Open `http://localhost:5000/Portfolio/index.html` (or just `/` if the server serves index by default) and open DevTools → Network.
3. Confirm:
   - `/Portfolio/css/style.css` loads with HTTP 200.
   - `/Portfolio/script.js` loads with HTTP 200.
   - `/Portfolio/images/1x1.jpg` loads with HTTP 200.
4. Ensure the page is styled and interactive (hamburger toggles, welcome button shows message, icons visible).

Option B (Vercel dev, emulates production):

1. Install Vercel CLI: `npm i -g vercel`
2. From repo root run: `vercel dev`
3. Open the local dev URL and verify assets load in DevTools.

---

## How to verify on Vercel (after pushing)

1. Push your branch to GitHub — Vercel will automatically deploy if connected.
2. Open the deployment URL.
3. In DevTools → Network, verify the asset requests are for `/Portfolio/css/style.css`, `/Portfolio/script.js`, etc. and they return 200.
4. If you see 404s, note the requested URL and report it; I can adjust routing.

---

## How to create a PDF of this document

Option 1 — locally with Pandoc (recommended for consistent output):

1. Install pandoc (https://pandoc.org/installing.html) and a PDF engine like wkhtmltopdf or LaTeX (TinyTeX).
2. Clone the repo or download this file (it's at `Portfolio/DEPLOY_INSTRUCTIONS.md`).
3. Run:

```bash
pandoc Portfolio/DEPLOY_INSTRUCTIONS.md -o Portfolio/DEPLOY_INSTRUCTIONS.pdf
```

Option 2 — using Google Chrome / Chromium (quick):

1. Open the Markdown file on GitHub: `https://github.com/gfuelinren/My-Portfolio-Prototype-/blob/main/Portfolio/DEPLOY_INSTRUCTIONS.md`.
2. Click the "Raw" button to view plain text, or use the rendered README view if available.
3. Use Print → Save as PDF.

Option 3 — use VS Code: open the Markdown and use the "Markdown: Open Preview" and Print to PDF.

---

## Next steps I can perform for you

- Generate the PDF from this Markdown and commit it into the repo as `Portfolio/DEPLOY_INSTRUCTIONS.pdf` (I will need your confirmation before creating a binary file in the repo).
- Add SRI for Font Awesome (I'll fetch the file and compute the integrity hash).
- Add a `.vercelignore` to reduce deploy size.
- Help connect a custom domain in Vercel.

---

If you want the PDF committed to the repository now, reply `Yes commit PDF` and I will add `Portfolio/DEPLOY_INSTRUCTIONS.pdf` to the repo. Otherwise, follow the Pandoc/Chrome steps above to produce the PDF locally.
