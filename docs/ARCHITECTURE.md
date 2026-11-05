# Repository architecture

## Purpose

`AradZabeti/AradZabeti` is the public GitHub profile and bilingual developer portfolio.
The public Pages site is a **static export**. It does not require the optional cPanel bridge.

## Actual repository layout

```text
README.md                          GitHub profile, featured work, links
assets/                            Original SVG artwork and profile graphics
universe-source/                   Next.js / React / TypeScript / Three.js source
  package.json                     Build, typecheck and export-verification commands
  scripts/publish-pages.mjs        Copies a verified export to the repository root
index.html, about.html, ...        Published static Pages and editorial experiments
en/, fa/, resume/                 Localized pages and résumé routes
_next/, images/                    Exported static assets
cpanel/terminal.php                Optional PHP diagnostics endpoint (NOT on GitHub Pages)
terminal.html, os.html             Static client interfaces for opt-in diagnostics
scripts/check_site_links.py        Published-site local link validator
scripts/check_profile_readme.py    README / SVG validator
scripts/test_*.py                  Regression tests, including cPanel security tests
.github/workflows/
  portfolio-integrity.yml          Python tests, link checks, PHP syntax/security checks
  portfolio-source.yml             npm ci, Next.js build, TypeScript and export checks
.github/dependabot.yml             Weekly dependency maintenance
SECURITY.md                        Disclosure and safe bridge deployment
```

## Deployment boundaries

- **GitHub Pages** serves static HTML, CSS, JavaScript and assets from the project Pages site.
- **Next.js source** lives in `universe-source/`; the checked-in root also contains its static output. Source changes require a fresh verified export before deployment.
- **The optional PHP bridge** is **not** executed by GitHub Pages. Deploying `cpanel/terminal.php` to a separate cPanel host is a manual, separately approved step.
- The cPanel bridge is read-only and allowlisted, never an arbitrary shell.
- The bridge must remain inaccessible until a secret of at least 32 characters has been configured, and HTTPS must be available.
- The browser terminal stores a bridge key in **tab-scoped sessionStorage** to support ARAD OS in the same tab. A key is not placed in Git, query strings or long-lived localStorage. Browser-side secrets still carry XSS risk; never use a key with wider server privileges.

## Validation flow

```text
feature/security branch
   |
   +-- scripts/test_*.py (security + link regressions)
   +-- PHP lint (cpanel/terminal.php)
   +-- check_site_links.py / check_profile_readme.py
   +-- universe-source npm build + TypeScript + export checks (when source changes)
   |
   +-- review Pull Request and Actions results
   |
   +-- human-approved merge to main
   |
   +-- GitHub Pages deployment
```

## Design principles

- **Evidence over hype:** show working demos, source or clearly marked work in progress.
- **Static-first:** keep the public site fast, portable and independent of a backend.
- **Accessible by default:** semantic markup, keyboard navigation, alt text and reduced-motion support.
- **Security by default:** least-privilege actions, no public secrets, explicit server-side auth.
- **Consistent visual language:** profile, résumé, portfolio and SVGs share an identity; the next visual phase is Futuristic AI.

For disclosure, credentials, rollout precautions and the limits of the optional bridge, see [SECURITY.md](../SECURITY.md).
