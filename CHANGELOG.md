# Changelog

All notable profile, portfolio and repository improvements are tracked here.

## 2026-09-18

### Added

- Advanced cPanel Terminal Bridge API (`cpanel/terminal.php`)
- Server status, health, runtime, capability, PHP, OS, disk, web and security diagnostics
- Terminal latency testing with `ping`
- Live server monitoring with `watch` / `stopwatch`
- Optional private-key protection for sensitive server diagnostics
- cPanel deployment and security documentation

### Hardened

- Strict command allowlist; no arbitrary shell execution
- JSON request size limit
- Per-IP rate limiting
- GitHub Pages CORS allowlist
- HTTPS-only connection flow in the browser terminal
- Private configuration lookup prefers a file outside `public_html`
- Sensitive `user` and `cwd` diagnostics require a private API key

### Improved

- Interactive terminal toolbar and server connection state
- API latency and health visibility
- ARAD OS documentation and terminal command surface

## 2026-09-17

### Added

- Dedicated printable `resume.html` with responsive and print layouts
- Interactive `terminal.html` profile shell with keyboard history, Tab completion and Easter eggs
- `os.html` ARAD OS layer with project explorer, repository map, GitHub signal, Music Mode and Command Palette
- Interactive `404.html` recovery surface
- `docs/ARAD_OS.md` documentation for the interactive profile layer
- Repository architecture documentation
- Contribution guidelines
- Code of conduct
- Pull request template
- Bug and improvement issue templates
- Branded profile and system-map assets

### Improved

- Profile README visual identity and navigation
- Portfolio presentation and project evidence
- Security and public-repository documentation
- GitHub Pages presentation layer
- Terminal command surface: `whoami`, `neofetch`, `projects`, `stack`, `music`, `pwd`, `ls`, `cat about.txt`, `coffee`, `matrix` and `sudo hire-arad`
- 404 recovery flow now points visitors back into the portfolio ecosystem

### Principles

- Keep project claims evidence-based
- Prefer simple, maintainable presentation technology
- Treat accessibility, security and responsive behavior as part of the product
- Keep interactive profile features client-side and backend-free where possible
