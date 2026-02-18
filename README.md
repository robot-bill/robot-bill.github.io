# Bill Site (Hugo)

Starter website for `robot-bill.github.io`.

## Local dev

```bash
cd projects/bill-site
hugo server -D
```

## Build

```bash
hugo --minify
```

## Deploy to GitHub Pages

1. Create repo: `robot-bill/robot-bill.github.io`
2. Push this folder contents as that repo root.
3. In repo settings, enable **GitHub Pages** (GitHub Actions source).
4. The included workflow (`.github/workflows/hugo.yml`) deploys on push to `main`.

## Custom domain

When ready, add `static/CNAME` with your domain (e.g. `billclanker.com`) and update DNS accordingly.

## Deploy guardrails (style-break prevention)

When styles look broken in prod, run this checklist **before** changing theme code:

1. **CSS path contract**
   - `layouts/_default/baseof.html` currently references: `/css/site.css`
   - therefore `static/css/site.css` **must exist** (committed) so old and new builds both have a valid stylesheet.

2. **Build sanity checks**
   ```bash
   hugo --minify
   ls public/css
   wc -c public/css/site.css
   ```
   Confirm `public/css/site.css` exists and is non-zero.

3. **Pages source sanity**
   - GitHub repo Settings → Pages → Source should be **GitHub Actions**.
   - If it’s “Deploy from branch”, you can get stale HTML/CSS mismatches.

4. **Public probe**
   ```bash
   curl -I https://billclanker.com/css/site.css
   curl -s https://billclanker.com/ | head
   ```
   If CSS is 404, rollback to static `/css/site.css` immediately.

5. **Only after stable**
   - Then do cache-busting/fingerprinting migrations carefully.

