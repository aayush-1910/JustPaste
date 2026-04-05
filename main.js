import QRCode from 'qrcode';

const MAX_CHARS = 1500;
const WARN_CHARS = 1200;

// URI-safe base64
function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64(b64) {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(padded)));
}

// Detect and linkify URLs in text
function linkify(text) {
  const urlPattern = /(https?:\/\/[^\s<]+)/g;
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// Determine mode based on hash
function getMode() {
  const hash = window.location.hash.slice(1);
  return hash ? 'receive' : 'paste';
}

// --- Paste Mode ---

function initPasteMode() {
  const pasteMode = document.getElementById('paste-mode');
  const input = document.getElementById('input');
  const charCount = document.getElementById('char-count');
  const generateBtn = document.getElementById('generate-btn');
  const qrOutput = document.getElementById('qr-output');
  const qrCanvas = document.getElementById('qr-canvas');
  const resetBtn = document.getElementById('reset-btn');

  pasteMode.classList.remove('hidden');

  function updateCount() {
    const len = input.value.length;
    charCount.textContent = `${len} / ${MAX_CHARS}`;
    charCount.classList.remove('warn', 'over');
    if (len > MAX_CHARS) {
      charCount.classList.add('over');
    } else if (len > WARN_CHARS) {
      charCount.classList.add('warn');
    }
    generateBtn.disabled = len === 0 || len > MAX_CHARS;
  }

  input.addEventListener('input', updateCount);

  generateBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text || text.length > MAX_CHARS) return;

    const encoded = toBase64(text);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;

    try {
      await QRCode.toCanvas(qrCanvas, url, {
        width: 280,
        margin: 2,
        color: {
          dark: '#ffffffFF',
          light: '#141414FF',
        },
      });
      input.disabled = true;
      generateBtn.classList.add('hidden');
      qrOutput.classList.remove('hidden');
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  });

  resetBtn.addEventListener('click', () => {
    input.value = '';
    input.disabled = false;
    qrOutput.classList.add('hidden');
    generateBtn.classList.remove('hidden');
    updateCount();
    input.focus();
  });
}

// --- Receive Mode ---

function initReceiveMode() {
  const receiveMode = document.getElementById('receive-mode');
  const contentDisplay = document.getElementById('content-display');
  const copyBtn = document.getElementById('copy-btn');

  let decoded = '';
  try {
    decoded = fromBase64(window.location.hash.slice(1));
  } catch {
    contentDisplay.textContent = 'Could not decode content.';
    copyBtn.disabled = true;
    receiveMode.classList.remove('hidden');
    return;
  }

  contentDisplay.innerHTML = linkify(decoded);
  receiveMode.classList.remove('hidden');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(decoded);
      copyBtn.textContent = 'Copied \u2713';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Tap to Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = decoded;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBtn.textContent = 'Copied \u2713';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Tap to Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }
  });
}

// --- Init ---

if (getMode() === 'receive') {
  initReceiveMode();
} else {
  initPasteMode();
}
