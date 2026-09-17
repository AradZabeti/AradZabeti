# cPanel Terminal Bridge

`cpanel/terminal.php` is a small server-side API intended for a cPanel PHP host. It is designed to let the static GitHub Pages terminal display safe server diagnostics without exposing a general-purpose shell.

## What it exposes

The API accepts a JSON body such as:

```json
{"command":"server"}
```

Allowed commands are:

- `server` — PHP/SAPI/OS/web-server/time/disk summary
- `php` — PHP version, SAPI and loaded extensions
- `os` — operating-system family and kernel identifiers
- `disk` — total/free disk space and usage percentage
- `user` — PHP/server user fields
- `cwd` — current API directory
- `health` — lightweight health check

Arbitrary shell commands are deliberately rejected.

## cPanel deployment

1. Open **cPanel → File Manager**.
2. Create `public_html/api/` on the target domain.
3. Upload `cpanel/terminal.php` as `public_html/api/terminal.php`.
4. Make sure the domain uses HTTPS.
5. Test the endpoint with a POST request containing `{"command":"health"}`.

The browser origin allowed by default is:

`https://aradzabeti.github.io`

The API also allows direct requests with no `Origin` header, which is useful for curl/Postman testing.

## Optional private key

For personal/private usage, create `public_html/api/terminal-config.php` on cPanel. Do not commit this file to GitHub.

```php
<?php
const ARAD_TERMINAL_KEY = 'replace-with-a-long-random-value';
```

When this file exists, requests must include:

`X-ARAD-TERMINAL-KEY: replace-with-a-long-random-value`

The frontend should store the key locally on the user's device rather than putting it in the public repository.

## Connecting the browser terminal

After deployment, open the GitHub Pages terminal and run:

```text
connect https://YOUR-DOMAIN.example/api/terminal.php
```

Then test:

```text
server
php
os
disk
user
cwd
health
```

The endpoint URL is saved in browser `localStorage` on that device.

## Security notes

- Never put cPanel passwords, SSH private keys or API secrets in `terminal.html`.
- Keep `terminal-config.php` out of the Git repository.
- Do not replace the allowlist with `shell_exec($_POST['command'])` or another arbitrary command runner.
- Use HTTPS only.
- The API includes a lightweight per-IP rate limit.
