const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { name: 'Supabase Service Role Key JWT', regex: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}service_role/ },
  { name: 'OpenAI Secret Key', regex: /sk-[a-zA-Z0-9]{32,}/ },
  { name: 'Google API Key', regex: /AIzaSy[a-zA-Z0-9_-]{33}/ },
  { name: 'AWS Access Key ID', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/ },
  { name: 'Slack Token', regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/ },
  { name: 'Private Key Block', regex: /-----BEGIN (?:RSA|EC|PGP|OPENSSH|PRIVATE) KEY-----/ },
  { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
  { name: 'Dodo Live Secret Key', regex: /dodo_live_[0-9a-zA-Z]{20,}/ },
  { name: 'Fal Key Secret', regex: /fal_[0-9a-zA-Z]{24,}/ }
];

const SCAN_DIRS = [
  path.join(__dirname, '../src'),
  path.join(__dirname, '../public')
];

let foundSecrets = [];

function scanFile(filePath) {
  // Skip binary files and big media files
  const ext = path.extname(filePath).toLowerCase();
  if (['.mp4', '.webm', '.webp', '.jpg', '.jpeg', '.png', '.ico', '.svg', '.woff', '.woff2'].includes(ext)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const { name, regex } of SECRET_PATTERNS) {
    if (regex.test(content)) {
      foundSecrets.push({ file: filePath, pattern: name });
    }
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
        walkDir(fullPath);
      }
    } else {
      scanFile(fullPath);
    }
  }
}

console.log('Running pre-build secret scan across source code and static assets...');
SCAN_DIRS.forEach(walkDir);

if (foundSecrets.length > 0) {
  console.error('\x1b[31m[SECURITY FAILURE] Potential secrets discovered in frontend source files:\x1b[0m');
  foundSecrets.forEach(s => console.error(`  - ${s.file} matched ${s.pattern}`));
  process.exit(1);
} else {
  console.log('\x1b[32m[SECURITY PASS] No private secrets or credentials detected in source code.\x1b[0m');
}
