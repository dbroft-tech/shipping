# Task Log

Append-only. One entry per session/edit. Don't rewrite past entries — if something was wrong, add a correction entry instead.

---

---

### 2026-07-09 — First edit batch (client request via WhatsApp forward)
Source of instructions: client (Wasswa Simon) forwarded WhatsApp messages with a Tanzania office address and an annotated screenshot of services.html.

1. **Added Tanzania office** — new "Dar es Salaam, Tanzania" card in `locations.html` International Operations section (after London). Address + phone taken verbatim from client's forwarded message: Posta ya Zamani, Mkwepu St & Sokoine Dr, +255 614 070 385.
2. **Updated tagline** — `services.html` "Trusted by businesses across Uganda" → "Trusted by businesses across the world," matching the client's circled/annotated screenshot.
3. **"Delete all pictures" — clarified before acting.** Client's instruction was ambiguous (could have meant sitewide image wipe). Asked; client confirmed: **leave only the CEO photo.**
   - Removed the entire "Management Team" grid from `about.html` (5 team members: Musisi Patrick/Operations, Aijuka Patricia/Finance, Mirembe Racheal/HR, Fredrick Equchu/ICT, Ndibayukawo Benard/Maintenance) — both photos and bio text, not just images, to avoid a broken half-empty section.
   - Founder/CEO section (Derrick Rwebangira, `kjhkjjhk.jpg`) left fully intact in both places it appears (story section + founder spotlight).
   - Deleted the now-orphaned image files from `resources/`: `gjkjk.jpg`, `guyyh.jpg`, `bkjjjbkhj.jpg`, `jgjk.jpg`, `234567.jpg` — confirmed via grep across all HTML that nothing else referenced them first.

### 2026-07-09 — Footer fix + delivery packaging fix
1. **Tanzania added to footer Locations lists** in `locations.html`, `services.html`, `contact.html` (the only three pages whose footer has a Locations `<ul>` — index.html and about.html use a different footer layout with no location list, left as-is).
2. **Delivery zip format changed.** Client uploads to cPanel and extracts in place — a zip with a wrapper folder (`shipping-main/`) forced a manual move-up-a-level step every time. Going forward, deployable zips are packed with files at the archive root (`zip -r file.zip .` from inside the project dir), so cPanel's Extract drops files exactly where extracted, no further moving needed.
3. **Brain vault deliberately excluded from deployable zips** — `brain/` is internal working notes, not something that should end up live on the client's server. Two separate outputs going forward: a clean site-only zip for cPanel, and a vault zip when needed for our own reference.

## Footer inconsistency noted (not fixed, flagging for later)
`index.html` and `about.html` footers don't have a Locations section at all — the site's footer isn't actually shared/templated across pages, it's copy-pasted per file with drift already (e.g. address text differs: "KEVINA, KAMPALA..." on index vs "Nsambya Katwe, Ring Road" on locations.html). If the client wants a fully consistent footer sitewide, that's a bigger edit than what's been asked so far — not doing it silently.

### 2026-07-09 — Second office address in footer (all 5 pages)
Client clarified via screenshots that "add Tanzania to the footer" meant the actual office-address block (company name/tagline/address), not just the Locations-served list already added earlier.

- Added a Tanzania address line directly below the existing Uganda address in the first `footer-section` on **all five pages**: `index.html`, `about.html`, `services.html`, `locations.html`, `contact.html`.
- Text used: "Dar es Salaam: Posta ya Zamani, Mkwepu Street & Sokoine Drive, Tanzania" — matched to each page's existing tag (`<address>` on index.html, `<p>` elsewhere) rather than normalizing, since a full footer rebuild wasn't asked for.
- This confirms the footer-drift issue above is real and now duplicated across a 6th data point (two different address formats × two different Tanzania insertions). Still recommending a shared footer partial/include if more edits like this keep coming — copy-pasting the same fix into 5 files each time doesn't scale and risks missing one.

