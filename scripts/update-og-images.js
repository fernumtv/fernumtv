const fs = require('fs');
const path = require('path');

const files = [
  'src/app/work/layout.tsx',
  'src/app/structure/layout.tsx',
  'src/app/how-we-test/layout.tsx',
  'src/app/faq/layout.tsx',
  'src/app/about/layout.tsx',
  'src/app/schedule/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/refund/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/login/layout.tsx',
  'src/app/thanks/page.tsx',
  'src/app/cancelled/page.tsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, '..', f);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace og-image.webp with og-image.jpg
  content = content.replace(/og-image\.webp/g, 'og-image.jpg');
  
  // Ensure images array in openGraph has alt
  content = content.replace(
    /images:\s*\[\{\s*url:\s*"https:\/\/fernum\.online\/images\/og-image\.jpg",\s*width:\s*1200,\s*height:\s*630\s*\}\]/g,
    'images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }]'
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${f}`);
});
