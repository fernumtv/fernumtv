const fs = require('fs');

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');

console.log('1. Has "Sample hooks only":', html.includes('Sample hooks only. Only use claims that are true for your product.'));
console.log('2. Has "sold out four times":', html.includes('sold out four times'));
console.log('3. Has "sold out its initial batch":', html.includes('sold out its initial batch'));
console.log('4. Has "[Your product]: the thing nobody tells you before you buy":', html.includes('the thing nobody tells you before you buy'));

const formMatch = html.match(/<form[^>]*name="ad-brief"[\s\S]*?<\/form>/i);
if (formMatch) {
  console.log('\n5. Form snippet:');
  const honeypotMatch = formMatch[0].match(/<div[^>]*aria-hidden="true"[\s\S]*?<\/div>/i);
  console.log(honeypotMatch ? honeypotMatch[0] : 'Honeypot not found in form');
} else {
  console.log('Form not found in index.html');
}
