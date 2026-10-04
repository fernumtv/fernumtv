import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/db";
import { mockImageModel } from "../src/lib/ai/interfaces";

interface ExperimentConfig {
  creatorIdOrName?: string;
  count: number;
  confirmed: boolean;
  outputDir?: string;
}

const DIVERSE_PROMPTS = [
  "Medium close-up portrait in modern biochemical laboratory, looking directly at camera with confident composed expression, soft clinical lighting, 9:16 vertical framing.",
  "Side profile shot holding an unbranded dark glass amber dropper bottle, clean minimalist aesthetic, morning sunlight streaming through window, 9:16 vertical.",
  "Speaking to camera at an academic medical seminar, dark backdrop with subtle emerald lighting, natural speaking gesture, 9:16 vertical portrait.",
  "Outdoor lifestyle portrait in natural daylight, crisp neutral blazer, neutral blurred greenery in background, direct eye contact with lens, 9:16 vertical."
];

async function main() {
  const args = process.argv.slice(2);
  const config: ExperimentConfig = {
    count: 4,
    confirmed: args.includes("--confirm"),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--creator" && args[i + 1]) {
      config.creatorIdOrName = args[i + 1];
    }
    if (args[i] === "--count" && args[i + 1]) {
      config.count = Math.max(1, Math.min(10, parseInt(args[i + 1], 10) || 4));
    }
    if (args[i] === "--output" && args[i + 1]) {
      config.outputDir = args[i + 1];
    }
  }

  console.log("=================================================================");
  console.log("📸 FERNUM CREATOR IDENTITY EXPERIMENT & CONTACT SHEET GENERATOR");
  console.log("=================================================================\n");

  // 1. Resolve Creator & Reference Images
  let creator: any = null;
  if (config.creatorIdOrName) {
    creator = await prisma.creator.findFirst({
      where: {
        OR: [
          { id: config.creatorIdOrName },
          { name: { contains: config.creatorIdOrName } }
        ]
      }
    });
  }

  if (!creator) {
    // Default to Kora Vance (or first creator with locked face reference)
    creator = await prisma.creator.findFirst({
      where: { name: { contains: "Kora" } }
    }) || await prisma.creator.findFirst({
      where: { faceRefUrls: { not: null } },
      orderBy: { createdAt: "desc" }
    });
  }

  const creatorName = creator?.name || "Kora Vance";
  let referenceImageUrl = "/synthetic-assets/creators/kora-vance-ref.svg";

  if (creator?.faceRefUrls) {
    try {
      const parsed = JSON.parse(creator.faceRefUrls);
      referenceImageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      referenceImageUrl = creator.faceRefUrls.split(",")[0]?.trim();
    }
  }

  // 2. Pricing & Mode Resolution
  const falKey = process.env.FAL_KEY;
  const isPaidMode = Boolean(falKey && falKey.trim().length > 5);
  const providerName = isPaidMode ? "fal-ai/flux-pulid (Real Hosted Adapter)" : "Mock Image Adapter (Offline / Free)";
  const costPerImageUsd = isPaidMode ? 0.0333 : 0.0000;
  const totalCostEstimateUsd = parseFloat((costPerImageUsd * config.count).toFixed(4));

  console.log(`👤 Target Creator:   ${creatorName}`);
  console.log(`🖼️ Locked Reference: ${referenceImageUrl}`);
  console.log(`🔢 Variations (N):   ${config.count}`);
  console.log(`⚙️ Engine Mode:      ${providerName}`);
  console.log(`💰 Unit Price:       $${costPerImageUsd.toFixed(4)} / image`);
  console.log(`💵 TOTAL ESTIMATE:   $${totalCostEstimateUsd.toFixed(4)} USD\n`);

  // 3. Confirmation Gate
  if (!config.confirmed) {
    console.log("-----------------------------------------------------------------");
    console.log("🛑 SAFETY CONFIRMATION REQUIRED BEFORE GENERATION");
    console.log("-----------------------------------------------------------------");
    console.log("This script prints the estimated cost before executing any calls.");
    console.log("To confirm and run generation, pass the --confirm flag:");
    console.log(`   npx tsx scripts/identity-experiment.ts --count ${config.count} --confirm\n`);
    if (isPaidMode) {
      console.log(`⚠️  NOTE: Running with --confirm will bill ~$${totalCostEstimateUsd.toFixed(4)} to your FAL_KEY account.`);
    } else {
      console.log("ℹ️  NOTE: Running in mock mode is 100% free and requires zero paid keys.");
    }
    console.log("Exiting safely without generating images.");
    process.exit(0);
  }

  // 4. Execute Generation
  console.log(`🚀 Confirmation received. Generating ${config.count} variations...`);
  const timestamp = Date.now();
  const targetDir = config.outputDir || path.resolve(process.cwd(), ".storage", "experiments", `identity-${timestamp}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const generatedCards: Array<{
    index: number;
    prompt: string;
    imageUrl: string;
    seed: number;
    latencyMs: number;
  }> = [];

  for (let i = 0; i < config.count; i++) {
    const prompt = DIVERSE_PROMPTS[i % DIVERSE_PROMPTS.length];
    const start = Date.now();
    console.log(`   [${i + 1}/${config.count}] Generating: "${prompt.slice(0, 55)}..."`);

    let resultImageUrl = "";
    let resultSeed = Math.floor(Math.random() * 1000000);

    if (isPaidMode) {
      try {
        const response = await fetch("https://fal.run/fal-ai/flux-pulid", {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            reference_image_url: referenceImageUrl,
            image_size: "portrait_4_3", // 9:16 or portrait
            num_inference_steps: 20,
            guidance_scale: 4,
          }),
        });

        if (!response.ok) {
          throw new Error(`Fal API error (${response.status}): ${await response.text()}`);
        }

        const data = await response.json();
        resultImageUrl = data.images?.[0]?.url || referenceImageUrl;
        resultSeed = data.seed || resultSeed;
      } catch (err: any) {
        console.warn(`   ⚠️ Real provider failed (${err.message}). Falling back to mock adapter.`);
        const mockRes = await mockImageModel.generateImage({
          prompt,
          faceRefUrls: [referenceImageUrl],
          organizationId: "org_fernum_studio",
          workspaceId: "ws_aura_health",
        });
        resultImageUrl = mockRes.data.imageUrl;
      }
    } else {
      const mockRes = await mockImageModel.generateImage({
        prompt,
        faceRefUrls: [referenceImageUrl],
        organizationId: "org_fernum_studio",
        workspaceId: "ws_aura_health",
      });
      resultImageUrl = mockRes.data.imageUrl;
    }

    const latencyMs = Date.now() - start;
    generatedCards.push({
      index: i + 1,
      prompt,
      imageUrl: resultImageUrl,
      seed: resultSeed,
      latencyMs,
    });
  }

  // 5. Generate HTML Contact Sheet
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Creator Identity Consistency Contact Sheet - ${creatorName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f1f5f9; margin: 0; padding: 32px; }
    .header { border-bottom: 1px solid #1e293b; padding-bottom: 24px; margin-bottom: 32px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
    .layout { display: grid; grid-template-columns: 320px 1fr; gap: 32px; }
    .reference-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; height: fit-content; position: sticky; top: 32px; }
    .reference-panel img { width: 100%; border-radius: 12px; aspect-ratio: 9/16; object-fit: cover; border: 2px solid #10b981; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; display: flex; flex-col; }
    .card img { width: 100%; aspect-ratio: 9/16; object-fit: cover; background: #000; }
    .card-body { padding: 16px; font-size: 12px; }
    .prompt { color: #94a3b8; line-height: 1.5; margin-bottom: 12px; height: 60px; overflow: hidden; text-overflow: ellipsis; }
    .meta { font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">${isPaidMode ? "REAL FAL PuLID ADAPTER" : "MOCK ADAPTER MODE"}</div>
    <h1 style="margin: 12px 0 6px 0; font-size: 26px;">Creator Identity Consistency Contact Sheet</h1>
    <p style="color: #94a3b8; margin: 0; font-size: 14px;">
      Creator: <strong>${creatorName}</strong> • Generated ${config.count} conditioned images • Model: <code>${providerName}</code> • Cost: $${totalCostEstimateUsd.toFixed(4)} USD
    </p>
  </div>

  <div class="layout">
    <!-- Left Column: Locked Identity Reference -->
    <div class="reference-panel">
      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981;">
        Locked Identity Reference
      </h3>
      <img src="${referenceImageUrl}" alt="Locked Reference Face" />
      <p style="font-size: 11px; color: #64748b; margin-top: 12px; font-family: monospace; word-break: break-all;">
        Source: ${referenceImageUrl}
      </p>
    </div>

    <!-- Right Grid: Generated Conditioned Variations -->
    <div class="gallery">
      ${generatedCards.map((c) => `
        <div class="card">
          <img src="${c.imageUrl}" alt="Variation ${c.index}" />
          <div class="card-body">
            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 6px;">Variation #${c.index}</div>
            <div class="prompt">&ldquo;${c.prompt}&rdquo;</div>
            <div class="meta">
              Seed: ${c.seed} • Latency: ${c.latencyMs}ms
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  </div>
</body>
</html>`;

  const contactSheetPath = path.join(targetDir, "index.html");
  fs.writeFileSync(contactSheetPath, htmlContent, "utf-8");

  console.log("\n=================================================================");
  console.log("🎉 EXPERIMENT COMPLETE & CONTACT SHEET GENERATED!");
  console.log("=================================================================");
  console.log(`📁 Target Directory: ${targetDir}`);
  console.log(`🌐 Contact Sheet:    ${contactSheetPath}`);
  console.log("Open the HTML file in any browser to inspect consistency by eye.\n");
}

main().catch((err) => {
  console.error("Experiment failed:", err);
  process.exit(1);
});
