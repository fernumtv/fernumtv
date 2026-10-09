const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const externalUrls = [
  "https://calendly.com/fernum-adpass/strategy",
  "https://test.dodopayments.com/buy/pdt_8m6i2k3l4n5o6p7q8r9s",
  "https://test.dodopayments.com/buy/pdt_1a2b3c4d5e6f7g8h9i0j",
  "https://test.dodopayments.com/buy/pdt_9z8y7x6w5v4u3t2s1r0q",
];

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith("https") ? https : http;
      const req = client.request(
        url,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        },
        (res) => {
          resolve({ url, status: res.statusCode, location: res.headers.location });
        }
      );
      req.on("error", (err) => resolve({ url, status: "ERR: " + err.message }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ url, status: "TIMEOUT" });
      });
      req.end();
    } catch (e) {
      resolve({ url, status: "ERR: " + e.message });
    }
  });
}

// Find all internal links and anchors in JSX files
function scanInternalLinks() {
  const links = new Set();
  const anchors = new Set();
  const files = [];

  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (f.endsWith(".tsx") || f.endsWith(".ts")) files.push(full);
    }
  }
  walk("src");

  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    // Match href="..."
    const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
    for (const m of hrefMatches) {
      const h = m[1];
      if (h.startsWith("/")) links.add(h);
      else if (h.startsWith("#")) anchors.add(h);
    }
  }

  return { links: Array.from(links), anchors: Array.from(anchors) };
}

(async () => {
  console.log("=== EXTERNAL LINKS CHECK ===");
  for (const u of externalUrls) {
    const res = await checkUrl(u);
    console.log(`${res.url} -> ${res.status}${res.location ? " (redirect: " + res.location + ")" : ""}`);
  }

  console.log("\n=== INTERNAL LINKS FOUND IN CODEBASE ===");
  const { links, anchors } = scanInternalLinks();
  console.log("Internal routes:", links);
  console.log("Anchors:", anchors);
})();
