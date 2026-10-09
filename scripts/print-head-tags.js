const fs = require("fs");
const path = require("path");

const pages = [
  { name: "/", file: "index.html" },
  { name: "/work", file: "work.html" },
  { name: "/faq", file: "faq.html" },
  { name: "/terms", file: "terms.html" },
  { name: "/login", file: "login.html" },
];

pages.forEach((p) => {
  const filePath = path.join(".next/server/app", p.file);
  console.log(`\n================================================================`);
  console.log(`HEAD TAGS: ${p.name} (${p.file})`);
  console.log(`================================================================`);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf8");
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const tags = headMatch[1]
        .split(/(?=<)/)
        .map((t) => t.trim())
        .filter(
          (t) =>
            t.startsWith("<title") ||
            t.startsWith("<meta") ||
            t.startsWith("<link") ||
            t.startsWith('<script type="application/ld+json"')
        );
      tags.forEach((tag) => console.log(tag));
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
