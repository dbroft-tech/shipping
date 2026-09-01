# Tech Stack (as found)

## Frontend
- Static HTML pages: `index.html`, `about.html`, `services.html`, `locations.html`, `contact.html`, `offline.html`
- Bootstrap 5.3.2, Font Awesome 6.5.1
- Vanilla JS in single `script.js` (~22.6KB)
- Single `styles.css` (~134KB — large for a brochure site, worth auditing for unused rules)

## Build tooling
- Vite (dev server + build), configured via `vite.config.js`
- ESLint + Prettier configured, `lint-staged` + Husky pre-commit hooks declared
- Vitest for tests — one test file: `tests/script.test.js`, plus `tests/setup.js`
- `scripts/optimize-images.js` — imagemin pipeline for JPEG/WebP

## Forms
- **Contact form** → Formspree endpoint `f/xblzeznb`
- **Quote form** → Formspree endpoint `f/manpzlww`
- Migrated to Formspree specifically to get away from a PHP/PHPMailer backend that was throwing 500s (see `FORMSPREE_SETUP.md`)
- Formspree form IDs in client JS are not secrets — this is Formspree's normal client-side integration pattern. Not a leak.

## Dead code
- `PHPMailer/` (~600KB) — full library still committed despite the form backend having moved to Formspree. Unused. Candidate for removal, confirm with client/agency first in case there's a legacy submission path still pointing at it.

## PWA layer (currently broken)
- `manifest.json` + `sw.js` present
- Manifest references icons at `/assets/icons/icon-*.png` — **no `assets/` directory exists in the repo**. PWA install will fail or show broken icons until this is fixed or the manifest is stripped down.

## CI/CD
- `.github/workflows/ci.yml` wires: lint, format check, vitest+coverage, Codecov upload, Snyk security scan, Lighthouse CI, Netlify preview + production deploy, GitHub release creation
- Depends on repo secrets: `CODECOV_TOKEN`, `SNYK_TOKEN`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `GITHUB_TOKEN`
- **Unconfirmed whether these secrets are actually configured** — if not, several jobs in this pipeline are failing on every push right now. Check Actions tab before assuming CI is healthy.

## Hosting config conflict
Three hosting targets configured simultaneously:
1. `netlify.toml` — redirects, headers, build processing, functions/edge-functions dirs (dirs don't appear to exist)
2. `.htaccess` — Apache/cPanel-style config
3. `_headers` — Netlify/Cloudflare Pages convention

Only one of these can be the real deployment target. Needs confirming, see [[05-Open-Questions]].
