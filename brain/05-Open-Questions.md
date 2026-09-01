# Open Questions

Answer these before making non-trivial edits — don't assume.

1. **Scope of this engagement** — what edits am I actually being asked to make? (content changes, bug fixes, both?) Get the actual task list from whoever is assigning this work.
2. **Real hosting target** — Netlify, Apache/cPanel, or something else? Confirms which config file (netlify.toml vs .htaccess vs _headers) is live and which are dead weight.
3. **Repo of record** — is `dbroft-tech/shipping` actually the canonical repo, or is `rgrlogistics/website` (referenced in package.json) the real one and this a stale mirror/fork?
4. **PHPMailer** — safe to delete, or is there a legacy form submission path somewhere still depending on it?
5. **Staff roster accuracy** — is the staff list in the leaked brief still current? Don't publish/edit staff-facing content off that file without client confirmation (see [[04-Sensitive-Data-Incident]]).
6. **Sensitive file remediation** — does the client/agency want the leaked internal note purged from history, or is this already a known/accepted situation?
7. **CI secrets** — are Snyk/Codecov/Netlify secrets actually configured in this repo's GitHub settings? Determines whether "CI is green" can be trusted.
8. **Credentials access** — for any edit requiring push access, get a fine-grained PAT scoped to this specific repo/org for this session only, revoke after. Do not reuse a token scoped to an unrelated account/org for this.
