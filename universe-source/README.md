# Arad Zabeti — Digital Universe

Premium bilingual personal portfolio. Next.js App Router, React, strict TypeScript, Three.js and Lucide. CSS and browser APIs handle motion without extra animation dependencies. The site is a static export with no server requirements.

## Local development

Requires Node.js 20.9+ (Node 22 or 24 recommended).

```sh
cd universe-source
npm ci
npm run dev
```

Open the address printed by Next.js. `npm run typecheck` checks types. `npm run build` generates `out/`.

## Edit content

`src/data/portfolio.ts` is the source of truth for identity, contact details, photo, timezone, projects, skills, technology connections and journey. UI translations live beside their components in `Portfolio.tsx`; project content has English and Persian fields. Use `/en/` or `/fa/` for language routes. The root defaults to English.

- Set `profile.photo` to a path in `public/` to replace the abstract monogram with a real portrait.
- `profile.linkedin` and `profile.timeZone` are deliberately unset because no real values were provided.
- The PDF in `public/resume/` is the supplied professional résumé.
- Project illustrations are clearly marked concept artwork. KookTools has a public link; private and exploratory projects do not have fabricated live links.
- Timeline entries describe focus and goals, not invented employment history.

## GitHub Pages

This repository already publishes `main` from the root via GitHub Pages. Build with its actual project path:

```sh
cd universe-source
NEXT_PUBLIC_BASE_PATH=/AradZabeti npm run build
npm run publish:pages
cd ..
git add .
git commit -m "Update portfolio"
git push origin main
```

PowerShell equivalent for the environment variable:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/AradZabeti'
npm run build
npm run publish:pages
```

The publish script copies the export to the repository root without removing legacy pages. `.nojekyll` lets Pages serve `_next`. The lockfile pins the exact installed dependency versions. Commit generated root files after rebuilding. Do not copy `node_modules`, `.next`, `out`, or preview files.

## Vercel

Import the repository, select **Next.js**, and set **Root Directory** to `universe-source`. Leave `NEXT_PUBLIC_BASE_PATH` unset for root-domain hosting. Build command: `npm run build`. Output: `out` (static export). Update `profile.siteUrl` for canonical, social and sitemap URLs. No backend environment secrets are required.

## Contact and privacy

The form uses native browser validation and opens an encoded `mailto:` draft. It explicitly describes this handoff and never claims a message was sent. There is no form server, analytics, tracking or database. Copy email uses the Clipboard API, with a visible address fallback if denied. A server-backed form can be added later with server-side validation, rate limits and secret management; do not place service credentials in client config.

## Motion and accessibility

Semantic sections, focus styles, skip navigation, keyboard-operable controls, a native command dialog, EN/FA routing, true RTL, reduced-motion preference and a persistent low-motion setting. The 3D module is dynamically loaded. Rendering pauses offscreen or when the page is hidden; geometry, materials and observers are disposed on unmount. Mobile rendering has lower pixel ratio and geometry detail. If WebGL2 is unavailable or context is lost, a compressed transparent sculpture image remains visible. It was generated with built-in ImageGen as a chrome torus knot with violet and cyan studio reflections, then compressed to WebP for delivery. Source prompt: chrome liquid-metal 2,3 torus knot; transparent cutout; silver softbox reflections; violet left light; cyan right rim; no text, floor or watermark.

## Verification

Production static build and strict TypeScript checks pass. Desktop and 390px Persian mobile layouts, project filtering, command search, mobile menu, technology selection and project routes were inspected in the preview browser. The test browser disables WebGL, so the live GPU-rendered sculpture could not be visually verified there; fallback behavior was verified instead. No Lighthouse score is claimed. Before future releases also inspect 360, 768, 1440 and 1920px, keyboard order, reduced motion, external links and the email-app handoff on a real device.


## Edition 04 improvements

- Keyboard and pointer rotation, pause and reset for the sculpture, including a working perspective interaction in the WebGL fallback.
- Editorial featured project, grid/list layouts, category filters and live result announcements.
- Four accessible method tabs with arrow-key, Home and End navigation.
- Project detail pages with contents navigation, project facts, language switching, related contact and next-project links.
- Self-hosted, variable Inter, Space Grotesk and Vazirmatn fonts. Font licenses are retained under `src/fonts/`.
- Theme and locale preferences applied before paint; expanded command search includes projects.
- `npm run verify:export` checks internal files, fragment targets and CSS font references. Run after the GitHub Pages build.

New controls and mobile layouts were inspected in preview at 360, 390 and 768px. WebGL rendering remains unverified in this environment because the preview browser disables GPU contexts; keyboard rotation, pause/reset and the fallback composition were verified.
