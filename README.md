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
