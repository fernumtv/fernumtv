const https = require('https');

const url = 'https://www.fernum.online/?bust=' + Date.now();

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('=== HTTP RESPONSE ===');
    console.log('Status:', res.statusCode);
    console.log('Server:', res.headers['server']);
    console.log('Cache:', res.headers['x-vercel-cache']);
    console.log('X-Robots-Tag:', res.headers['x-robots-tag']);
    console.log('Age:', res.headers['age']);

    console.log('\n=== HEAD TAGS ===');
    const headMatch = data.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      console.log(headMatch[1].replace(/></g, '>\n<'));
    } else {
      console.log('No <head> tag found');
    }

    console.log('\n=== FOOTER HTML ===');
    const footerMatch = data.match(/<footer[\s\S]*?<\/footer>/i);
    if (footerMatch) {
      console.log(footerMatch[0].slice(0, 1500) + '\n... [truncated for display] ...\n' + footerMatch[0].slice(-500));
    } else {
      console.log('No <footer> tag found');
    }

    console.log('\n=== KEY VERIFICATION CHECKS ===');
    const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('Meta Robots:', data.match(/<meta[^>]*name="robots"[^>]*>/gi));
    console.log('OG Image:', data.match(/<meta[^>]*property="og:image"[^>]*>/gi));
    console.log('Twitter Image:', data.match(/<meta[^>]*name="twitter:image"[^>]*>/gi));
    console.log('H1 Headings count:', (data.match(/<h1/g) || []).length);
    console.log('H1 Text:', (data.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('Has conversion-tested:', data.includes('conversion-tested'));
    console.log('Has Cookie settings:', data.includes('Cookie settings'));
    console.log('Calendly Links:', data.match(/href="https:\/\/calendly\.com[^"]*"/g));
  });
}).on('error', (err) => {
  console.error('Error fetching URL:', err.message);
});
