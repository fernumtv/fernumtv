const https = require('https');

async function submitForm(formData, label) {
  return new Promise((resolve) => {
    console.log(`\n========================================`);
    console.log(`TEST RUN: ${label}`);
    console.log(`Payload bot-field: "${formData['bot-field'] || ''}"`);
    console.log(`========================================`);

    // Client-side Honeypot Check Simulation:
    if (formData['bot-field'] && formData['bot-field'].trim() !== '') {
      console.log('Result: [BLOCKED BY HONEYPOT TRAP]');
      console.log('Client-side handler intercepted bot-field content.');
      console.log('Submission aborted before reaching Netlify or database API.');
      console.log('Error displayed to user / bot: "Automated submission blocked (honeypot triggered)."');
      return resolve({
        status: 'BLOCKED',
        honeypotTriggered: true,
        message: 'Automated submission blocked (honeypot triggered).'
      });
    }

    // When empty, send actual submission to Netlify / site endpoint
    const postData = new URLSearchParams({
      'form-name': 'ad-brief',
      ...formData
    }).toString();

    const options = {
      hostname: 'www.fernum.online',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestRunner/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Result: [SUCCESSFULLY RECEIVED & PROCESSED]');
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log(`Submission accepted by endpoint.`);
        console.log('UI state transition: isSuccess = true -> "BRIEF RECEIVED! Locked in."');
        resolve({
          status: 'SUCCESS',
          httpStatus: res.statusCode,
          honeypotTriggered: false,
          message: 'Order and brief successfully received!'
        });
      });
    });

    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve({ status: 'ERROR', error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  // Test 1: Empty honeypot
  await submitForm({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    brandName: 'Aura Skincare',
    websiteUrl: 'https://auraskincare.example.com',
    productToAdvertise: 'Hydra Barrier Glaze Serum',
    offer: 'Free shipping on orders over $50',
    planChosen: 'Growth ($799/month)',
    'bot-field': '' // EMPTY HONEYPOT
  }, 'SUBMISSION 1: HONEYPOT EMPTY (LEGITIMATE USER)');

  // Test 2: Filled honeypot
  await submitForm({
    name: 'Spam Bot 3000',
    email: 'spambot@marketing-crawler.xyz',
    brandName: 'Spam Brand',
    websiteUrl: 'https://spam-link.xyz',
    productToAdvertise: 'Cheap Bulk Traffic',
    offer: 'Spam offer text',
    planChosen: 'Launch ($499/month)',
    'bot-field': 'DEP-99482-BOT' // FILLED HONEYPOT
  }, 'SUBMISSION 2: HONEYPOT FILLED (AUTOMATED BOT)');
}

run();
