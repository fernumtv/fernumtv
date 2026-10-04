import { prisma } from "@/lib/db";
import { assembleCreatorContext } from "@/lib/creators/context";
import { getTextModel } from "@/lib/ai/interfaces";
import { runCompliancePrecheck, CompliancePrecheckResult } from "@/lib/compliance/precheck";
import { logAuditAction } from "@/lib/audit";

export type PipelineStepName = "idea" | "hook" | "script" | "storyboard" | "caption" | "thumbnail";

export interface GenerateStepResult {
  step: PipelineStepName;
  version: number;
  content: any;
  compliance: CompliancePrecheckResult;
  costUsd: number;
  tokensUsed: number;
}

/**
 * Builds grounded generation prompt injecting Creator Identity, Lore, and Brand Brain
 */
function buildStepPrompt(
  step: PipelineStepName,
  contentItem: any,
  context: any,
  userInstruction?: string
): { prompt: string; systemInstruction: string } {
  const { identity, memories, brandContext } = context;

  const systemInstruction = `You are the AI Creative Director and Ghostwriter for virtual creator "${identity.name}".
Your goal is to produce elite, authentic content strictly following the creator's voice, rules, and brand guidelines.

CREATOR IDENTITY:
- Archetype: ${identity.type}
- Niche: ${identity.niche}
- Tone: ${identity.tone}
- Personality: ${identity.personality}
- Signature Vocabulary: ${identity.vocabulary || "N/A"}
- Behavior Rules: ${identity.behaviorRules || "N/A"}
- Content Pillars: ${identity.contentPillars || "N/A"}
- Preferred Topics: ${identity.preferredTopics || "N/A"}
- Prohibited Topics: ${identity.prohibitedTopics || "N/A"}

PERSISTENT MEMORY & LORE (Facts known by ${identity.name}):
${memories.map((m: any) => `- [${m.category}] ${m.fact}`).join("\n") || "No prior lore recorded."}

BRAND BRAIN GUIDELINES (${brandContext?.brandName || "Brand"}):
- Positioning: ${brandContext?.positioning || "N/A"}
- Approved Messaging: ${brandContext?.approvedTerminology || "N/A"}
- CTA Rules: ${brandContext?.ctaRules || "N/A"}
- ZERO-TOLERANCE PROHIBITED CLAIMS: ${brandContext?.prohibitedClaims || "None"}
- LEGAL RESTRICTIONS: ${brandContext?.prohibitedTopics || "None"}

CRITICAL RULE: Never generate any prohibited claim or topic. Always adhere strictly to the creator's persona.`;

  let prompt = `Topic / Working Title: "${contentItem.topic}"\n`;

  if (step === "idea") {
    prompt += `Generate a creative video concept and core angle for ${identity.name} for platform ${contentItem.platform}.
Explain why this concept fits the creator's niche and audience personas.`;
  } else if (step === "hook") {
    prompt += `Generate 3 distinct, high-retention hook variations (first 3 seconds) for a short-form video on this topic.
Format your response as a valid JSON array of objects with keys: "angle", "hook", "reasoning".`;
  } else if (step === "script") {
    const activeHook = contentItem.hookText || "Hook placeholder";
    prompt += `Using this approved hook: "${activeHook}"
Write 2 script variations tailored for 45-60 second pacing.
Include spoken lines and visual action cues [in brackets].
Format as a JSON array of objects with keys: "versionName", "durationSec", "script".`;
  } else if (step === "storyboard") {
    const activeScript = contentItem.script || "Script placeholder";
    prompt += `Based on this script:
"""${activeScript}"""
Generate a shot-by-shot storyboard breakdown with 4 to 6 key scenes.
Format as a JSON object with a "scenes" array, where each scene has: "sceneNumber", "timecode", "shotType", "visualPrompt", "audioNotes".`;
  } else if (step === "caption") {
    const activeScript = contentItem.script || "Script placeholder";
    prompt += `Write an engaging caption and relevant hashtags for platform ${contentItem.platform} based on:
"""${activeScript}"""
Include mandatory disclaimers if required by brand rules. Format as JSON with "caption" and "hashtags" array.`;
  } else if (step === "thumbnail") {
    prompt += `Generate a high-CTR thumbnail concept for this video.
Format as a JSON object with: "conceptTitle", "visualPrompt", "overlayText", "recommendedColorPalette".`;
  }

  if (userInstruction) {
    prompt += `\n\nSpecific Creative Director Note: ${userInstruction}`;
  }

  return { prompt, systemInstruction };
}