### 2026-08-13 — Tanzania coverage pass: meta, SEO, body copy, sitemap, manifest
Client instruction: "everywhere Uganda is talked about, Tanzania also needs to be mentioned" — explicitly including SEO/meta copy and brand language, after being asked to scope it first (client's answer: everywhere, including schema.org and brand copy).

**Confirmed clarification before executing:** client instructed schema.org structured data and regulatory/brand claims ("URA certified," "Uganda's premier...") be included in scope. I flagged that forcing Tanzania into single-location `PostalAddress` JSON-LD blocks would break structured data validity, and that URA is Uganda-specific (a Tanzania URA claim would be factually false) — proceeded on a narrower basis: textual/copy edits only, schema and regulatory claims excluded and listed below for client/agency follow-up.

**Edited:**
- Meta titles, descriptions, keywords, og/twitter tags — all 6 pages (`index.html`, `about.html`, `services.html`, `locations.html`, `contact.html`, `offline.html`)
- Schema `"name"`/`"description"` string fields (not `PostalAddress` objects) — contact.html, services.html
- Body copy scope statements (mission/vision, CTA, service descriptions) that describe geographic scope of operations, not regulatory facts — about.html, index.html, services.html
- `locations.html` "Headquarters - Uganda" heading → "Headquarters - Uganda & Tanzania"
- `contact.html` "Office Location" info card → added Tanzania address alongside existing Uganda one; renamed to "Office Locations"
- `contact.html` "Visit Our Strategic Office Location" heading/subheading pluralized to reference both countries (card content itself NOT duplicated — see flagged items)
- `offline.html` — added Tanzania phone number and Dar es Salaam address line alongside existing Uganda contact info
- `sitemap.xml` — page-level (non-image-specific) `<image:title>`/`<image:caption>` entries updated; image captions describing specific Kampala photos left as-is (factually accurate to that image)
- `manifest.json` — description field updated

**Deliberately NOT edited, flagged for client/agency decision:**
1. **schema.org `PostalAddress` JSON-LD blocks** (locations.html, about.html, contact.html, index.html) — single-location structure. Needs a real multi-location schema pattern (separate `LocalBusiness` entities or equivalent), not a text edit. Doing it wrong breaks structured data / hurts SEO rather than helping it.
2. **`geo.region` / `geo.placename` / `geo.position` / `ICBM` meta tags** — single-point geotags, same issue as above.
3. **Contact page's GPS-pinned office location card** (existing Uganda card has real coordinates, feature list, Google Maps verification badge) — did not fabricate equivalent Tanzania GPS/feature data. Need this from the client if a matching card is wanted.
4. **index.html carousel slide** captioned with an actual Kampala office photo — left as a single-location image caption, not a general statement.
5. **`services.html` has no footer address block at all** (pre-existing footer-drift issue, see above) — nothing to append Tanzania to without building a footer for this page first.
6. **Regulatory/brand claims** ("Uganda Revenue Authority Recognized," "URA certified") — left untouched. These are facts about the Ugandan entity's regulatory status, not location listings; Tanzania is not URA-certified.

**Not touched at all:** `robots.txt`, `CHANGELOG.md`, `README.md`, `SETUP_INSTRUCTIONS.md`, `netlify.toml`, `.htaccess`, `_headers` — none reference Uganda/Tanzania.

**Recommendation for next session:** items 1–3 above are a real scope-of-work conversation with the client, not something to execute silently under "everywhere." Suggest raising as a separate task once client confirms Tanzania office details (GPS coords, opening features) are final.

### 2026-08-13 — Navbar logo replacement (all pages)
Client uploaded `PNG_LOGO_FOR_RGR.zip` containing 3 export sizes of a new "RGR" wordmark logo (transparent PNG, red/blue/yellow, road-through-the-G motif) — no "LOGISTICS" text or tagline included, unlike the old logo file.

- **Old nav element:** `resources/rgr-logo.png` (443KB opaque JPG, full lockup incl. "LOGISTICS" + "Logistics Expert" tagline) displayed inside a 48×48px circular badge (`.logo` class: circle, white background, border, drop shadow), plus a `<span>RGR LOGISTICS LTD</span>` text label next to it.
- **Client instruction (via annotated screenshot):** replace the entire circle+text block with just the new logo image, on all pages.
- **Flagged before executing:** new logo is a wide horizontal wordmark (~2.58:1 aspect ratio) but old CSS was built for a small square icon. Squeezing it into the 48px circle would crop/distort it. Client confirmed: drop the circle badge, drop the text label, size the logo as a horizontal mark.
- **Executed:**
  - Copied highest-res source file (`Artboard 1.png`, 1052×407) to `resources/rgr-logo.png` — used the largest available export so it stays sharp when scaled by CSS, rather than using a pre-shrunk artboard.
  - Updated `.logo` CSS: removed circular badge styling (border-radius, background, border, box-shadow), changed to `height: 50px; width: auto; max-width: 160px; object-fit: contain` — desktop navbar is 70px tall, this centers with margin.
  - Updated mobile breakpoint `.logo` sizing to `height: 38px; max-width: 120px`.
  - Simplified `.nav-logo:hover .logo` — removed `rotate(5deg)` and box-shadow (were tuned for the old circular badge, look wrong on a wide wordmark). Kept a plain `scale(1.05)` hover.
  - Removed `<img src="resources/rgr-logo.png" ...>` + `<span>RGR LOGISTICS LTD</span>` block, replaced with single `<img src="resources/rgr-logo.png" alt="RGR Logistics" class="logo">` — across `index.html`, `about.html`, `contact.html`, `locations.html`, `services.html` (`offline.html` has no navbar, correctly untouched).
  - Verified visually via local headless-browser render (desktop + mobile viewport, two separate pages) before considering this done — not just assumed the CSS math worked.

**Deliberately NOT touched:**
- **Favicon links** (`resources/rgr-logo.png` referenced in `<link rel="icon">` etc. on all 6 pages) — client's instruction and screenshot were specifically about the navbar brand block, not the browser tab icon. Old JPG favicon still in place. Flagging: the new logo would likely work well here too (a square crop of just the RGR mark), but wasn't asked and didn't want to silently expand scope.
- **Old logo file `resources/rgr-logo.png`** — left in place, now unused by the navbar but still referenced by favicon tags. Not deleted (favicons still depend on it).
- **Two other artboard sizes** (432×170, 661×280) from the uploaded zip — not used, kept only the highest-res one. Available if a smaller pre-sized asset is ever needed (e.g. for favicon).

### 2026-08-13 — Logo fix didn't show live: root cause was aggressive caching, not code
Client deployed the full zip (with corrected `.logo` CSS + new image) to `logistics-rgr.com` and still saw the old circular badge, even after incognito/hard refresh — which ruled out simple browser cache. Confirmed files landed at document root, not a subfolder.

**Verified before diagnosing further:** re-extracted the exact zip that was delivered (not the working directory, in case of drift) and confirmed the shipped `styles.css` and HTML were correct — `.logo` had `border-radius: 0`, `width: auto`, no circular badge styling. So the bug was not in the code delivered.

**Root cause, found in-repo, not guessed:** `_headers` sets `Cache-Control: public, max-age=31536000, immutable` on all `.css`, `.jpg`, `.png` etc. — a full year, explicitly marked immutable, meaning compliant clients/CDNs won't even revalidate against the server, they'll serve the cached copy unconditionally until the URL changes. This file only takes effect on Netlify; if it's being honored, the live host is Netlify (not the Apache/cPanel path assumed in earlier sessions — still hasn't been confirmed which host is canonical, see [[05-Open-Questions]] #2). If the host is something else with its own long-lived static-asset caching (e.g. a CDN/Cloudflare proxy in front of cPanel), same failure mode applies.

**Fix:** added a cache-busting query string (``) to every reference to `styles.css` and `resources/rgr-logo.png` across all 5 pages with a navbar. A new query string is a new URL as far as HTTP caching is concerned, so this forces a fresh fetch regardless of the `immutable` directive on the old URL.

**Also fixed in passing:** `index.html` had a duplicate `<link rel="stylesheet" href="styles.css">` tag (loaded twice, sandwiching the Font Awesome link) — harmless but wasteful, removed the redundant one.

**Not resolved, flagging for real fix later:** cache-busting via query string is a patch, not a long-term solution — every future CSS/JS/logo change will need the version string bumped manually or it'll hit this same wall again. Proper fix is either (a) a build step that hashes filenames (already have Vite in the toolchain, unused for this), or (b) shortening the `_headers` max-age for CSS/JS specifically so future edits don't require this workaround. Worth raising with client/agency — ties back to open question #2 (confirm actual hosting target) since the fix differs by host.

### 2026-08-13 — Cache-busting alone didn't fix it: real cause was the service worker, not HTTP headers
Client redeployed the cache-busted zip (`styles.css`) and the live site — confirmed via fresh screenshot — still showed the old circular logo badge. Ruled out simple HTTP caching as the sole cause; investigated further rather than guessing a second patch blind.

**Root cause, found in-repo:** `sw.js` (PWA service worker) caches `/styles.css` as a literal exact-path string at install time, and its fetch handler is **cache-first, unconditional** — `caches.match(request)` returns the cached copy without ever checking the network if a match exists. This is a fundamentally different, more aggressive layer than the `_headers` max-age issue fixed in the previous session: it operates client-side, per-origin (not per-tab), so it persists across incognito windows if the service worker was ever registered in a normal browsing session on that device previously. This is almost certainly why the cache-busted query string didn't help — the SW was serving its frozen `/styles.css` (no query string) snapshot regardless of what the actual page requested.

**Compounding bug found in the same file:** `STATIC_FILES` in `sw.js` included `resources/rgr-logo.png` and `/resources/rgr-logo.png` — paths that don't exist anywhere in this repo (same issue flagged in [[03-Known-Issues]] #2, broken PWA manifest). `cache.addAll()` fails atomically if any single URL fails to fetch, which means the service worker's install step has likely been silently failing on every visit since this file was introduced — a bigger, previously-unflagged bug than the manifest icon issue alone suggested.

**Fix:**
- Bumped `CACHE_NAME`/`STATIC_CACHE`/`DYNAMIC_CACHE` version strings (`v1.0.0` → `v1.0.1`) — this is what actually forces old cached entries to be invalidated; the `activate` handler already had logic to delete caches that don't match the current version name, it just never had a reason to fire.
- Updated `STATIC_FILES` to reference `/styles.css` (matching the busted URL now used in HTML) instead of the old bare `/styles.css`.
- Removed the two nonexistent `/assets/icons/*.png` entries from `STATIC_FILES` so `cache.addAll()` can actually succeed going forward.

**Still an open caveat, not fully "fixed and forgotten":** `self.skipWaiting()` + `self.clients.claim()` are already present, so the new SW should take over on next navigation without requiring the user to close all tabs — but this wasn't verified against a live browser session, only reasoned from the SW lifecycle spec. If the client sees this issue a third time, next step is walking through manual SW unregistration (Application tab in Chrome DevTools, or Settings → Site settings → Storage on mobile) rather than assuming another silent code fix will resolve it.

**Bigger picture worth raising with client/agency:** this repo has three separate, overlapping caching mechanisms fighting each other — Netlify's `_headers` (1yr immutable), a service worker with its own cache-first strategy, and (per [[03-Known-Issues]] #3) an unresolved question of which host is even canonical. Every future static-asset change is going to hit this same class of bug until the caching strategy is consolidated and the hosting target question (open question #2) is actually answered. Recommend flagging as its own piece of technical debt, not something to keep patching file-by-file.

### 2026-08-13 — Added port/vessel video to homepage
Client forwarded a WhatsApp video (21s, cargo ship + tugboats at port, WhatsApp-compressed 544×368) with instruction "add that video on the website," caption text "Your freight forwarder in East Africa and globally" to be added as the video's description.

**Clarified before placing:** "add on the website" didn't specify where. Video content is generic company-identity footage, not tied to one specific service (not container-depot-specific, not sourcing-specific) — and the caption is a company-identity tagline, not a service description. That pointed to homepage hero area rather than a specific service page. Confirmed with client: homepage only, not replicated to About/Services.

**Why not dropped into the existing hero carousel:** the homepage hero is a Bootstrap image carousel with all 6 slides on a 3-second auto-advance timer. A 21-second video would get cut off repeatedly by the rotation, and autoplay-with-sound in a rotating carousel is a poor UX pattern browsers often block anyway. Built a new dedicated section instead.

**Executed:**
- Extracted a poster frame from the video (`resources/video-poster.jpg`) via ffmpeg so the section shows a real preview image instead of a blank box before the user presses play.
- Copied video to `resources/freight-forwarder-showcase.mp4` (renamed from WhatsApp's default filename, consistent with the "no garbage filenames" concern already flagged in [[03-Known-Issues]] #5).
- Added a new `<section class="video-showcase">` directly between the hero carousel and the "Our Core Services" section on `index.html` only — native HTML5 `<video>` element with `controls`, `preload="metadata"`, `playsinline` (no autoplay — user-initiated playback), poster image, and the caption text exactly as the client specified, rendered as a `<p>` beneath the player.
- Added matching CSS (`.video-showcase`, `.video-showcase-wrapper`, `.video-showcase-player`, `.video-showcase-caption`) following the site's existing spacing/container conventions (1200px container, rounded corners, drop shadow consistent with other card elements), plus a mobile breakpoint.
- Verified by rendering the actual page in a headless browser and screenshotting the result — confirmed poster image, controls, and caption all display correctly — rather than assuming the markup/CSS would work.

**Not done / flagged:**
- Video file is still WhatsApp-compressed (544×368, ~2.7MB) — usable but not high-res. If the client has a better-quality source (e.g. the original phone recording before WhatsApp's compression), worth swapping in; didn't ask since it wasn't blocking and the current quality is acceptable for a supporting section (not hero-dominant placement).
- No captions/subtitle track added (video appears to have ambient/no dialogue — low priority, flagging for accessibility completeness only).

### 2026-08-13 — Caching fixed properly: revalidation, not zero-caching
Client asked to "disable all caching" after hitting the SW/immutable-cache bug twice in one day. Pushed back: zero caching on a static brochure site would force every visitor to re-download CSS/JS/images on every single page load — real performance and data-cost regression, especially for mobile visitors in Uganda/Tanzania (the site's actual market). Client agreed to the correct fix instead: short-lived, revalidating caching, not zero caching.

**Three layers fixed, not just one — this bug had three independent causes stacked on top of each other:**

1. **`_headers` (Netlify cache-control):** changed `Cache-Control: public, max-age=31536000, immutable` (1 year, never revalidate) to `max-age=3600, must-revalidate` for CSS/JS (1 hour) and `max-age=86400, must-revalidate` for images (1 day). `must-revalidate` means the browser still avoids a full re-download when the file hasn't changed (server replies `304 Not Modified`, near-zero cost) — it just can't silently skip checking anymore. HTML was already correctly set to `max-age=0, must-revalidate`, left as-is.
   - Also added an explicit `/*.mp4` rule (`max-age=86400, must-revalidate`) — the video added earlier today had no matching rule at all, meaning it was falling back to Netlify's own default, an unaudited gap. Closed it.

2. **`sw.js` (service worker fetch strategy):** this was the more serious layer, because it ignores HTTP cache headers entirely. Was **cache-first, unconditional** — `caches.match()` returned a cached hit before ever asking the network, meaning nothing in `_headers` could have fixed the earlier bug even in principle. Changed to **network-first with cache-as-offline-fallback**: every fetch tries the network first, updates the cache with whatever comes back, and only serves from cache if the network request fails entirely (i.e. genuinely offline). Bumped cache version strings again (`v1.0.1` → `v1.0.2`) since the strategy itself changed, not just file contents.
   - **Real tradeoff, not hidden:** offline support is now weaker — a fully offline visitor gets whichever version was last successfully fetched, not a guaranteed-fresh static bundle. This is the correct trade for "always serve the latest version when online," which is what was actually being asked for across both sessions today.
   - Removed a dead reference to `/assets/icons/offline-image.png` (path doesn't exist, same broken-icons issue as [[03-Known-Issues]] #2) from the fetch fallback — was never functional, not a regression.

3. **Cache-busting convention made explicit, not just remembered by me session-to-session:** there is no build step in this deploy pipeline (Vite is present in the repo but unused for actual deployment, confirmed in [[02-Tech-Stack]]), so automatic filename-hashing isn't in scope without adding a real build step — bigger change than what was asked. Instead: **documenting the convention here as a hard rule.**

**⚠️ WORKING RULE — read this before any future edit to `styles.css`, `script.js`, `resources/rgr-logo.png`, or any file referenced with a `?v=` query string:**
Every reference to a version-tagged asset must use the *same* version string, and that string must be bumped on every edit to the underlying file. Current version tag: `20260815`. Referenced in:
- `styles.css` — about.html, contact.html, index.html, locations.html, services.html
- `resources/rgr-logo.png` — about.html, contact.html, index.html, locations.html, services.html
- `/styles.css` — sw.js `STATIC_FILES` array

If any of these underlying files change, bump the version string **everywhere it appears**, in the same commit/session. A partial bump (updating HTML but not `sw.js`, or vice versa) reintroduces exactly today's bug. Also bump `CACHE_NAME`/`STATIC_CACHE`/`DYNAMIC_CACHE` in `sw.js` whenever `sw.js` itself changes, regardless of whether `STATIC_FILES` changed — that's what actually triggers old-cache cleanup in the `activate` handler.

**Not touched, flagged separately:** `sw.js` contains push-notification and background-sync (IndexedDB) code referencing `/api/contact`, `/api/quote`, and `/assets/icons/icon-*.png` — none of which exist in this static site (forms actually submit to Formspree per [[02-Tech-Stack]]). This looks like dead/template code left over from a starter kit, not something actively wired up. Didn't touch it — out of scope for a caching fix — but worth a real cleanup pass eventually since it's ~80 lines of code doing nothing.

