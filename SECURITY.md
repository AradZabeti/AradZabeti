# Security

This is a public static portfolio project.

## Reporting

For security issues affecting the repository or the deployed site, please contact:

`arad23426@gmail.com`

Please avoid publicly posting sensitive details before a fix is available.

## Scope

This project does not intentionally store private credentials in the frontend repository. API keys, OAuth secrets, passwords, and other sensitive credentials should never be committed to public files.

## Security expectations

- Keep external links protected when opening new tabs.
- Do not introduce client-side secrets.
- Validate untrusted data before inserting it into the DOM.
- Prefer least-privilege GitHub Actions permissions.
- Keep third-party dependencies and actions reviewed before adoption.
