const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function verify() {
  console.log('=== VERIFYING LIVE DEPLOYMENT ON HTTPS://WWW.FERNUM.ONLINE / FERNUM.ONLINE ===\n');

  // 1. Home page headers
  const home = await fetchUrl('https://www.fernum.online/');
  console.log('--- 1. HOME PAGE HEADERS (https://www.fernum.online/) ---');
  console.log({
    status: home.status,
    'strict-transport-security': home.headers['strict-transport-security'],
    'x-content-type-options': home.headers['x-content-type-options'],
    'x-frame-options': home.headers['x-frame-options'],
    'referrer-policy': home.headers['referrer-policy'],
    'permissions-policy': home.headers['permissions-policy'],
    'content-security-policy': home.headers['content-security-policy']?.slice(0, 120) + '...',
    'x-robots-tag': home.headers['x-robots-tag']
  });

  // 2. Head tags of /, /privacy, /faq, /work
  const pages = ['/', '/privacy', '/faq', '/work'];
  console.log('\n--- 2. HEAD TAGS OF CORE PAGES ---');
  for (const p of pages) {
    const res = await fetchUrl(`https://www.fernum.online${p}`);
    const headMatch = res.data.match(/<head>([\s\S]*?)<\/head>/i);
    const headContent = headMatch ? headMatch[1] : '';
    const titleMatch = res.data.match(/<title>([^<]*)<\/title>/i);
    const descMatch = res.data.match(/<meta name="description" content="([^"]*)"/i);
    const canonMatch = res.data.match(/<link rel="canonical" href="([^"]*)"/i);
    const ogImgMatch = res.data.match(/<meta property="og:image" content="([^"]*)"/i);
    const robotsMatch = res.data.match(/<meta name="robots" content="([^"]*)"/i);
    
    console.log(`\nPAGE: ${p}`);
    console.log(`Status: ${res.status}`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
    console.log(`Description: ${descMatch ? descMatch[1] : 'N/A'}`);
    console.log(`Canonical: ${canonMatch ? canonMatch[1] : 'N/A'}`);
    console.log(`OG Image: ${ogImgMatch ? ogImgMatch[1] : 'N/A'}`);
    console.log(`Meta Robots: ${robotsMatch ? robotsMatch[1] : 'N/A'}`);
    console.log(`H1 count: ${(res.data.match(/<h1/g) || []).length}`);
    console.log(`Has [BRACKET]: ${res.data.includes('[BRACKET]') || res.data.includes('[Company Name]')}`);
    console.log(`Has CONFIRM: ${res.data.includes('CONFIRM')}`);
    console.log(`Has Compliant with Meta: ${res.data.includes('Compliant with Meta')}`);
    console.log(`Has Client login: ${res.data.includes('Client login')}`);
    console.log(`Has Cookie Settings: ${res.data.includes('Cookie settings')}`);
  }

  // 3. Sitemap and Robots
  console.log('\n--- 3. /robots.txt ---');
  const robots = await fetchUrl('https://www.fernum.online/robots.txt');
  console.log(`Status: ${robots.status}`);
  console.log(robots.data.trim());

  console.log('\n--- 4. /sitemap.xml ---');
  const sitemap = await fetchUrl('https://www.fernum.online/sitemap.xml');
  console.log(`Status: ${sitemap.status}`);
  const urls = (sitemap.data.match(/<loc>[^<]+<\/loc>/g) || []).map(u => u.replace(/<\/?loc>/g, ''));
  console.log(`Total URLs in sitemap: ${urls.length}`);
  urls.forEach(u => console.log(`  - ${u}`));

  // 4. Icons and Manifest
  console.log('\n--- 5. ICONS & MANIFEST VERIFICATION ---');
  const assets = ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png', '/site.webmanifest', '/images/og-image.jpg'];
  for (const a of assets) {
    const assetRes = await fetchUrl(`https://www.fernum.online${a}`);
    console.log(`${a}: Status ${assetRes.status} (Length: ${assetRes.data.length} bytes)`);
  }
}

verify();
