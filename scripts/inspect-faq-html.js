const https = require('https');

https.get('https://www.fernum.online/faq', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('--- FAQ HEAD HTML ---');
    const head = data.match(/<head>([\s\S]*?)<\/head>/i);
    console.log(head ? head[1] : 'No head tag found');
    console.log('--- FAQ PRICING LINKS IN HTML ---');
    const pricingLinks = data.match(/href="[^"]*pricing[^"]*"/g) || [];
    console.log(pricingLinks);
  });
});
