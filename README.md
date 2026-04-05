# JustPaste

Paste text on one device, scan a QR code, copy it on another.

No accounts. No backend. No data stored.

## How it works

Your text gets base64-encoded directly into the URL. The QR code is just a link containing your content. Scan it on your other device, the page decodes the hash, and you get a one-tap copy button.

Nothing ever touches a server. The data lives entirely in the QR code.

Works for links, magnet URIs, code snippets, notes, or anything under ~1500 characters. Past that, QR codes get too dense for phone cameras to scan reliably.

## Tech stack

- Vite + vanilla JS (no framework needed for something this simple)
- QR generation using the `qrcode` library
- URL-safe base64 encoding for the text payload
- Clipboard API with `execCommand` fallback for older browsers
- Dark theme, mobile-first CSS, monospace content display

The entire app is a static site. No server, no database, no API.

## License

MIT
