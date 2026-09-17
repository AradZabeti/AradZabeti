# Repository Architecture

## Purpose

`AradZabeti/AradZabeti` is the public identity, portfolio, and technical résumé layer for Arad Zabeti.

It intentionally stays lightweight: static HTML/CSS, GitHub Pages, local SVG assets, and documentation. There is no application server or runtime dependency required for the public site.

## Surface map

```text
profile README
     │
     ├── identity + skills + featured work
     ├── GitHub activity signals
     └── links to live portfolio + resume

GitHub Pages
     │
     ├── index.html   → interactive portfolio
     ├── resume.html  → printable CV
     └── 404.html     → branded fallback page

assets/
     │
     ├── profile-hero.svg
     ├── system-map.svg
     └── neon-divider.svg

repository health
     │
     ├── SECURITY.md
     ├── CONTRIBUTING.md
     ├── CODE_OF_CONDUCT.md
     └── .github/
          ├── ISSUE_TEMPLATE/
          ├── pull_request_template.md
          └── workflows/quality.yml
```

## Design principles

### Evidence over hype
Project descriptions should be traceable to a demo, source code, documentation, or a clearly stated concept/building status.

### Static-first
The public experience should remain fast, portable, and easy to audit. Avoid unnecessary frameworks or runtime services for presentation-only features.

### Accessible by default
Use semantic HTML, keyboard-visible focus states, responsive layouts, meaningful alternative text, and reduced-motion support where animations exist.

### Security by default
No API keys or secrets belong in client-side files. External links should use safe target handling. Security concerns are documented in `SECURITY.md`.

### Single source of visual truth
The portfolio, resume, profile README, and SVG assets should share the same visual language: dark technical surfaces, restrained accent colors, strong typography, and clear hierarchy.

## Change flow

```text
edit
  ↓
quality workflow
  ↓
GitHub Pages build
  ↓
review live output
  ↓
iterate
```
