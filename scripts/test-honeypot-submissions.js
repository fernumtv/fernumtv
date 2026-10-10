const http = require('http');

async function submitToApi(formData, host = 'localhost', port = 3100, label) {
  return new Promise((resolve) => {
    console.log(`\n========================================`);
    console.log(`TEST RUN: ${label}`);
    console.log(`Payload bot-field: "${formData['bot-field'] || ''}"`);
    console.log(`========================================`);

    const postData = JSON.stringify({
      ...formData,
      timestamp: Date.now() - 5000 // 5 seconds ago to pass time-trap
    });

    const options = {
      hostname: host,
      port: port,
      path: '/api/brief',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestRunner/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = {};
        try { json = JSON.parse(data); } catch {}
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log(`Response Body:`, json);
        resolve({
          statusCode: res.statusCode,
          json
        });
      });
    });

    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve({ error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log("=== TESTING /api/brief SERVERLESS FUNCTION ===");

  // Test 1: Valid submission with empty honeypot
  await submitToApi({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    brandName: 'Aura Skincare',
    websiteUrl: 'https://auraskincare.example.com',
    productToAdvertise: 'Hydra Barrier Glaze Serum',
    offer: 'Free shipping on orders over $50 with code GLOW50',
    planChosen: 'Growth ($799/month)',
    'bot-field': '' // EMPTY HONEYPOT
  }, 'localhost', 3100, 'TEST 1: VALID SUBMISSION (EMPTY HONEYPOT)');

  // Test 2: Filled honeypot (Bot attack)
  await submitToApi({
    name: 'Spam Bot 3000',
    email: 'spambot@marketing-crawler.xyz',
    brandName: 'Spam Brand',
    websiteUrl: 'https://spam-link.xyz',
    productToAdvertise: 'Cheap Bulk Traffic',
    offer: 'Spam offer text',
    planChosen: 'Launch ($499/month)',
    'bot-field': 'DEP-99482-BOT' // FILLED HONEYPOT
  }, 'localhost', 3100, 'TEST 2: FILLED HONEYPOT (BOT TRAP)');

  // Test 3: Invalid data (Missing required field & invalid email)
  await submitToApi({
    name: '',
    email: 'not-an-email',
    brandName: '',
    websiteUrl: 'invalid-url',
    productToAdvertise: '',
    offer: '',
    planChosen: 'Launch ($499/month)',
    'bot-field': ''
  }, 'localhost', 3100, 'TEST 3: INVALID DATA VALIDATION');
}

run();
