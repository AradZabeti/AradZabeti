# cPanel Terminal Bridge

`cpanel/terminal.php` is the server-side bridge for the GitHub Pages terminal. It exposes a deliberately small diagnostic API for a cPanel PHP host. It does **not** execute arbitrary shell commands.

## API surface

The browser sends JSON such as:

```json
{"command":"server"}
```

Public diagnostics:

- `server` — PHP/SAPI/OS/kernel/web/HTTPS/time/disk/API version
- `status` — compact operational snapshot
- `health` — capability and filesystem/runtime health checks
- `runtime` — PHP runtime limits and timezone
- `capabilities` — common PHP extensions/features
- `php` — PHP, SAPI and Zend versions
- `os` — operating-system identifiers
- `disk` — total/free/used disk space
- `web` — web-server/protocol/HTTPS details
- `security` — transport, origin, key, rate-limit and shell posture

Private diagnostics:

- `user` — PHP/server user information
- `cwd` — API working directory

`user` and `cwd` require the optional private API key.

## Rate limiting and request limits

The bridge has a lightweight per-IP rate limit of 45 requests per 60 seconds and rejects request bodies larger than 2 KB. The API also sends `X-Content-Type-Options: nosniff`, a restrictive referrer policy and locks browser CORS to the GitHub Pages origin by default.

## cPanel deployment

1. Open **cPanel → File Manager**.
2. Create `public_html/api/` on the target domain.
3. Upload `cpanel/terminal.php` as `public_html/api/terminal.php`.
4. Make sure the domain uses HTTPS.
5. From the GitHub Pages Terminal, run:

```text
connect https://YOUR-DOMAIN.example/api/terminal.php
```

For this profile's current academy domain:

```text
connect https://arghanounacademy.ir/api/terminal.php
```

## Optional private key

For personal/private diagnostics, create the config **outside `public_html`** when possible. On a normal cPanel layout, that means the account home directory next to `public_html`:

```text
/home/ACCOUNT/terminal-config.php
/home/ACCOUNT/public_html/api/terminal.php
```

Use:

```php
<?php
const ARAD_TERMINAL_KEY = 'replace-with-a-long-random-value';
```

The bridge also supports a same-directory `public_html/api/terminal-config.php` for compatibility, but the outside-`public_html` location is preferred.

When the key is configured, send it from the browser terminal with:

```text
token YOUR_PRIVATE_KEY
```

The terminal stores the key only in browser local storage. It is never written into the GitHub repository by the client code.

## Terminal commands

```text
connect URL
endpoint
disconnect
status
server
health
metrics
stats
runtime
capabilities
php
os
disk
web
security
ping
watch 10
monitor
alerts
stopalerts
stopwatch
dashboard
diagnose
sites
explorer
deploy
sysinfo
music
user     # private key required
cwd      # private key required
```

`watch 10` refreshes server status every 10 seconds. The client clamps the interval to a safe 10–60 second range.

## Security model

- The API has a strict allowlist; unknown commands are rejected.
- No `shell_exec`, `exec`, `system`, `passthru` or user-controlled command runner is used.
- Never put cPanel passwords, SSH private keys or secrets in `terminal.html`.
- Keep `terminal-config.php` out of the public Git repository.
- Use HTTPS only.
- Keep the private-key mode enabled for `user` and `cwd` if those diagnostics are needed.

## ARAD OS command layer

The public terminal now exposes a unified control surface: `dashboard`, `monitor`, `alerts`, `diagnose`, `metrics`, `stats`, `sites`, `explorer`, `deploy`, `sysinfo`, and `music`. `explorer` is intentionally limited to the known profile tree; `deploy` is a readiness/dry-run view and does not execute deployment or shell commands from the public page.
