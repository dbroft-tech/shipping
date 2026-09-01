# Client Context

## Who
**RGR Logistics Ltd** — bonded warehouse, depot, clearing & forwarding, transportation.
- Registered company limited by shares, Uganda (Reg. NO: 80034281964094)
- Incorporated 2025
- Location: Kevina, Kampala, Makindye Division West, Uganda
- Recognized by Uganda Revenue Authority
- Founder: Mr. Derrick Rwebangira

## Staff referenced in source material (see [[04-Sensitive-Data-Incident]])
Do not treat this list as current — it came from a leaked internal note, may be stale, and should be **re-confirmed with the client**, not copied blind into site content:
- Operations supervisor: Musisi Patrick
- Maintenance supervisor: Ndibayukawo Benard
- Finance supervisor: Suuna Yusuf — **note in source material said to terminate this person from the website entirely; verify current status before touching**
- HR supervisor: Mirembe Racheal
- ICT supervisor: Frank Equchu
- Receptionist: previously Aijuka Patricia — source material said to remove this role from the site

## Site purpose
Marketing/brochure site: about, services, locations, contact + quote request forms. No portal, no login, no logistics tracking functionality — purely informational + lead capture via Formspree.

## Domain / hosting (unconfirmed)
- `package.json` homepage: rgr-logistics.com
- Repo metadata points to `rgrlogistics/website.git`, NOT the repo this was downloaded from (`dbroft-tech/shipping`) — provenance mismatch, treat as unverified
- Actual live host is unconfirmed — repo contains config for **three different hosting targets simultaneously** (Netlify, Apache/cPanel via `.htaccess`, and generic `_headers`). See [[03-Known-Issues]].
