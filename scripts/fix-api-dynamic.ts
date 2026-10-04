import fs from "fs";
import path from "path";

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === "route.ts") {
      let content = fs.readFileSync(full, "utf8");
      if (!content.includes("export const dynamic")) {
        content = `export const dynamic = "force-dynamic";\n\n` + content;
        fs.writeFileSync(full, content, "utf8");
        console.log("Updated:", full);
      }
    }
  }
}

walk(path.resolve(__dirname, "../src/app/api"));
console.log("Done updating API routes to force-dynamic!");
