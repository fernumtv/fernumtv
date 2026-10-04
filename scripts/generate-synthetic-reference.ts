import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/db";

interface ScriptConfig {
  creatorIdOrName: string;
  prompt: string;
  confirmed: boolean;
  outputDir?: string;
}

const DEFAULT_KORA_PROMPT =
  "Ultra-detailed studio portrait of Kora Vance, a 34-year-old female biochemical researcher and longevity scientist with sharp intelligent hazel eyes, clean tied-back dark hair, soft clinical lighting, looking directly into the camera with composed confidence, neutral gray studio backdrop, 9:16 vertical framing.";

async function main() {
  const args = process.argv.slice(2);
  const config: ScriptConfig = {
    creatorIdOrName: "Kora Vance",
    prompt: DEFAULT_KORA_PROMPT,
    confirmed: args.includes("--confirm"),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--creator" && args[i + 1]) {
      config.creatorIdOrName = args[i + 1];
    }
    if (args[i] === "--prompt" && args[i + 1]) {
      config.prompt = args[i + 1];
    }
    if (args[i] === "--output" && args[i + 1]) {
      config.outputDir = args[i + 1];
    }
  }

  console.log("=================================================================");
  console.log("🧬 FERNUM SYNTHETIC CREATOR REFERENCE GENERATOR");
  console.log("=================================================================\n");

  // 1. Resolve Creator in Database
  let creator = await prisma.creator.findFirst({
    where: {
      OR: [
        { id: config.creatorIdOrName },
        { name: { contains: config.creatorIdOrName } },
        { id: "creator_kora_vance" },
      ],
    },
  });

  const creatorName = creator?.name || config.creatorIdOrName;
  const creatorId = creator?.id || "creator_kora_vance";

  // 2. Resolve Pricing & Mode (Verified from https://fal.ai/models/fal-ai/flux-pro/v1.1/llms.txt on Oct 1, 2026)
  const falKey = process.env.FAL_KEY;
  const isPaidMode = Boolean(falKey && falKey.trim().length > 5);
  const modelName = isPaidMode ? "fal-ai/flux-pro/v1.1 (VERIFIED: $0.04/MP)" : "Mock Synthetic Character Generator (Offline / Free)";
  const unitPriceUsd = isPaidMode ? 0.0400 : 0.0000;

  console.log(`👤 Target Creator:     ${creatorName} (ID: ${creatorId})`);
  console.log(`🎨 Synthetic Prompt:    "${config.prompt.slice(0, 70)}..."`);
  console.log(`⚙️ Engine Mode:        ${modelName}`);
  console.log(`💰 Unit Price:         $${unitPriceUsd.toFixed(4)} USD / megapixel (Verified Oct 1, 2026)`);
  console.log(`💵 TOTAL ESTIMATE:     $${unitPriceUsd.toFixed(4)} USD\n`);

  // 3. Safety Confirmation Gate
  if (!config.confirmed) {
    console.log("-----------------------------------------------------------------");
    console.log("🛑 SAFETY CONFIRMATION REQUIRED BEFORE GENERATION");
    console.log("-----------------------------------------------------------------");
    console.log("This script prints the estimated cost before executing any calls.");
    console.log("To confirm and generate the synthetic reference, run:");
    console.log(`   npx tsx scripts/generate-synthetic-reference.ts --creator "${creatorName}" --confirm\n`);
    if (isPaidMode) {
      console.log(`⚠️  NOTE: Running with --confirm will bill $${unitPriceUsd.toFixed(4)} to your FAL_KEY account.`);
    } else {
      console.log("ℹ️  NOTE: Running in mock mode is 100% free and requires zero paid keys.");
    }
    console.log("Exiting safely without generating images.");
    process.exit(0);
  }

  // 4. Execution
  console.log(`🚀 Confirmation received. Generating synthetic reference for ${creatorName}...`);

  const storageDir = config.outputDir || path.resolve(process.cwd(), ".storage", "creators");
  const publicDir = path.resolve(process.cwd(), "public", "synthetic-assets", "creators");
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const filename = `${creatorId}-locked-reference-${Date.now()}`;
  let finalAssetUrl = `/synthetic-assets/creators/kora-vance-ref.svg`;

  if (isPaidMode) {
    console.log("   Calling Fal.ai text-to-image API (fal-ai/flux-pro/v1.1)...");
    const response = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: config.prompt,
        image_size: "portrait_16_9",
        safety_tolerance: "2",
      }),
    });

    if (!response.ok) {
      throw new Error(`Fal.ai API error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    const generatedUrl = data.images?.[0]?.url;
    if (!generatedUrl) {
      throw new Error("Fal.ai response missing generated image URL");
    }

    // Download and persist locally
    const imgRes = await fetch(generatedUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const savedPath = path.join(publicDir, `${filename}.jpg`);
    fs.writeFileSync(savedPath, buffer);
    finalAssetUrl = `/synthetic-assets/creators/${filename}.jpg`;
    console.log(`   Saved synthetic reference to ${savedPath}`);
  } else {
    // Offline / Mock mode: copy or generate synthetic reference
    const mockRefFile = path.join(publicDir, `${filename}.svg`);
    const sourceSvg = path.join(publicDir, "kora-vance-ref.svg");
    if (fs.existsSync(sourceSvg)) {
      fs.copyFileSync(sourceSvg, mockRefFile);
    } else {
      fs.writeFileSync(mockRefFile, `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1365"><rect width="100%" height="100%" fill="#064e3b"/><text x="50%" y="50%" fill="#10b981" font-size="24" text-anchor="middle">Synthetic Creator: ${creatorName}</text></svg>`);
    }
    finalAssetUrl = `/synthetic-assets/creators/${filename}.svg`;
    console.log(`   Created synthetic reference file: ${mockRefFile}`);
  }

  // 5. Update Creator Record in Database
  if (creator) {
    await prisma.creator.update({
      where: { id: creator.id },
      data: {
        faceRefUrls: JSON.stringify([finalAssetUrl]),
        avatarUrl: finalAssetUrl,
        isSynthetic: true,
        status: "LOCKED",
        identityToken: `creator_${creator.id}_synthetic_lock`,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: creator.organizationId,
        workspaceId: creator.workspaceId,
        action: "CREATOR_SYNTHETIC_REFERENCE_LOCKED",
        targetEntity: "CREATOR",
        targetId: creator.id,
        metadata: JSON.stringify({
          creatorName: creator.name,
          finalAssetUrl,
          isSynthetic: true,
          mode: modelName,
          costUsd: unitPriceUsd,
          timestamp: new Date().toISOString(),
        }),
      },
    });

    console.log(`\n✅ Database updated for creator: "${creator.name}"`);
    console.log(`   • isSynthetic:   true`);
    console.log(`   • status:        LOCKED`);
    console.log(`   • faceRefUrls:   ["${finalAssetUrl}"]`);
    console.log(`   • avatarUrl:     "${finalAssetUrl}"`);
    console.log(`   • auditLog:      Logged CREATOR_SYNTHETIC_REFERENCE_LOCKED`);
  } else {
    console.log(`ℹ️  No creator with ID ${creatorId} found in database. Generated standalone reference: ${finalAssetUrl}`);
  }

  console.log("\n=================================================================");
  console.log("🎉 SYNTHETIC REFERENCE GENERATION COMPLETE!");
  console.log("=================================================================\n");
}

main().catch((err) => {
  console.error("Synthetic reference generation failed:", err);
  process.exit(1);
});
