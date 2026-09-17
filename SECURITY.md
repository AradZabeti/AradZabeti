# Security

This is a public portfolio project with an optional server-side diagnostic bridge for a cPanel host.

## Reporting

For security issues affecting the repository or the deployed site, please contact:

`arad23426@gmail.com`

Please avoid publicly posting sensitive details before a fix is available.

## Scope

This project does not intentionally store private credentials in the frontend repository. API keys, OAuth secrets, passwords, SSH private keys and other sensitive credentials should never be committed to public files.

## cPanel Terminal Bridge

The optional `cpanel/terminal.php` endpoint is diagnostic-only. It uses an explicit command allowlist and does not execute arbitrary operating-system commands.

The bridge includes:

- GitHub Pages CORS allowlisting
- HTTPS-only browser connection flow
- JSON request validation and body-size limits
- Per-IP rate limiting
- Optional private-key authentication
- Private-key lookup that prefers a file outside `public_html`
- Restricted private diagnostics for `user` and `cwd`

Do not replace the allowlist with `shell_exec($_POST['command'])`, `exec()`, `system()`, `passthru()` or another arbitrary command runner.

## Security expectations

- Keep external links protected when opening new tabs.
- Do not introduce client-side secrets.
- Validate untrusted data before inserting it into the DOM.
- Prefer least-privilege GitHub Actions permissions.
- Keep third-party dependencies and actions reviewed before adoption.
- Keep `terminal-config.php` out of Git and out of the public repository.
- Prefer a strong, randomly generated cPanel terminal key for private diagnostics.
