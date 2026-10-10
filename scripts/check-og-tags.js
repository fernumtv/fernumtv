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

const issues = [];

routes.forEach(r => {
  const filePath = path.join(__dirname, '..', r.file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasOgTitle = content.includes('openGraph:') && content.includes('title:');
  const hasOgDesc = content.includes('openGraph:') && content.includes('description:');
  const hasOgUrl = r.path === '/' || content.includes(`url: "https://fernum.online${r.path === '/' ? '' : r.path}"`) || content.includes(`url: 'https://fernum.online${r.path === '/' ? '' : r.path}'`);
  const hasOgJpg = content.includes('/images/og-image.jpg');
  const hasTwitter = content.includes('twitter:') && content.includes('summary_large_image');
  
  if (!hasOgTitle || !hasOgDesc || !hasOgUrl || !hasOgJpg || !hasTwitter) {
    issues.push({
      path: r.path,
      file: r.file,
      hasOgTitle,
      hasOgDesc,
      hasOgUrl,
      hasOgJpg,
      hasTwitter
    });
  }
});

console.log('Issues found:', issues);
