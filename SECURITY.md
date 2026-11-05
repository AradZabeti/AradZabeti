# Security policy

## Report a vulnerability

Please report sensitive findings privately using the contact details in the GitHub profile rather than opening a public issue with exploit details or credentials.

## Trust boundaries

The GitHub profile and GitHub Pages site are **public, static content**. Do not place API secrets, access tokens, passwords, SSH keys or private configuration in the repository or in frontend build variables.

`cpanel/terminal.php` is an **optional, read-only diagnostics service** for a separate cPanel server. GitHub Pages cannot run PHP, and committing this file does not deploy it to a PHP host.

## Mandatory bridge safeguards (API v1.3)

The bridge now **fails closed**:

1. All diagnostic commands, including `server`, `health` and `status`, require a valid `X-ARAD-TERMINAL-KEY` header; without a configured key of **at least 32 characters**, it returns HTTP 503.
2. A missing or incorrect supplied key returns HTTP 401. Secrets are checked with `hash_equals`.
3. Requests must use HTTPS; browser requests from other origins are refused. CORS preflight OPTIONS does not disclose diagnostics.
4. Diagnostic requests must use POST with `Content-Type: application/json`. Request payloads have a bounded size.
5. Commands remain allowlisted and do not invoke arbitrary shell commands.
6. The private configuration file is only loaded **outside** `public_html`. A `cpanel/terminal-config.php` within the web root is deliberately ignored.
7. Basic per-IP request throttling is included; consider a firewall or reverse-proxy rate limit for Internet-exposed deployments.

### Configuring a private key

**Preferred:** inject a cryptographically random secret using the server environment variable `ARAD_TERMINAL_KEY`. Alternatively, define the PHP constant `ARAD_TERMINAL_KEY` inside `terminal-config.php` located **outside** `public_html` (for the expected deployment layout, `/home/ACCOUNT/terminal-config.php`).

Generate a unique, random secret of at least 32 characters; restrict the private file to the web server user and rotate any previously exposed secret. **Do not paste the key into GitHub, frontend code, command-line URLs, README files or issue discussions.**

The bridge rejects non-HTTPS requests as indicated by PHP's `HTTPS` flag or server port 443. If TLS terminates at a reverse proxy, configure the server to pass reliable TLS state to PHP before enabling the bridge; do not blindly trust an unverified `X-Forwarded-Proto` header.

### Browser terminal and ARAD OS

- In `terminal.html`, enter `token YOUR_KEY` **before** `connect https://YOUR-API-DOMAIN/.../terminal.php`.
- The terminal masks the token in displayed command output and does not add it to command history.
- The token is held in **sessionStorage for the current tab session**, not persistent localStorage. ARAD OS uses the same session token for authenticated server telemetry; without it, telemetry remains locked.
- Close the tab or run `disconnect` to clear the session token. Avoid using the dashboard on shared or untrusted computers.
- A secret present in frontend JavaScript can still be read by XSS or other malicious same-origin scripts. Use a dedicated low-privilege diagnostics-only credential, and prefer a server-side identity-aware proxy for a future multi-user deployment.

## Deployment and verification

1. Review this change and successful GitHub Actions checks on the Pull Request.
2. Merge only after explicit owner approval.
3. Configure the secret outside the web root and confirm HTTPS on the PHP host.
4. Manually deploy the reviewed bridge to cPanel if needed. A GitHub Pages release does **not** update a separately hosted PHP endpoint.
5. Confirm unauthenticated requests are denied (401), unconfigured instances deny service (503) and authenticated diagnostics work.
6. Review proxy/firewall logs and immediately rotate the secret if browser or server compromise is suspected.

## Code review expectations

- Validate untrusted data before inserting it into the DOM.
- Preserve correct `rel="noopener noreferrer"` on external links opened in new tabs.
- Avoid leaking secrets in CI output or third-party tools.
- Keep GitHub Actions permissions at the least privilege necessary.
- Run the Python security tests and PHP syntax checks before merging.
