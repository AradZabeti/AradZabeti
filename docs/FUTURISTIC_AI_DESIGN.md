# Futuristic AI — GitHub identity system

> Visual identity specification for the GitHub profile README. The static portfolio website has not been redesigned in this phase.

## Concept

**Systems with a human touch.** A dark, architectural, future-facing visual system that connects responsible automation, dependable software and creative technology. The orbital neural constellation is an **original abstract design motif**; it is not a claim that the site runs an AI model.

## Tokens

| Role | Token | Value |
| --- | --- | --- |
| Base | Midnight | `#050915` |
| Depth | Navy-violet | `#10152B` |
| Signal | Electric cyan | `#70E7F7` |
| Intelligence | Soft violet | `#B295FF` |
| Activity | Mint accent | `#54E6D8` |
| Type | Primary | `#F2F7FF` |
| Type | Supporting | `#9CB7D6` |

Avoid neon for running body copy. Bright accents primarily signal focal points, connecting lines and framing.

## Asset map

| Asset | Native canvas | Role |
| --- | --- | --- |
| `assets/github-cover.svg` | 1600 × 560 | Main developer profile identity and abstract neural constellation |
| `assets/github-universe.svg` | 760 × 340 | Digital Universe project panel |
| `assets/github-kooktools.svg` | 760 × 340 | KookTools project panel with audio waveform |
| `assets/system-map.svg` | 1600 × 560 | Existing engineering process illustration |
| `assets/neon-divider.svg` | Existing | Supporting separator, retained |

The three redesigned assets are local, plain SVG source files with no embedded JavaScript, remote images, or external fonts. They remain readable if animation is disabled or SVG animation is unsupported.

## Typography and layout

- A geometric sans-serif system fallback for hero headings, plus monospace for technical labels.
- Prefer left-aligned hero typography with substantial space separating it from the graphic.
- Maintain distinct hierarchy: name → discipline → focus areas → process.
- Display project cards consistently in a two-column README table, allowing GitHub to reflow as supported.
- Treat the image as illustrative, not as the sole carrier of essential information. The README contains the actual headings, links and descriptions as selectable text.

## Accuracy and accessibility

- Every SVG must have a nonempty `<title>` and `<desc>` and the README must give images meaningful alt text.
- The profile should accurately label live work, demos, sources and experimental concepts.
- Do not manufacture commits, activity statistics, experience levels or project statuses.
- Third-party GitHub stats remain optional and may be unavailable. Do not build critical navigation around them.
- Prefer static artwork and lightweight markup. If motion is introduced later, respect `prefers-reduced-motion`.
- Keep image source code clean, without scripts, `foreignObject`, external images or remote content.

## Workflow

1. Make future visual changes on a dedicated design branch and include before/after review in the PR.
2. Run `python -m unittest discover -s scripts -p 'test_*.py' -v` plus the existing profile and site checks.
3. Check SVG previews, text legibility on mobile, README links and GitHub dark/light interface readability.
4. Keep the main branch unchanged until the owner reviews and explicitly approves a merge.
5. Follow a separate, later PR for a broader GitHub Pages redesign; avoid bundling a full Next.js rewrite into profile artwork changes.

This design intentionally focuses on the **profile identity** rather than claiming to introduce new products or backend capabilities.
