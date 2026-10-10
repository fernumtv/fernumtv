const https = require('https');

const url = 'https://www.fernum.online/?bust=' + Date.now();

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== LIVE RESPONSE METADATA ===');
    console.log('Status:', res.statusCode);
    console.log('Server:', res.headers['server']);
    console.log('Cache:', res.headers['x-vercel-cache']);
    console.log('Age:', res.headers['age']);

    console.log('\n=== LIVE HEAD TAGS ===');
    const headMatch = data.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      console.log(headMatch[1].replace(/></g, '>\n<'));
    }

    console.log('\n=== LIVE FORM MARKUP ===');
    const formMatch = data.match(/<form[\s\S]*?<\/form>/i);
    if (formMatch) {
      console.log(formMatch[0].replace(/></g, '>\n<'));
    } else {
      console.log('No <form> found in initial HTML');
    }

    console.log('\n=== LIVE HOOK BATTLE DISCLAIMER & REWORDED HOOKS ===');
    console.log('Has "Sample hooks only":', data.includes('Sample hooks only. Only use claims that are true for your product.'));
    console.log('Has "sold out four times":', data.includes('sold out four times'));
    console.log('Has "sold out its initial batch":', data.includes('sold out its initial batch'));
    console.log('Has "the thing nobody tells you before you buy":', data.includes('the thing nobody tells you before you buy'));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