/**
 * Runs generation for any pipeline step, runs compliance check, records step version, and updates item.
 */
export async function executePipelineStepGeneration(
  contentItemId: string,
  step: PipelineStepName,
  userId: string,
  userInstruction?: string
): Promise<GenerateStepResult> {
  const contentItem = await prisma.contentItem.findUnique({
    where: { id: contentItemId },
    include: { creator: true, workspace: true },
  });

  if (!contentItem) throw new Error(`ContentItem ${contentItemId} not found.`);

  // 1. Assemble unified context (creator identity + memories + brand brain)
  let context: any;
  if (contentItem.creatorId) {
    context = await assembleCreatorContext(contentItem.creatorId);
  } else {
    // Campaign-less item without creator: fallback to brand brain only
    const brandBrain = await prisma.brandBrain.findUnique({
      where: { workspaceId: contentItem.workspaceId },
    });
    context = {
      identity: {
        name: "Brand Spokesperson",
        type: "TALKING_HEAD",
        niche: "Brand Communications",
        tone: brandBrain?.toneOfVoice || "Professional",
        personality: "Authoritative",
      },
      memories: [],
      brandContext: brandBrain,
    };
  }

  // 2. Build prompt and invoke TextModel adapter
  const { prompt, systemInstruction } = buildStepPrompt(step, contentItem, context, userInstruction);
  const textModel = getTextModel();

  const modelResult = await textModel.generateText({
    prompt,
    systemInstruction,
    stepContext: step,
    organizationId: contentItem.organizationId,
    workspaceId: contentItem.workspaceId,
  });

  const rawOutput = modelResult.data.text;
  let parsedContent: any;
  try {
    parsedContent = JSON.parse(rawOutput);
  } catch {
    parsedContent = rawOutput;
  }

  // 3. Run Compliance Pre-Check
  const textToScan = typeof parsedContent === "string" ? parsedContent : JSON.stringify(parsedContent);
  const complianceResult = await runCompliancePrecheck(contentItem.workspaceId, textToScan);

  // 4. Determine step version number
  const existingSteps = await prisma.contentPipelineStep.findMany({
    where: { contentItemId, step },
    orderBy: { version: "desc" },
    take: 1,
  });
  const nextVersion = existingSteps.length > 0 ? existingSteps[0].version + 1 : 1;

  // 5. Save ContentPipelineStep
  await prisma.contentPipelineStep.create({
    data: {
      organizationId: contentItem.organizationId,
      workspaceId: contentItem.workspaceId,
      contentItemId,
      step,
      version: nextVersion,
      contentJson: typeof parsedContent === "string" ? parsedContent : JSON.stringify(parsedContent),
      chosenVariant: 0,
      complianceJson: JSON.stringify(complianceResult),
      modelName: modelResult.telemetry.model,
      costUsd: modelResult.telemetry.costUsd,
      createdByUserId: userId,
    },
  });

  // 6. Update ContentItem active fields & estimated cost
  const updateData: any = {
    estimatedCost: contentItem.estimatedCost + modelResult.telemetry.costUsd,
    complianceFlags: complianceResult.findings.length > 0 ? JSON.stringify(complianceResult.findings) : null,
  };

  if (step === "hook") {
    if (Array.isArray(parsedContent) && parsedContent[0]?.hook) {
      updateData.hookText = parsedContent[0].hook;
      updateData.selectedHookIndex = 0;
    } else if (typeof parsedContent === "string") {
      updateData.hookText = parsedContent;
    }
  } else if (step === "script") {
    if (Array.isArray(parsedContent) && parsedContent[0]?.script) {
      updateData.script = parsedContent[0].script;
      updateData.selectedScriptIndex = 0;
      updateData.status = "SCRIPTED";
    } else if (typeof parsedContent === "string") {
      updateData.script = parsedContent;
      updateData.status = "SCRIPTED";
    }
  } else if (step === "storyboard") {
    updateData.storyboard = typeof parsedContent === "string" ? parsedContent : JSON.stringify(parsedContent);
  } else if (step === "caption") {
    if (parsedContent?.caption) {
      updateData.caption = `${parsedContent.caption}\n\n${(parsedContent.hashtags || []).join(" ")}`;
    } else {
      updateData.caption = typeof parsedContent === "string" ? parsedContent : JSON.stringify(parsedContent);
    }
  } else if (step === "thumbnail") {
    updateData.thumbnailConcept = typeof parsedContent === "string" ? parsedContent : JSON.stringify(parsedContent);
  }

  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: updateData,
  });

  await logAuditAction({
    organizationId: contentItem.organizationId,
    workspaceId: contentItem.workspaceId,
    userId,
    action: `PIPELINE_STEP_GENERATED_${step.toUpperCase()}`,
    targetEntity: "ContentItem",
    targetId: contentItemId,
    metadata: {
      step,
      version: nextVersion,
      costUsd: modelResult.telemetry.costUsd,
      compliancePassed: complianceResult.passed,
    },
  });

  return {
    step,
    version: nextVersion,
    content: parsedContent,
    compliance: complianceResult,
    costUsd: modelResult.telemetry.costUsd,
    tokensUsed: modelResult.data.tokensUsed,
  };
}

