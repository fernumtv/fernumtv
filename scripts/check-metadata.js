const fs = require('fs');
const path = require('path');

const routes = [
  { path: '/', file: 'src/app/layout.tsx' },
  { path: '/work', file: 'src/app/work/layout.tsx' },
  { path: '/structure', file: 'src/app/structure/layout.tsx' },
  { path: '/how-we-test', file: 'src/app/how-we-test/layout.tsx' },
  { path: '/faq', file: 'src/app/faq/layout.tsx' },
  { path: '/about', file: 'src/app/about/layout.tsx' },
  { path: '/schedule', file: 'src/app/schedule/page.tsx' },
  { path: '/terms', file: 'src/app/terms/page.tsx' },
  { path: '/refund', file: 'src/app/refund/page.tsx' },
  { path: '/privacy', file: 'src/app/privacy/page.tsx' },
  { path: '/login', file: 'src/app/login/layout.tsx' },
  { path: '/thanks', file: 'src/app/thanks/page.tsx' },
  { path: '/cancelled', file: 'src/app/cancelled/page.tsx' },
  { path: '/404', file: 'src/app/not-found.tsx' }
];

const results = [];

routes.forEach(r => {
  const filePath = path.join(__dirname, '..', r.file);
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  const descMatch = content.match(/description:\s*(?:["']([^"']+)["']|`([^`]+)`)/);
  const title = titleMatch ? titleMatch[1] : 'NOT FOUND';
  const descRaw = descMatch ? (descMatch[1] || descMatch[2]) : 'NOT FOUND';
  const desc = descRaw.replace(/\s+/g, ' ').trim();
  results.push({
    page: r.path,
    file: r.file,
    title,
    titleLen: title.length,
    titleValid: title.length < 60,
    desc,
    descLen: desc.length,
    descValid: desc.length >= 120 && desc.length <= 155
  });
});

console.table(results.map(r => ({
  Page: r.page,
  Title: r.title,
  'Title Len': r.titleLen,
  'Title < 60': r.titleValid ? 'PASS' : 'FAIL',
  'Desc Len': r.descLen,
  'Desc (120-155)': r.descValid ? 'PASS' : 'FAIL'
})));

const failures = results.filter(r => !r.titleValid || !r.descValid);
if (failures.length > 0) {
  console.log('FAILURES TO FIX:');
  failures.forEach(f => {
    console.log(`- ${f.page}: Title(${f.titleLen})="${f.title}", Desc(${f.descLen})="${f.desc}"`);
  });
} else {
  console.log('ALL METADATA TITLES AND DESCRIPTIONS PASS VALIDATION!');
}
