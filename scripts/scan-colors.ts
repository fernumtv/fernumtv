import fs from "fs";
import path from "path";

const srcDir = path.resolve("./src");

const colorRegex = /(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)|(?:bg|text|border|fill|stroke)-(?:neutral|amber|emerald|slate|zinc|gray|red|orange|yellow|green|blue|indigo|purple|pink|rose)-\d+|(?<![a-zA-Z0-9_-])(?:bg|text|border)-(?:white|black)\b)/g;

const foundInFiles: { file: string; matches: { line: number; text: string; match: string }[] }[] = [];

function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        scanDir(fullPath);
      }
    } else if (/\.(tsx?|jsx?|css|html)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      const matches: { line: number; text: string; match: string }[] = [];
      lines.forEach((lineText, idx) => {
        const lineMatches = lineText.match(colorRegex);
        if (lineMatches) {
          lineMatches.forEach(m => {
            matches.push({ line: idx + 1, text: lineText.trim(), match: m });
          });
        }
      });
      if (matches.length > 0) {
        foundInFiles.push({ file: path.relative(".", fullPath).replace(/\\/g, "/"), matches });
      }
    }
  }
}

scanDir(srcDir);

console.log(`Found hard-coded colors in ${foundInFiles.length} files:`);
foundInFiles.forEach(f => {
  console.log(`- ${f.file}: ${f.matches.length} occurrences`);
});

if (!fs.existsSync("./scratch")) {
  fs.mkdirSync("./scratch", { recursive: true });
}
fs.writeFileSync("./scratch/hardcoded_colors_report.json", JSON.stringify(foundInFiles, null, 2));
