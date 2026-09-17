# ARAD OS

ARAD OS is the interactive identity layer of the Arad Zabeti profile.

## Surfaces

- `os.html` — project explorer, repository map, live public GitHub signal, Music Mode and Command Palette.
- `terminal.html` — profile shell with commands, history, Tab completion, Easter eggs and an optional safe cPanel diagnostic bridge.
- `index.html` — main portfolio surface.
- `resume.html` — printable one-page CV.
- `404.html` — interactive recovery surface.

## Command Palette

Use **Ctrl + K** on Windows/Linux or **Cmd + K** on macOS to open the palette.

Available destinations include Projects, GitHub Signal, Music Mode, Terminal, Resume, Portfolio, GitHub and KookTools.

## Music Mode

Music Mode is a browser-side visual/audio interaction. The audio starts only after the user presses the button, and it uses a simple Web Audio oscillator. No microphone access, recording or server-side audio processing is used.

## GitHub Signal

The OS reads public GitHub profile and public-event endpoints client-side. When the API is unavailable, the page keeps working and displays a non-blocking unavailable state.

## cPanel Terminal Bridge

The Terminal page can optionally call `cpanel/terminal.php` deployed on a user's cPanel PHP host. The bridge exposes diagnostics only: server status, PHP version/extensions, OS identifiers, disk usage, PHP user, working directory and health status.

It does **not** accept arbitrary shell commands. The browser stores only the configured API URL and, when used, an optional private API key in local storage on that device.

Deployment instructions live in `docs/CPANEL_TERMINAL.md`.

## Security model

Do not put cPanel passwords, SSH private keys or API secrets in GitHub Pages files. The cPanel API supports an optional server-side `terminal-config.php` key and includes a lightweight rate limit.
