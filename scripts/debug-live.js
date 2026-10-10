const https = require('https');

const urls = [
  'https://fernum.online/',
  'https://www.fernum.online/',
  'https://fernum.online/faq',
  'https://www.fernum.online/faq'
];

function fetchOne(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          location: res.headers.location,
          cacheControl: res.headers['cache-control'],
          age: res.headers['age'],
          etag: res.headers['etag'],
          netId: res.headers['x-nf-request-id'],
          ogImage: (data.match(/<meta property="og:image" content="([^"]+)"/) || [])[1],
          metaRobots: (data.match(/<meta name="robots" content="([^"]+)"/) || [])[1],
          hasConversionTested: data.includes('conversion-tested'),
          hasHideGdpr: data.includes('hide_gdpr_banner'),
          hasBarePricing: data.includes('href="#pricing"'),
          hasSlashPricing: data.includes('href="/#pricing"')
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

(async () => {
  for (const u of urls) {
    const res = await fetchOne(u);
    console.log(JSON.stringify(res, null, 2));
  }
})();
