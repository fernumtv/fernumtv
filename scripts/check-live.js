const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
        const canonMatch = data.match(/<link rel="canonical" href="([^"]*)"/i);
        resolve({
          url,
          status: res.statusCode,
          title: titleMatch ? titleMatch[1] : 'None',
          canon: canonMatch ? canonMatch[1] : 'None',
          hasConfirm: data.includes('CONFIRM'),
          hasBracket: data.includes('[BRACKET]') || data.includes('[Company Name]'),
          hasMetaPolicy: data.includes('Compliant with Meta'),
          hasClientLogin: data.includes('Client login'),
          h1Count: (data.match(/<h1/g) || []).length,
          length: data.length,
          snippet: data.slice(0, 500)
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

(async () => {
  const urls = [
    'https://www.fernum.online/',
    'https://www.fernum.online/faq',
    'https://www.fernum.online/privacy',
    'https://www.fernum.online/terms',
    'https://www.fernum.online/work'
  ];
  for (const u of urls) {
    const res = await check(u);
    console.log(JSON.stringify(res, null, 2));
  }
})();
