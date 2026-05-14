# FoundryDock marketing site (foundrydock.com)

Static files served at the domain root:

- `index.html` — landing page  
- `privacy.html` — privacy policy (`/privacy` on the live host should serve this file; configure your host accordingly)

## Deploy (e.g. Cloudflare Pages)

Connect this GitHub repo, then:

- **Root directory:** `website`
- **Build command:** *(leave empty or `exit 0`)* — no build step  
- **Build output directory:** `website` (same as root when using “root = website” setups) *or* use a static-only project that publishes the contents of `website/` as the site root.

Exact UI labels vary; the goal is to publish **`index.html` at `/`** and **`privacy.html` at `/privacy`** (or `privacy.html` if you prefer that URL).

The React application is in the **repository root**, not in this folder.