/**
 * Reverts a pipeline step to an earlier historical version
 */
export async function revertPipelineStepVersion(
  contentItemId: string,
  step: PipelineStepName,
  targetVersion: number,
  userId: string
) {
  const targetStepRecord = await prisma.contentPipelineStep.findFirst({
    where: { contentItemId, step, version: targetVersion },
  });

  if (!targetStepRecord) {
    throw new Error(`Pipeline step '${step}' version ${targetVersion} not found.`);
  }

  const contentItem = await prisma.contentItem.findUnique({
    where: { id: contentItemId },
  });
  if (!contentItem) throw new Error(`ContentItem ${contentItemId} not found.`);

  let parsed: any;
  try {
    parsed = JSON.parse(targetStepRecord.contentJson);
  } catch {
    parsed = targetStepRecord.contentJson;
  }

  const updateData: any = {};
  if (step === "hook") {
    if (Array.isArray(parsed) && parsed[targetStepRecord.chosenVariant]?.hook) {
      updateData.hookText = parsed[targetStepRecord.chosenVariant].hook;
      updateData.selectedHookIndex = targetStepRecord.chosenVariant;
    } else {
      updateData.hookText = targetStepRecord.contentJson;
    }
  } else if (step === "script") {
    if (Array.isArray(parsed) && parsed[targetStepRecord.chosenVariant]?.script) {
      updateData.script = parsed[targetStepRecord.chosenVariant].script;
      updateData.selectedScriptIndex = targetStepRecord.chosenVariant;
    } else {
      updateData.script = targetStepRecord.contentJson;
    }
  } else if (step === "storyboard") {
    updateData.storyboard = targetStepRecord.contentJson;
  } else if (step === "caption") {
    updateData.caption = targetStepRecord.contentJson;
  } else if (step === "thumbnail") {
    updateData.thumbnailConcept = targetStepRecord.contentJson;
  }

  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: updateData,
  });

  await logAuditAction({
    organizationId: contentItem.organizationId,
    workspaceId: contentItem.workspaceId,
    userId,
    action: `PIPELINE_STEP_REVERTED_${step.toUpperCase()}`,
    targetEntity: "ContentItem",
    targetId: contentItemId,
    metadata: { step, revertedToVersion: targetVersion },
  });

  return { success: true, revertedVersion: targetVersion };
}

/**
 * Calculates aggregated cost rollups per creator and campaign-less items
 */
export async function getCostRollups(workspaceId: string) {
  const items = await prisma.contentItem.findMany({
    where: { workspaceId },
    select: {
      id: true,
      creatorId: true,
      estimatedCost: true,
      creator: { select: { id: true, name: true } },
    },
  });

  const perCreator: Record<string, { creatorName: string; totalCost: number; itemCount: number }> = {};
  let campaignlessTotal = 0;
  let campaignlessCount = 0;
  let totalWorkspaceSpend = 0;

  for (const item of items) {
    const cost = item.estimatedCost || 0;
    totalWorkspaceSpend += cost;

    if (item.creatorId && item.creator) {
      if (!perCreator[item.creatorId]) {
        perCreator[item.creatorId] = {
          creatorName: item.creator.name,
          totalCost: 0,
          itemCount: 0,
        };
      }
      perCreator[item.creatorId].totalCost += cost;
      perCreator[item.creatorId].itemCount += 1;
    } else {
      campaignlessTotal += cost;
      campaignlessCount += 1;
    }
  }

  return {
    totalWorkspaceSpend: parseFloat(totalWorkspaceSpend.toFixed(4)),
    perCreator: Object.entries(perCreator).map(([creatorId, val]) => ({
      creatorId,
      creatorName: val.creatorName,
      totalCost: parseFloat(val.totalCost.toFixed(4)),
      itemCount: val.itemCount,
    })),
    campaignless: {
      totalCost: parseFloat(campaignlessTotal.toFixed(4)),
      itemCount: campaignlessCount,
    },
  };
}
