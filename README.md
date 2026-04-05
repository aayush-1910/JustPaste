# JustPaste — Project Spec

## Overview

Disposable text transfer between devices via QR code. No backend, no accounts, no storage.

## Architecture

**URL-hash encoding approach.** Text is base64-encoded into the URL fragment (`#`). The QR code contains the full URL. Recipient device scans, opens the link, page decodes the hash and displays content with a one-tap copy button.

Why this over a backend:
- Zero server cost, zero storage, zero expiry logic needed
- Data never touches a server — true privacy
- Deployable as a static site (GitHub Pages, Vercel, Netlify)
- Nothing to maintain

Trade-off: QR codes degrade past ~2,953 bytes (alphanumeric mode). With base64 overhead (~33%), practical limit is ~1,500 chars of raw text. Fine for links, magnet URIs, short code snippets, notes. Longer content would need a backend (future scope).

## Tech Stack

- **Framework:** Vite + vanilla JS (no React needed — this is too simple)
- **Styling:** Single CSS file, dark theme, mobile-first
- **QR generation:** `qrcode` npm package (generates to canvas)
- **Encoding:** `btoa`/`atob` with URI-safe base64
- **Deployment:** Static site — GitHub Pages or Vercel

## Pages / Views

Single page, two modes detected by URL hash presence:

### 1. Paste Mode (no hash)
- Textarea input
- Character counter (warn at 1200, hard cap at 1500)
- "Generate QR" button
- Displays QR code on canvas
- Instruction text: "Scan this on your other device"

### 2. Receive Mode (hash present)
- Decodes base64 from hash
- Displays content in a read-only block
- Large "Tap to Copy" button (full-width, thumb-friendly)
- Visual feedback: button text changes to "Copied ✓" for 2s
- Content type detection: auto-linkify URLs, style code blocks

## UX Details

- Dark theme (#0a0a0a background, clean contrast)
- Mobile-first: receive mode optimized for phone screens
- QR code sized for easy scanning (280x280 min)
- No animations beyond the copy feedback
- Monospace font for content display

## File Structure

```
justpaste/
├── index.html
├── style.css
├── main.js
├── package.json
└── claude.md
```

## Future Scope (not v1)

- Backend mode for large text (Redis + short UUID, 10-min TTL)
- Drag-and-drop file transfer (small files as data URIs)
- PWA support for offline receive mode
- Encryption option (passphrase in QR, key shared separately)
