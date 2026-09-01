# Known Issues (ranked)

## 🔴 Critical
1. **Sensitive internal data committed to a public repo** — see [[04-Sensitive-Data-Incident]]. This is the priority item, not the broken icons.
2. **Broken PWA manifest** — `manifest.json` points at `/assets/icons/*` that don't exist anywhere in the tree. "Add to Home Screen" is currently non-functional or shows a broken icon.
3. **Hosting target ambiguity** — Netlify config, `.htaccess`, and `_headers` all present. Don't assume which one is live without checking the actual DNS/host first (learned the hard way on NAGABA: verify by walking real resource paths, not by reading config files and assuming).

## 🟡 Should fix
4. **Dead PHPMailer dependency** (~600KB) — superseded by Formspree, still committed.
5. **Garbage asset filenames** in `resources/` — `bhb.jpg`, `gjkjk.jpg`, `nnknk.jpg`, etc. No semantic naming, alt-text will be meaningless without cross-referencing the leaked brief.
6. **CI pipeline likely partially broken** — depends on 4 separate repo secrets (Snyk, Codecov, Netlify, GitHub token). Confirm which are actually set before trusting green checkmarks.
7. **`styles.css` at 134KB** for a 5-page brochure site — likely contains large blocks of unused/duplicate rules worth auditing.
8. **Repo metadata mismatch** — `package.json` repository field points to `rgrlogistics/website.git`, not the actual repo (`dbroft-tech/shipping`) this was pulled from. Provenance unclear; don't assume this is the canonical/only copy of the codebase.

## 🟢 Minor / cosmetic
9. Stray Windows-default filename (`New Text Document.txt`) committed — symptom of the same handoff sloppiness as #1, but the file itself is the incident, not a separate minor issue.
