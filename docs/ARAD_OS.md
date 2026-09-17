# ARAD OS

ARAD OS is the interactive identity layer of the Arad Zabeti profile.

## Surfaces

- `os.html` — project explorer, repository map, live public GitHub signal, Music Mode and Command Palette.
- `terminal.html` — profile shell with commands, history, Tab completion and Easter eggs.
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

## Security model

The terminal is a simulated profile interface. It does **not** execute operating-system commands, open a remote shell or forward user input to a backend.

The site is designed as a static GitHub Pages surface with client-side interactions only.
