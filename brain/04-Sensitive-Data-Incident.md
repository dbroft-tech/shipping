# Sensitive Data Incident — `resources/New Text Document.txt`

## What it is
A raw, unstructured client brief committed directly into the public repo. Contains:
- Real staff names mapped to photo filenames (operations, maintenance, finance, HR, ICT supervisor, receptionist)
- An explicit instruction to remove a named employee (Suuna Yusuf) from the website "for further notice," described as a termination
- Informal build instructions apparently addressed to whoever was doing the dev work at the time ("give each card border yellow color," "optimise page loading time," etc.)

## Why this matters more than any code bug
This isn't a style problem — it's a real employee's employment status and a set of staff names sitting in git history on a public repo. If this repo is indexed or has ever been cloned/forked, that content persists regardless of what happens next in the working tree.

## What needs to happen (needs sign-off, not something to just do silently)
1. Confirm with whoever manages the repo (agency or client) whether this is already known/acceptable, or whether it needs remediating.
2. If remediation is wanted: deleting the file in a new commit is **not sufficient** — it stays in git history and in the already-public archive. Actual removal requires history rewriting (`git filter-repo` or equivalent) or, more realistically for a small repo, starting a clean history and archiving the old one privately.
3. Flag to the client that internal HR-adjacent content was exposed, so they can judge the actual real-world impact (this is their call, not ours to assess alone).

## Working rule going forward
Never copy names, roles, or "who should be removed" instructions from this file directly into new commits or into conversation without confirming they're still accurate and appropriate to publish. Treat this file as evidence of a problem, not as a valid content source.
