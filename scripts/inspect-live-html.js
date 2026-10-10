const https = require('https');

https.get('https://www.fernum.online/', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const scripts = data.match(/src="\/_next\/static\/chunks\/[^"]+"/g) || [];
    console.log('Scripts in live https://www.fernum.online/:', scripts);
    console.log('--- HEAD HTML ---');
    const head = data.match(/<head>([\s\S]*?)<\/head>/i);
    console.log(head ? head[1] : 'No head tag found');
    console.log('--- CALENDLY LINKS IN HTML ---');
    const calendly = data.match(/href="https:\/\/calendly\.com[^"]*"/g) || [];
    console.log(calendly);
    console.log('--- BRIEF FORM TEXT SNIPPET ---');
    const briefIndex = data.indexOf('conversion-tested');
    console.log('Index of conversion-tested:', briefIndex);
  });
});
