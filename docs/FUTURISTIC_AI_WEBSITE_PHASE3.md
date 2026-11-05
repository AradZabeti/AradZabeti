# Futuristic AI website — Phase 3

This phase upgrades the **live static Digital Universe website**, not only the profile README. It adds a lightweight projected-3D neural field, futuristic surface styling, and responsive refinements while retaining the existing Three.js sculpture and all existing navigation, content and language options.

## Scope

- English home: `/AradZabeti/` and `/AradZabeti/en/`
- Persian home: `/AradZabeti/fa/` (RTL)
- Bilingual project case studies and exported Next.js 404 routes
- Existing navigation, command palette, projects and contact features are preserved

## Source/export synchronization

The project uses Next.js static export and GitHub Pages serves checked-in HTML. Changes must touch **both**:
1. Source-side files `universe-source/src/app/layout.tsx` plus `universe-source/public/assets/futuristic-phase3.{css,js}`.
2. The identical assets under root `assets/` and the checked-in exported HTML pages.

The linked assets use the existing project base URL `/AradZabeti/assets/` and do not use a remote CDN. The next verified `npm run build` and `npm run publish:pages` should reproduce these inclusions. Do not merge changes that update only the Next.js source while leaving GitHub Pages export out of sync.

## Visual model and performance budget

- **No new npm packages.** The existing Three.js sculpture is preserved, not rewritten.
- The new neural field runs on the existing **2D Canvas** but rotates and projects a deterministic 3D point cloud into perspective. The result looks spatial without another WebGL context.
- Point cloud: 44 nodes on desktop, 24 nodes on mobile; a bounded set of edges and capped DPR (desktop 1.4, mobile 1.0).
- Maximum animation rate approximately 29 FPS on desktop and 19 FPS on mobile.
- The overlay pauses when outside the viewport or the tab is hidden.
- `prefers-reduced-motion`, the existing `data-motion="low"` toggle, and Save-Data disable continuous animation and render only a static frame.
- It uses feature detection and leaves the original hero intact when canvas is unavailable.
- Uses ResizeObserver and IntersectionObserver to avoid global scroll polling.
- All visual additions are `aria-hidden` and do not intercept pointer or keyboard events.
- All new script code is local; no fetch, external images, telemetry or persistent storage.

This is a **progressive layer** over the existing site, not a claim that the pre-existing Three.js scene has been removed or that a full Lighthouse benchmark has already been performed.

## Validation

- `python -m unittest discover -s scripts -p 'test_*.py' -v`
- `python scripts/check_site_links.py`
- `python scripts/check_profile_readme.py`
- `node --check universe-source/public/assets/futuristic-phase3.js`
- `cd universe-source && npm ci && NEXT_PUBLIC_BASE_PATH=/AradZabeti npm run build && npm run typecheck && npm run verify:export`
- Review GitHub Actions results on this PR; test mobile widths, English/RTL, reduced-motion, dark/light themes and hover/focus interactions before approving production merge.

## Rollout and cautions

- This phase lives on a new design branch and should be merged only after explicit owner approval.
- PR #6 (cPanel diagnostics security) is independent and must not be merged as part of the design work.
- The exported HTML and source are updated together for review; no separate live deployment happens until a human-approved merge.
- A full 3D performance benchmark across real mobile devices remains recommended before enabling more visual complexity.
