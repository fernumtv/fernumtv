function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05));
}

const pairs = [
  { name: 'Cream background with Dark text', bg: '#F7F3EB', fg: '#111111', target: '4.5:1 (Body)' },
  { name: 'Dark background with Cream text', bg: '#111111', fg: '#F7F3EB', target: '4.5:1 (Body)' },
  { name: 'Orange accent with Dark text', bg: '#F14A0A', fg: '#111111', target: '3.0:1 (Large/UI)' },
  { name: 'Green accent with Dark text', bg: '#16C846', fg: '#111111', target: '4.5:1 (Body)' },
  { name: 'Purple accent with Cream text', bg: '#6C3BF5', fg: '#F7F3EB', target: '4.5:1 (Body)' },
  { name: 'Yellow sticker with Dark text', bg: '#FFD400', fg: '#111111', target: '4.5:1 (Body)' },
  { name: 'Red sticker with Dark text / Cream', bg: '#F33418', fg: '#FFFFFF', target: '3.0:1 (Large/UI)' }
];

console.table(pairs.map(p => {
  const ratio = contrast(p.bg, p.fg);
  return {
    Pair: p.name,
    Background: p.bg,
    Foreground: p.fg,
    Ratio: ratio.toFixed(2) + ':1',
    Target: p.target,
    Pass: (ratio >= 4.5 || (p.target.includes('3.0') && ratio >= 3.0)) ? 'PASS' : 'FAIL'
  };
}));
