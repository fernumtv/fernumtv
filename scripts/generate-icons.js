const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const svgContent = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');

async function renderIcon(size, outputPath) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size });
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.screenshot({ path: outputPath, omitBackground: true });
  await browser.close();
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

(async () => {
  await renderIcon(180, path.join(__dirname, '../public/apple-touch-icon.png'));
  await renderIcon(192, path.join(__dirname, '../public/icon-192.png'));
  await renderIcon(512, path.join(__dirname, '../public/icon-512.png'));
  console.log('All icons generated successfully!');
})();
