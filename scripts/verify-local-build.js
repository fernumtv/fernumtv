const fs = require('fs');

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');

console.log('Title:', html.match(/<title>([^<]*)<\/title>/i)?.[1]);
console.log('Meta Robots:', html.match(/<meta[^>]*name="robots"[^>]*>/gi));
console.log('OG Image:', html.match(/<meta[^>]*property="og:image"[^>]*>/gi));
console.log('Twitter Image:', html.match(/<meta[^>]*name="twitter:image"[^>]*>/gi));
console.log('H1 count:', (html.match(/<h1/g) || []).length);
console.log('Has conversion-tested:', html.includes('conversion-tested'));
console.log('Has Cookie settings:', html.includes('Cookie settings'));
console.log('Calendly links:', html.match(/href="https:\/\/calendly\.com[^"]*"/g));
