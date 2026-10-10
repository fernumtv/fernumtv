const https = require('https');

async function runDiagnosis() {
  console.log("=== 1. DIAGNOSIS OF LIVE /api/auth/magic-link ===");
  const testEmails = ['fernumtv@gmail.com', 'client@example.com'];
  for (const email of testEmails) {
    const res = await fetch('https://fernum.online/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    console.log(`Email: ${email} | Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Response JSON:', JSON.stringify(data, null, 2));
  }

  console.log("\n=== 2. DIAGNOSIS OF LIVE HTML & CLIENT BUNDLE ===");
  const html = await fetch('https://fernum.online/login').then(r => r.text());
  console.log("HTML length:", html.length);
  // Find script tags
  const scriptRegex = /src="(\/_next\/static\/chunks\/[^"]+)"/g;
  let match;
  const chunkUrls = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    chunkUrls.push(match[1]);
  }
  console.log("Found chunks:", chunkUrls);

  for (const chunk of chunkUrls) {
    const chunkJs = await fetch(`https://fernum.online${chunk}`).then(r => r.text());
    if (chunkJs.includes('supabase') || chunkJs.includes('SUPABASE')) {
      console.log(`\n--- Inspecting chunk: ${chunk} ---`);
      const supabaseRefs = chunkJs.match(/[a-zA-Z0-9_]*supabase[a-zA-Z0-9_]*/gi);
      console.log("Supabase references in chunk:", [...new Set(supabaseRefs)].slice(0, 10));
      if (chunkJs.includes('NEXT_PUBLIC_SUPABASE_URL')) {
        console.log("Found literal NEXT_PUBLIC_SUPABASE_URL reference in chunk!");
      }
      // Check if any url like https://*.supabase.co is embedded in the build
      const urlMatches = chunkJs.match(/https:\/\/[a-z0-9-]+\.supabase\.co/gi);
      console.log("Hardcoded/Inlined Supabase URLs in bundle:", urlMatches);
    }
  }
}

runDiagnosis().catch(console.error);
